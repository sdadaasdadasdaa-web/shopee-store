import { useScarcity } from "@/hooks/useScarcity";
import { Flame, AlertTriangle } from "lucide-react";

interface ScarcityBadgeProps {
  variant?: "product" | "checkout";
}

export default function ScarcityBadge({ variant = "product" }: ScarcityBadgeProps) {
  const stock = useScarcity();

  const isLow = stock <= 15;
  const isCritical = stock <= 8;

  if (variant === "checkout") {
    return (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold animate-pulse ${
          isCritical
            ? "bg-red-50 border-red-300 text-red-700"
            : isLow
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-yellow-50 border-yellow-300 text-yellow-700"
        }`}
      >
        <AlertTriangle className={`w-5 h-5 shrink-0 ${isCritical ? "text-red-500" : isLow ? "text-orange-500" : "text-yellow-500"}`} />
        <div>
          <span className="font-bold">
            {isCritical ? "Quase esgotando!" : isLow ? "Estoque baixo!" : "Alta demanda!"}
          </span>
          {" "}Restam apenas{" "}
          <span className={`font-extrabold text-base ${isCritical ? "text-red-600" : isLow ? "text-orange-600" : "text-yellow-600"}`}>
            {stock} unidades
          </span>
          {" "}— finalize sua compra agora!
        </div>
      </div>
    );
  }

  // Variant: product page
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
        isCritical
          ? "bg-red-50 border border-red-200 text-red-700"
          : isLow
            ? "bg-orange-50 border border-orange-200 text-orange-700"
            : "bg-amber-50 border border-amber-200 text-amber-700"
      }`}
    >
      <Flame
        className={`w-5 h-5 shrink-0 ${
          isCritical ? "text-red-500 animate-bounce" : isLow ? "text-orange-500" : "text-amber-500"
        }`}
      />
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs uppercase tracking-wide opacity-80">
          {isCritical ? "Quase esgotando!" : isLow ? "Estoque baixo!" : "Alta demanda!"}
        </span>
        <span className="mx-1 opacity-40">|</span>
        <span>
          Restam{" "}
          <span
            className={`font-extrabold text-base ${
              isCritical ? "text-red-600" : isLow ? "text-orange-600" : "text-amber-600"
            }`}
          >
            {stock}
          </span>
          {" "}unidades
        </span>
      </div>
    </div>
  );
}
