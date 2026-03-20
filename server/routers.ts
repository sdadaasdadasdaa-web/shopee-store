import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createTransaction, getTransactionById } from "./bynet";
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
});

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

        return {
          success: true,
          transactionId: result.data.id,
          status: result.data.status,
          amount: result.data.amount,
          pix: result.data.pix,
          externalRef,
        };
      }),

    checkStatus: publicProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const result = await getTransactionById(input.transactionId);
        return {
          status: result.data.status,
          paidAt: result.data.paidAt,
          amount: result.data.amount,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
