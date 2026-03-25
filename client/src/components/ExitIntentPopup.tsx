/**
 * ExitIntentPopup — aparece quando o mouse sai pela parte superior da janela
 * Oferece cupom VOLTA5 com 5% de desconto para recuperar o visitante
 */
import { useEffect, useState, useCallback } from "react";
import { X, Tag, Copy, Check } from "lucide-react";

const COUPON_CODE = "VOLTA5";
const COUPON_DISCOUNT_PCT = 5;
const STORAGE_KEY_SHOWN = "exit_intent_shown";
const STORAGE_KEY_COUPON = "applied_coupon";

export interface AppliedCoupon {
  code: string;
  discountPct: number;
}

export function getAppliedCoupon(): AppliedCoupon | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPON);
    if (!raw) return null;
    return JSON.parse(raw) as AppliedCoupon;
  } catch {
    return null;
  }
}

export function clearAppliedCoupon() {
  localStorage.removeItem(STORAGE_KEY_COUPON);
}

interface ExitIntentPopupProps {
  /** Só exibe o popup se estiver em uma página de produto */
  enabled?: boolean;
}

export default function ExitIntentPopup({ enabled = true }: ExitIntentPopupProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Só dispara quando o mouse sai pela parte superior (exit-intent real)
    if (e.clientY <= 5) {
      const alreadyShown = sessionStorage.getItem(STORAGE_KEY_SHOWN);
      if (!alreadyShown) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY_SHOWN, "1");
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Aguarda 3 segundos antes de ativar o listener para evitar disparos acidentais
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, handleMouseLeave]);

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    const coupon: AppliedCoupon = { code: COUPON_CODE, discountPct: COUPON_DISCOUNT_PCT };
    localStorage.setItem(STORAGE_KEY_COUPON, JSON.stringify(coupon));
    setApplied(true);
    setTimeout(() => setVisible(false), 1200);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff" }}
      >
        {/* Header laranja */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #FF7337 100%)" }}
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Tag className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-white text-xl font-extrabold leading-tight">
            Espera! Não vá embora ainda
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Temos um presente especial para você
          </p>
        </div>

        {/* Corpo */}
        <div className="px-6 py-5 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Use o cupom abaixo e ganhe{" "}
            <span className="font-bold text-[#EE4D2D]">{COUPON_DISCOUNT_PCT}% de desconto</span>{" "}
            na sua compra agora mesmo:
          </p>

          {/* Cupom */}
          <div
            className="flex items-center justify-between gap-2 rounded-xl border-2 border-dashed px-4 py-3 mb-4"
            style={{ borderColor: "#EE4D2D", background: "#FFF5F3" }}
          >
            <span
              className="text-2xl font-extrabold tracking-widest"
              style={{ color: "#EE4D2D" }}
            >
              {COUPON_CODE}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: copied ? "#00BFA5" : "#EE4D2D",
                color: "#fff",
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          {/* Botão aplicar */}
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl font-extrabold text-white text-base transition-all active:scale-95"
            style={{
              background: applied
                ? "#00BFA5"
                : "linear-gradient(135deg, #EE4D2D 0%, #FF7337 100%)",
            }}
          >
            {applied ? "✓ Cupom aplicado!" : `Aplicar ${COUPON_DISCOUNT_PCT}% de desconto`}
          </button>

          <button
            onClick={() => setVisible(false)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            Não, obrigado. Prefiro pagar o valor cheio.
          </button>
        </div>
      </div>
    </div>
  );
}
