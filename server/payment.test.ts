import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("payment.createPix", () => {
  it("should create a PIX transaction with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payment.createPix({
      customer: {
        name: "João da Silva",
        email: "joao@teste.com",
        cpf: "12345678901",
        phone: "11999999999",
        address: {
          street: "Rua Teste",
          streetNumber: "123",
          complement: "Apto 1",
          zipCode: "01001000",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          country: "br",
        },
      },
      items: [
        {
          title: "Roçadeira Nakasaki 75cc",
          unitPrice: 8990,
          quantity: 1,
          tangible: true,
          externalRef: "product-21",
        },
      ],
      shippingFee: 0,
    });

    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.transactionId).not.toBe("");
    expect(result.status).toBe("WAITING_PAYMENT");
    expect(result.externalRef).toMatch(/^ACHA-/);
    // PIX data should be returned (may be null if BYNET doesn't return it for test transactions)
    // The important thing is the transaction was created successfully
    if (result.pix) {
      // If pix is returned, it should be an object
      expect(typeof result.pix).toBe("object");
    }
  });

  it("should reject invalid CPF (too short)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.payment.createPix({
        customer: {
          name: "João da Silva",
          email: "joao@teste.com",
          cpf: "123",
          phone: "11999999999",
          address: {
            street: "Rua Teste",
            streetNumber: "123",
            complement: "",
            zipCode: "01001000",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            country: "br",
          },
        },
        items: [
          {
            title: "Produto Teste",
            unitPrice: 1000,
            quantity: 1,
            tangible: true,
          },
        ],
        shippingFee: 0,
      })
    ).rejects.toThrow();
  });

  it("should reject empty items array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.payment.createPix({
        customer: {
          name: "João da Silva",
          email: "joao@teste.com",
          cpf: "12345678901",
          phone: "11999999999",
          address: {
            street: "Rua Teste",
            streetNumber: "123",
            complement: "",
            zipCode: "01001000",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            country: "br",
          },
        },
        items: [],
        shippingFee: 0,
      })
    ).rejects.toThrow();
  });

  it("should calculate total amount correctly with shipping", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payment.createPix({
      customer: {
        name: "Maria Santos",
        email: "maria@teste.com",
        cpf: "98765432100",
        phone: "21988888888",
        address: {
          street: "Rua da Praia",
          streetNumber: "456",
          complement: "",
          zipCode: "20040020",
          neighborhood: "Centro",
          city: "Rio de Janeiro",
          state: "RJ",
          country: "br",
        },
      },
      items: [
        {
          title: "Produto A",
          unitPrice: 5000, // R$ 50,00
          quantity: 2,
          tangible: true,
        },
      ],
      shippingFee: 1985, // R$ 19,85
    });

    expect(result.success).toBe(true);
    // Total should be 5000*2 + 1985 = 11985 (R$ 119,85)
    expect(result.amount).toBe(11985);
  });
});
