import { ENV } from "./_core/env";

const SIGILO_PAY_BASE_URL = "https://app.sigilopay.com.br/api/v1";

export interface SigiloPayClient {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF com ou sem pontuação
}

export interface SigiloPayProduct {
  id: string;
  name: string;
  quantity: number;
  price: number; // em reais
}

export interface CreatePixInput {
  identifier: string;
  amount: number; // em reais
  shippingFee?: number; // em reais
  discount?: number; // em reais
  client: SigiloPayClient;
  products?: SigiloPayProduct[];
  dueDate?: string; // YYYY-MM-DD
  metadata?: Record<string, string>;
  callbackUrl?: string;
}

export interface SigiloPayPixResponse {
  transactionId: string;
  status: string; // OK, FAILED, PENDING, REJECTED, CANCELED
  fee?: number;
  order?: {
    id: string;
    url: string;
    receiptUrl: string;
  };
  pix?: {
    code: string; // PIX copia e cola
    base64: string; // QR code em base64
    image: string; // URL da imagem do QR code
  };
  details?: string;
  errorDescription?: string;
}

export interface SigiloPayTransactionResponse {
  id: string;
  clientIdentifier: string;
  currency: string;
  amount: number;
  chargeAmount: number;
  status: string; // PENDING, COMPLETED, FAILED, REFUNDED, CHARGED_BACK
  statusDescription?: string;
  paymentMethod: string;
  details?: string;
  errorDescription?: string;
  createdAt: string;
  payedAt?: string;
  refundedAt?: string;
  pixInformation?: {
    base64: string | null;
    qrCode: string | null;
    image: string | null;
  };
}

function getHeaders() {
  return {
    "x-public-key": ENV.sigiloPayPublicKey,
    "x-secret-key": ENV.sigiloPaySecretKey,
    "Content-Type": "application/json",
  };
}

export async function createPixTransaction(
  input: CreatePixInput
): Promise<SigiloPayPixResponse> {
  const body: Record<string, unknown> = {
    identifier: input.identifier,
    amount: input.amount,
    client: input.client,
  };

  if (input.shippingFee !== undefined) body.shippingFee = input.shippingFee;
  if (input.discount !== undefined) body.discount = input.discount;
  if (input.products) body.products = input.products;
  if (input.dueDate) body.dueDate = input.dueDate;
  if (input.metadata) body.metadata = input.metadata;
  if (input.callbackUrl) body.callbackUrl = input.callbackUrl;

  console.log("[SigiloPay] Creating PIX transaction:", JSON.stringify(body));

  const response = await fetch(`${SIGILO_PAY_BASE_URL}/gateway/pix/receive`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[SigiloPay] Error creating transaction:", JSON.stringify(data));
    throw new Error(
      data?.message || `Erro ao criar transação Sigilo Pay: ${response.status}`
    );
  }

  console.log("[SigiloPay] Transaction created:", JSON.stringify(data));
  return data as SigiloPayPixResponse;
}

export async function getTransactionStatus(
  transactionId: string
): Promise<SigiloPayTransactionResponse> {
  const response = await fetch(
    `${SIGILO_PAY_BASE_URL}/gateway/transactions?id=${encodeURIComponent(transactionId)}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("[SigiloPay] Error fetching transaction:", JSON.stringify(data));
    throw new Error(
      data?.message || `Erro ao consultar transação: ${response.status}`
    );
  }

  return data as SigiloPayTransactionResponse;
}

export async function testCredentials(): Promise<boolean> {
  try {
    const response = await fetch(
      `${SIGILO_PAY_BASE_URL}/gateway/credentials/test`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
