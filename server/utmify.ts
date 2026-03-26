import axios from "axios";
import { ENV } from "./_core/env";

const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";
const UTMIFY_TRACKING_URL = "https://tracking.utmify.com.br/tracking/v1";
const PIXEL_ID = "69251f2e83c0b0e4729553f9";

interface UtmifyCustomer {
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  country?: string;
  ip?: string;
}

interface UtmifyProduct {
  id: string;
  name: string;
  planId: string | null;
  planName: string | null;
  quantity: number;
  priceInCents: number;
}

// ADICIONADO: xcod e utm_id para rastreio de campanhas
interface UtmifyTrackingParameters {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
  utm_id: string | null;
  xcod: string | null;
}

interface UtmifyCommission {
  totalPriceInCents: number;
  gatewayFeeInCents: number;
  userCommissionInCents: number;
  currency?: "BRL" | "USD" | "EUR" | "GBP" | "ARS" | "CAD";
}

interface UtmifyOrderPayload {
  orderId: string;
  platform: string;
  paymentMethod: "credit_card" | "boleto" | "pix" | "paypal" | "free_price";
  status: "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";
  createdAt: string;
  approvedDate: string | null;
  refundedAt: string | null;
  customer: UtmifyCustomer;
  products: UtmifyProduct[];
  trackingParameters: UtmifyTrackingParameters;
  commission: UtmifyCommission;
  isTest?: boolean;
}

function formatDateUTC(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19);
}

/**
 * Envia um evento de pedido para a UTMify
 */
export async function sendUtmifyOrder(payload: UtmifyOrderPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await axios.post(UTMIFY_API_URL, payload, {
      headers: {
        "x-api-token": ENV.utmifyApiToken,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log(`[UTMify] Order ${payload.orderId} sent with status ${payload.status} — API response: ${response.status}`);
    return { success: true };
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
    console.error(`[UTMify] Failed to send order ${payload.orderId}: msg=${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Envia evento de "Pedido Pendente" (PIX gerado)
 */
export async function sendUtmifyPendingOrder(params: {
  orderId: string;
  customer: { name: string; email: string; phone: string; cpf: string };
  products: { id: string; name: string; quantity: number; priceInCents: number }[];
  totalInCents: number;
  trackingParams?: {
    src?: string | null;
    sck?: string | null;
    utm_source?: string | null;
    utm_campaign?: string | null;
    utm_medium?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    utm_id?: string | null;
    xcod?: string | null;
  };
}): Promise<{ success: boolean; error?: string }> {
  const now = new Date();

  const payload: UtmifyOrderPayload = {
    orderId: params.orderId,
    platform: "AchaShop",
    paymentMethod: "pix",
    status: "waiting_payment", // Isso marca como Pendente no Dashboard
    createdAt: formatDateUTC(now),
    approvedDate: null,
    refundedAt: null,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone,
      document: params.customer.cpf,
      country: "BR",
    },
    products: params.products.map((p) => ({
      id: p.id,
      name: p.name,
      planId: null,
      planName: null,
      quantity: p.quantity,
      priceInCents: p.priceInCents,
    })),
    trackingParameters: {
      src: params.trackingParams?.src ?? null,
      sck: params.trackingParams?.sck ?? null,
      utm_source: params.trackingParams?.utm_source ?? null,
      utm_campaign: params.trackingParams?.utm_campaign ?? null,
      utm_medium: params.trackingParams?.utm_medium ?? null,
      utm_content: params.trackingParams?.utm_content ?? null,
      utm_term: params.trackingParams?.utm_term ?? null,
      utm_id: params.trackingParams?.utm_id ?? null,
      xcod: params.trackingParams?.xcod ?? null, // CRÍTICO PARA CAMPANHAS
    },
    commission: {
      totalPriceInCents: params.totalInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: params.totalInCents,
      currency: "BRL",
    },
  };

  return sendUtmifyOrder(payload);
}

/**
 * Envia evento de "Pedido Pago"
 */
export async function sendUtmifyPaidOrder(params: {
  orderId: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string; cpf: string };
  products: { id: string; name: string; quantity: number; priceInCents: number }[];
  totalInCents: number;
  trackingParams?: {
    src?: string | null;
    sck?: string | null;
    utm_source?: string | null;
    utm_campaign?: string | null;
    utm_medium?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    utm_id?: string | null;
    xcod?: string | null;
  };
}): Promise<{ success: boolean; error?: string }> {
  const now = new Date();

  const payload: UtmifyOrderPayload = {
    orderId: params.orderId,
    platform: "AchaShop",
    paymentMethod: "pix",
    status: "paid",
    createdAt: params.createdAt,
    approvedDate: formatDateUTC(now),
    refundedAt: null,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone,
      document: params.customer.cpf,
      country: "BR",
    },
    products: params.products.map((p) => ({
      id: p.id,
      name: p.name,
      planId: null,
      planName: null,
      quantity: p.quantity,
      priceInCents: p.priceInCents,
    })),
    trackingParameters: {
      src: params.trackingParams?.src ?? null,
      sck: params.trackingParams?.sck ?? null,
      utm_source: params.trackingParams?.utm_source ?? null,
      utm_campaign: params.trackingParams?.utm_campaign ?? null,
      utm_medium: params.trackingParams?.utm_medium ?? null,
      utm_content: params.trackingParams?.utm_content ?? null,
      utm_term: params.trackingParams?.utm_term ?? null,
      utm_id: params.trackingParams?.utm_id ?? null,
      xcod: params.trackingParams?.xcod ?? null, // CRÍTICO PARA CAMPANHAS
    },
    commission: {
      totalPriceInCents: params.totalInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: params.totalInCents,
      currency: "BRL",
    },
  };

  return sendUtmifyOrder(payload);
}

// ... Restante do código de tracking (PageView, etc.) permanece igual