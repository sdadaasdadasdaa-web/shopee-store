/*
 * UTMify Tracker — Dispara eventos do pixel UTMify em cada mudança de rota (SPA)
 * Eventos: PageView (todas as páginas), InitiateCheckout (checkout), Purchase (pagamento confirmado)
 */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    pixelId?: string;
    utmify?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

/**
 * Dispara um evento para o pixel UTMify.
 * O pixel da UTMify injeta a função global `utmify` quando carrega.
 * Caso não exista, tentamos usar o padrão de dataLayer ou simplesmente
 * disparar um CustomEvent que o pixel pode capturar.
 */
function trackUtmifyEvent(eventName: string, data?: Record<string, unknown>) {
  try {
    // Método 1: Função global utmify (se o pixel expõe)
    if (typeof window.utmify === "function") {
      window.utmify("track", eventName, data);
      return;
    }

    // Método 2: Disparar CustomEvent para que o pixel capture
    const event = new CustomEvent("utmify:track", {
      detail: { event: eventName, data },
    });
    document.dispatchEvent(event);

    // Método 3: Forçar re-execução do pixel via mudança de URL
    // O pixel UTMify monitora mudanças de URL para SPAs
    // Disparamos um popstate para simular navegação
    window.dispatchEvent(new PopStateEvent("popstate"));
  } catch (e) {
    console.warn("[UTMify Tracker] Erro ao disparar evento:", eventName, e);
  }
}

export function useUtmifyPageView() {
  const [location] = useLocation();
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Evitar duplicatas na mesma rota
    if (location === lastTrackedPath.current) return;
    lastTrackedPath.current = location;

    // Pequeno delay para garantir que o pixel já carregou
    const timer = setTimeout(() => {
      trackUtmifyEvent("PageView");

      // Se estamos no checkout, disparar InitiateCheckout
      if (location === "/checkout") {
        trackUtmifyEvent("InitiateCheckout", {
          currency: "BRL",
        });
      }

      // Se estamos na página de pagamento, verificar se é confirmação
      if (location.startsWith("/pagamento/")) {
        trackUtmifyEvent("AddPaymentInfo", {
          currency: "BRL",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);
}

/**
 * Hook para disparar evento de Purchase (compra confirmada)
 */
export function trackUtmifyPurchase(value: number, transactionId: string) {
  trackUtmifyEvent("Purchase", {
    value,
    currency: "BRL",
    transaction_id: transactionId,
  });
}

/**
 * Componente wrapper que ativa o tracking em todas as páginas
 */
export default function UtmifyTracker() {
  useUtmifyPageView();
  return null;
}
