import { ENV } from "./_core/env";

const BYNET_BASE_URL = "https://api-gateway.techbynet.com";

export interface BynetCustomer {
  name: string;
  email: string;
  document: {
    number: string; // CPF sem pontuação
    type: "CPF" | "CNPJ";
  };
  phone: string;
  externalRef: string;
  address: {
    street: string;
    streetNumber: string;
    complement: string;
    zipCode: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface BynetItem {
  title: string;
  unitPrice: number; // em centavos
  quantity: number;
  tangible: boolean;
  externalRef: string;
}

export interface BynetShipping {
  fee: number; // em centavos
  address: {
    street: string;
    streetNumber: string;
    complement: string;
    zipCode: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface CreateTransactionInput {
  amount: number; // em centavos
  paymentMethod: "PIX" | "BOLETO" | "CREDIT_CARD";
  customer: BynetCustomer;
  shipping?: BynetShipping;
  items: BynetItem[];
  pix?: {
    expiresInDays: number;
  };
  postbackUrl?: string;
  metadata?: string;
}

export interface BynetTransactionResponse {
  status: number;
  message: string;
  data: {
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    pix: {
      qrCode: string;
      qrCodeUrl: string;
      expirationDate: string;
    } | null;
    boleto: {
      url: string;
      barcode: string;
      expirationDate: string;
    } | null;
    customer: Record<string, unknown>;
    items: Record<string, unknown>[];
    createdAt: string;
    [key: string]: unknown;
  };
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<BynetTransactionResponse> {
  const response = await fetch(`${BYNET_BASE_URL}/api/user/transactions`, {
    method: "POST",
    headers: {
      "x-api-key": ENV.bynetApiKey,
      "User-Agent": "AtivoB2B/1.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Erro ao criar transação: ${response.status}`
    );
  }

  return data as BynetTransactionResponse;
}

export async function getTransactionById(
  transactionId: string
): Promise<BynetTransactionResponse> {
  const response = await fetch(
    `${BYNET_BASE_URL}/api/user/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        "x-api-key": ENV.bynetApiKey,
        "User-Agent": "AtivoB2B/1.0",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Erro ao consultar transação: ${response.status}`
    );
  }

  return data as BynetTransactionResponse;
}
