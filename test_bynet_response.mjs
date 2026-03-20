import 'dotenv/config';

const BYNET_BASE_URL = "https://api-gateway.techbynet.com";
const API_KEY = process.env.BYNET_API_KEY;

async function testCreateTransaction() {
  const payload = {
    amount: 8990,
    paymentMethod: "PIX",
    customer: {
      name: "Teste AchaShop",
      email: "teste@achashop.com",
      document: {
        number: "12345678901",
        type: "CPF",
      },
      phone: "11999999999",
      externalRef: "TEST-001",
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
    shipping: {
      fee: 0,
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
        title: "Roçadeira Nakasaki 75cc",
        unitPrice: 8990,
        quantity: 1,
        tangible: true,
        externalRef: "product-21",
      },
    ],
    pix: {
      expiresInDays: 1,
    },
  };

  console.log("Enviando request para BYNET...\n");

  const response = await fetch(`${BYNET_BASE_URL}/api/user/transactions`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "User-Agent": "AtivoB2B/1.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log("Status HTTP:", response.status);
  console.log("\n=== RESPOSTA COMPLETA (JSON) ===\n");
  console.log(JSON.stringify(data, null, 2));

  if (data.data) {
    console.log("\n=== CAMPOS PIX ===");
    console.log("data.data.pix:", JSON.stringify(data.data.pix, null, 2));
    
    // Check all keys in data.data
    console.log("\n=== TODAS AS CHAVES em data.data ===");
    console.log(Object.keys(data.data));
    
    // Check if there's any qr-related field anywhere
    const jsonStr = JSON.stringify(data);
    if (jsonStr.includes("qr")) {
      console.log("\n=== Encontrou 'qr' na resposta ===");
    }
    if (jsonStr.includes("pix_code") || jsonStr.includes("pixCode") || jsonStr.includes("copy_paste") || jsonStr.includes("copyPaste")) {
      console.log("\n=== Encontrou campo alternativo de código PIX ===");
    }
    if (jsonStr.includes("brcode") || jsonStr.includes("emv")) {
      console.log("\n=== Encontrou 'brcode' ou 'emv' na resposta ===");
    }
  }
}

testCreateTransaction().catch(console.error);
