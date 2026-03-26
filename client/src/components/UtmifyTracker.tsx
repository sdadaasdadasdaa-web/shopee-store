/*
 * UTMify Tracker — Integração para SPA (React + wouter)
 * * Estratégia de tracking em 2 camadas:
 * * 1. PIXEL CLIENT-SIDE (pixel.js):
 * - Carregado via <script> no index.html
 * - Dispara PageView na primeira carga, ViewContent, e detecta IC automaticamente
 * * 2. PROXY SERVER-SIDE (este módulo):
 * - Envia eventos via tRPC → backend → tracking.utmify.com.br
 * - Garante que PageView e IC são sempre registrados
 * - Salva o lead no localStorage para uso posterior
 */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const PIXEL_ID = "69251f2e83c0b0e4729553f9";

/**
 * Lê o lead salvo pelo pixel UTMify ou pelo nosso proxy no localStorage
 */
function getUtmifyLead(): any {
  try {
    const raw = localStorage.getItem("lead");
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Salva o sck no localStorage (utms/latest.js não salva sck)
 * Chamado na primeira carga da página quando sck está na URL
 */
function persistSckFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sck = urlParams.get("sck");
    if (sck) {
      localStorage.setItem("sck", sck);
      // Setar expiração de 7 dias
      const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem("sck_exp", exp.toISOString());
    }
  } catch {
    // ignore
  }
}

/**
 * Hook que dispara PageView via proxy server-side em cada navegação SPA.
 */
export function useUtmifyPageView() {
  const [location] = useLocation();
  const lastTrackedPath = useRef("");
  const isFirstLoad = useRef(true);

  const sendEventMutation = trpc.tracking.sendEvent.useMutation();

  useEffect(() => {
    // Na primeira carga, persistir sck da URL
    if (isFirstLoad.current) {
      persistSckFromUrl();
    }

    // Evitar duplicatas na mesma rota
    if (location === lastTrackedPath.current && !isFirstLoad.current) return;
    lastTrackedPath.current = location;

    const isFirst = isFirstLoad.current;
    isFirstLoad.current = false;

    const timer = setTimeout(() => {
      const lead = getUtmifyLead();

      sendEventMutation.mutate(
        {
          type: "PageView",
          lead: {
            _id: lead?._id || undefined,
            userAgent: navigator.userAgent,
            locale: navigator.language,
            parameters: lead?.parameters || undefined,
          },
          event: {
            pageTitle: document.title,
            sourceUrl: window.location.href,
          },
        },
        {
          onSuccess: (data) => {
            if (data.success && data.lead?._id) {
              localStorage.setItem("lead", JSON.stringify(data.lead));
            }
          },
        }
      );
    }, isFirst ? 1500 : 500);

    return () => clearTimeout(timer);
  }, [location]);
}

/**
 * Envia um evento de InitiateCheckout via proxy server-side.
 */
export function useSendInitiateCheckout() {
  const sendEventMutation = trpc.tracking.sendEvent.useMutation();

  return () => {
    const lead = getUtmifyLead();

    sendEventMutation.mutate(
      {
        type: "InitiateCheckout",
        lead: {
          _id: lead?._id || undefined,
          userAgent: navigator.userAgent,
          locale: navigator.language,
          parameters: lead?.parameters || undefined,
        },
        event: {
          pageTitle: document.title,
          sourceUrl: window.location.href,
        },
      }
    );
  };
}

/**
 * Utilitário para ler os parâmetros UTM incluindo XCOD e UTM_ID
 */
export function getUtmifyTrackingParams(): {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
  utm_id: string | null;
  xcod: string | null;
} {
  const urlParams = new URLSearchParams(window.location.search);
  
  const lsGet = (key: string): string | null => {
    try {
      const val = localStorage.getItem(key);
      const expKey = `${key}_exp`;
      const exp = localStorage.getItem(expKey);
      if (exp && new Date(exp) < new Date()) return null;
      return val || null;
    } catch {
      return null;
    }
  };

  const lead = getUtmifyLead();
  const leadParams = lead?.parameters || {};
  const utmParams = (window as any).utmParams;

  const wpGet = (key: string): string | null => {
    if (!utmParams) return null;
    if (typeof utmParams.get === "function") return utmParams.get(key) || null;
    return utmParams[key] || null;
  };

  return {
    src: urlParams.get("src") || lsGet("src") || wpGet("src") || leadParams.src || null,
    sck: urlParams.get("sck") || lsGet("sck") || wpGet("sck") || leadParams.sck || null,
    utm_source: urlParams.get("utm_source") || lsGet("utm_source") || wpGet("utm_source") || leadParams.utm_source || null,
    utm_campaign: urlParams.get("utm_campaign") || lsGet("utm_campaign") || wpGet("utm_campaign") || leadParams.utm_campaign || null,
    utm_medium: urlParams.get("utm_medium") || lsGet("utm_medium") || wpGet("utm_medium") || leadParams.utm_medium || null,
    utm_content: urlParams.get("utm_content") || lsGet("utm_content") || wpGet("utm_content") || leadParams.utm_content || null,
    utm_term: urlParams.get("utm_term") || lsGet("utm_term") || wpGet("utm_term") || leadParams.utm_term || null,
    utm_id: urlParams.get("utm_id") || lsGet("utm_id") || wpGet("utm_id") || leadParams.utm_id || null,
    xcod: urlParams.get("xcod") || lsGet("xcod") || wpGet("xcod") || leadParams.xcod || null,
  };
}

export default function UtmifyTracker() {
  useUtmifyPageView();
  return null;
}