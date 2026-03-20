import { describe, expect, it } from "vitest";

describe("BYNET API Key", () => {
  it("should have BYNET_API_KEY environment variable set", () => {
    const apiKey = process.env.BYNET_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
    expect(apiKey).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("should be able to reach BYNET API gateway", async () => {
    const apiKey = process.env.BYNET_API_KEY!;
    const response = await fetch("https://api-gateway.techbynet.com/api/user/transactions", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "User-Agent": "AtivoB2B/1.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100,
        paymentMethod: "PIX",
      }),
    });
    // We expect 400 (bad request due to missing fields) or 401/403 if key is invalid
    // If we get 400, it means the key was accepted but the body is incomplete - that's good!
    // If we get 401 or 403, the key is invalid
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
