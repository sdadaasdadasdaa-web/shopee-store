import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createTransaction, getTransactionById } from "./bynet";
import { sendUtmifyPendingOrder, sendUtmifyPaidOrder } from "./utmify";
import { z } from "zod";
import { nanoid } from "nanoid";

const addressSchema = z.object({
  street: z.string(),
  streetNumber: z.string(),
  complement: z.string().default(""),
  zipCode: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string().default("br"),
});

const itemSchema = z.object({
  title: z.string(),
  unitPrice: z.number().int(), // centavos
  quantity: z.number().int().min(1),
  tangible: z.boolean().default(true),
  externalRef: z.string().optional(),
});

const createPixTransactionSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    cpf: z.string().min(11).max(14),
    phone: z.string().min(10),
    address: addressSchema,
  }),
  items: z.array(itemSchema).min(1),
  shippingFee: z.number().int().default(0),
  metadata: z.string().optional(),
  trackingParams: z.object({
    src: z.string().nullable().optional(),
    sck: z.string().nullable().optional(),
    utm_source: z.string().nullable().optional(),
    utm_campaign: z.string().nullable().optional(),
    utm_medium: z.string().nullable().optional(),
    utm_content: z.string().nullable().optional(),
    utm_term: z.string().nullable().optional(),
  }).optional(),
});

// In-memory store for order data (for UTMify paid event)
const orderStore = new Map<string, {
  createdAt: string;
  customer: { name: string; email: string; phone: string; cpf: string };
  products: { id: string; name: string; quantity: number; priceInCents: number }[];
  totalInCents: number;
  trackingParams?: any;
}>();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  payment: router({
    createPix: publicProcedure
      .input(createPixTransactionSchema)
      .mutation(async ({ input }) => {
        const externalRef = `ACHA-${nanoid(10)}`;

        // Calcular o total em centavos
        const itemsTotal = input.items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
        const totalAmount = itemsTotal + input.shippingFee;

        // Limpar CPF (remover pontos e traços)
        const cleanCpf = input.customer.cpf.replace(/\D/g, "");
        const cleanPhone = input.customer.phone.replace(/\D/g, "");
        const cleanZip = input.customer.address.zipCode.replace(/\D/g, "");

        const result = await createTransaction({
          amount: totalAmount,
          paymentMethod: "PIX",
          customer: {
            name: input.customer.name,
            email: input.customer.email,
            document: {
              number: cleanCpf,
              type: "CPF",
            },
            phone: cleanPhone,
            externalRef,
            address: {
              ...input.customer.address,
              zipCode: cleanZip,
            },
          },
          shipping: {
            fee: input.shippingFee,
            address: {
              ...input.customer.address,
              zipCode: cleanZip,
            },
          },
          items: input.items.map((item, idx) => ({
            title: item.title,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            tangible: item.tangible,
            externalRef: item.externalRef || `item-${idx + 1}`,
          })),
          pix: {
            expiresInDays: 1,
          },
          metadata: JSON.stringify({
            order_number: externalRef,
            ...(input.metadata ? JSON.parse(input.metadata) : {}),
          }),
        });

        const pixCode = result.data.qrCode || result.data.pix?.qrcode || null;
        const pixImageUrl = result.data.pix?.url || null;
        const pixExpiration = result.data.pix?.expirationDate || null;
        const transactionId = result.data.id;

        // Formatar data UTC para UTMify
        const createdAtUTC = new Date().toISOString().replace("T", " ").substring(0, 19);

        // Preparar produtos para UTMify
        const utmifyProducts = input.items.map((item, idx) => ({
          id: item.externalRef || `item-${idx + 1}`,
          name: item.title,
          quantity: item.quantity,
          priceInCents: item.unitPrice * item.quantity,
        }));

        // Salvar dados do pedido para uso posterior (quando pagar)
        orderStore.set(transactionId, {
          createdAt: createdAtUTC,
          customer: {
            name: input.customer.name,
            email: input.customer.email,
            phone: cleanPhone,
            cpf: cleanCpf,
          },
          products: utmifyProducts,
          totalInCents: totalAmount,
          trackingParams: input.trackingParams,
        });

        // Enviar evento "waiting_payment" para UTMify (fire-and-forget)
        sendUtmifyPendingOrder({
          orderId: externalRef,
          customer: {
            name: input.customer.name,
            email: input.customer.email,
            phone: cleanPhone,
            cpf: cleanCpf,
          },
          products: utmifyProducts,
          totalInCents: totalAmount,
          trackingParams: input.trackingParams,
        }).catch((err) => {
          console.error("[UTMify] Error sending pending order:", err);
        });

        return {
          success: true,
          transactionId,
          status: result.data.status,
          amount: result.data.amount,
          pix: {
            qrCode: pixCode,
            qrCodeImageUrl: pixImageUrl,
            expirationDate: pixExpiration,
          },
          externalRef,
        };
      }),

    checkStatus: publicProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const result = await getTransactionById(input.transactionId);
        const status = result.data.status;

        // Se o status mudou para "paid", enviar evento para UTMify
        if (status === "paid" || status === "PAID") {
          const orderData = orderStore.get(input.transactionId);
          if (orderData) {
            // Enviar evento "paid" para UTMify (fire-and-forget)
            sendUtmifyPaidOrder({
              orderId: (typeof result.data.metadata === 'string' && result.data.metadata) ? JSON.parse(result.data.metadata).order_number : input.transactionId,
              createdAt: orderData.createdAt,
              customer: orderData.customer,
              products: orderData.products,
              totalInCents: orderData.totalInCents,
              trackingParams: orderData.trackingParams,
            }).catch((err) => {
              console.error("[UTMify] Error sending paid order:", err);
            });

            // Remover do store após enviar (evitar duplicatas)
            orderStore.delete(input.transactionId);
          }
        }

        return {
          status: result.data.status,
          paidAt: result.data.paidAt,
          amount: result.data.amount,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
