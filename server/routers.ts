import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPixTransaction, getTransactionStatus } from "./sigilopay";
import { sendUtmifyPendingOrder, sendUtmifyPaidOrder, sendUtmifyTrackingEvent } from "./utmify";
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

  // Proxy server-side para eventos de tracking UTMify
  // Contorna ad blockers que bloqueiam tracking.utmify.com.br
  tracking: router({
    sendEvent: publicProcedure
      .input(
        z.object({
          type: z.enum(["PageView", "InitiateCheckout", "ViewContent"]),
          lead: z.object({
            _id: z.string().optional(),
            userAgent: z.string(),
            locale: z.string(),
            parameters: z.record(z.string(), z.string()).optional(),
          }),
          event: z.object({
            pageTitle: z.string(),
            sourceUrl: z.string(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Capturar IP real do cliente
        const clientIp =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          ctx.req.socket.remoteAddress ||
          "";

        const result = await sendUtmifyTrackingEvent({
          type: input.type,
          lead: {
            ...input.lead,
            pixelId: "69251f2e83c0b0e4729553f9",
            ip: clientIp,
          },
          event: input.event,
          clientIp,
        });

        return {
          success: result.success,
          lead: result.lead || null,
          error: result.error || null,
        };
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
        const totalAmountCents = itemsTotal + input.shippingFee;

        // Converter centavos para reais (Sigilo Pay usa reais)
        const totalAmountReais = totalAmountCents / 100;
        const shippingFeeReais = input.shippingFee / 100;

        // Limpar CPF (remover pontos e traços)
        const cleanCpf = input.customer.cpf.replace(/\D/g, "");
        const cleanPhone = input.customer.phone.replace(/\D/g, "");

        // Formatar telefone para (XX) XXXXX-XXXX
        const formattedPhone = cleanPhone.length === 11
          ? `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
          : cleanPhone.length === 10
            ? `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`
            : cleanPhone;

        // Formatar CPF para XXX.XXX.XXX-XX
        const formattedCpf = cleanCpf.length === 11
          ? `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9)}`
          : cleanCpf;

        // Data de vencimento: amanhã
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
        const dueDateStr = dueDate.toISOString().split("T")[0];

        // Preparar produtos para Sigilo Pay (price = preço unitário em reais)
        const sigiloProducts = input.items.map((item, idx) => ({
          id: item.externalRef || `item-${idx + 1}`,
          name: item.title,
          quantity: item.quantity,
          price: item.unitPrice / 100, // converter centavos para reais (preço unitário)
        }));

        // Recalcular amount como Sigilo Pay espera: sum(price * quantity) + shippingFee
        // Isso garante que amount == soma dos products + shippingFee
        const calculatedAmount = sigiloProducts.reduce(
          (sum, p) => sum + p.price * p.quantity, 0
        ) + shippingFeeReais;

        const result = await createPixTransaction({
          identifier: externalRef,
          amount: calculatedAmount,
          shippingFee: shippingFeeReais > 0 ? shippingFeeReais : undefined,
          client: {
            name: input.customer.name,
            email: input.customer.email,
            phone: formattedPhone,
            document: formattedCpf,
          },
          products: sigiloProducts,
          dueDate: dueDateStr,
          metadata: {
            order_number: externalRef,
            ...(input.metadata ? JSON.parse(input.metadata) : {}),
          },
        });

        const transactionId = result.transactionId;
        const pixCode = result.pix?.code || null;
        const pixBase64 = result.pix?.base64 || null;
        const pixImageUrl = result.pix?.image || null;

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
          totalInCents: totalAmountCents,
          trackingParams: input.trackingParams,
        });

        // Log dos tracking params para debug
        console.log(`[UTMify] TrackingParams for ${externalRef}:`, JSON.stringify(input.trackingParams));

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
          totalInCents: totalAmountCents,
          trackingParams: input.trackingParams,
        }).catch((err) => {
          console.error("[UTMify] Error sending pending order:", err);
        });

        return {
          success: true,
          transactionId,
          status: result.status,
          amount: totalAmountCents, // retornar em centavos para manter compatibilidade com frontend
          pix: {
            qrCode: pixCode,
            qrCodeBase64: pixBase64,
            qrCodeImageUrl: pixImageUrl,
            expirationDate: dueDateStr,
          },
          externalRef,
        };
      }),

    checkStatus: publicProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const result = await getTransactionStatus(input.transactionId);

        // Mapear status da Sigilo Pay para o formato esperado pelo frontend
        // Sigilo Pay: PENDING, COMPLETED, FAILED, REFUNDED, CHARGED_BACK
        // Frontend espera: "paid", "pending", "failed", etc.
        let normalizedStatus = "pending";
        if (result.status === "COMPLETED") {
          normalizedStatus = "paid";
        } else if (result.status === "FAILED") {
          normalizedStatus = "failed";
        } else if (result.status === "REFUNDED") {
          normalizedStatus = "refunded";
        } else if (result.status === "CHARGED_BACK") {
          normalizedStatus = "charged_back";
        } else if (result.status === "PENDING") {
          normalizedStatus = "pending";
        }

        // Se o status mudou para "paid" (COMPLETED), enviar evento para UTMify
        if (normalizedStatus === "paid") {
          const orderData = orderStore.get(input.transactionId);
          if (orderData) {
            // Enviar evento "paid" para UTMify (fire-and-forget)
            sendUtmifyPaidOrder({
              orderId: result.clientIdentifier || input.transactionId,
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
          status: normalizedStatus,
          paidAt: result.payedAt || null,
          amount: Math.round(result.amount * 100), // converter reais para centavos
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
