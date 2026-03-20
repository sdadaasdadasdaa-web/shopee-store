import { describe, expect, it } from "vitest";
import axios from "axios";

const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";
const UTMIFY_API_TOKEN = process.env.UTMIFY_API_TOKEN ?? "";

describe("UTMify API credentials", () => {
  it("should have UTMIFY_API_TOKEN configured", () => {
    expect(UTMIFY_API_TOKEN).toBeTruthy();
    expect(UTMIFY_API_TOKEN.length).toBeGreaterThan(10);
  });

  it("should accept the API token (test order)", async () => {
    // Send a test order to validate the token is accepted
    const testPayload = {
      orderId: `TEST-${Date.now()}`,
      platform: "AchaShop",
      paymentMethod: "pix",
      status: "waiting_payment",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      approvedDate: null,
      refundedAt: null,
      customer: {
        name: "Teste UTMify",
        email: "teste@achashop.com",
        phone: "11999999999",
        document: "12345678901",
        country: "BR",
      },
      products: [
        {
          id: "PROD-TEST",
          name: "Produto Teste",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: 8990,
        },
      ],
      trackingParameters: {
        src: null,
        sck: null,
        utm_source: null,
        utm_campaign: null,
        utm_medium: null,
        utm_content: null,
        utm_term: null,
      },
      commission: {
        totalPriceInCents: 8990,
        gatewayFeeInCents: 0,
        userCommissionInCents: 8990,
        currency: "BRL",
      },
      isTest: true,
    };

    const response = await axios.post(UTMIFY_API_URL, testPayload, {
      headers: {
        "x-api-token": UTMIFY_API_TOKEN,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });

    // A valid token should return 200 or 201 (not 401/403)
    expect(response.status).toBeLessThan(400);
  }, 15000);
});
