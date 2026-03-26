/**
 * ProductBannerModal — exibe um banner infográfico cortado com botão expandir
 * - Modo colapsado: mostra ~40% do banner com gradiente fade na borda inferior
 * - Botão "Ver banner completo" expande para mostrar tudo
 * - Botão "Fechar" recolhe de volta
 * - Clique na imagem expandida abre modal/lightbox em tela cheia
 */
import { X, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { useState } from "react";

interface ProductBannerModalProps {
  bannerUrl: string;
  bannerAlt: string;
}

export default function ProductBannerModal({ bannerUrl, bannerAlt }: ProductBannerModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      {/* Container do banner */}
      <div className="bg-white rounded-sm mt-3 overflow-hidden">
        {/* Cabeçalho da seção */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ background: "#EE4D2D" }} />
            Detalhes do Produto
          </h2>
        </div>

        {/* Wrapper com corte */}
        <div className="relative px-4 md:px-6">
          <div
            className="relative overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isExpanded ? "9999px" : "420px" }}
          >
            {/* Imagem do banner — clicável para lightbox quando expandido */}
            <img
              src={bannerUrl}
              alt={bannerAlt}
              className={`w-full h-auto block ${isExpanded ? "cursor-zoom-in" : ""}`}
              onClick={() => isExpanded && setIsLightboxOpen(true)}
            />

            {/* Gradiente fade — só visível quando colapsado */}
            {!isExpanded && (
              <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, white 100%)",
                }}
              />
            )}
          </div>

          {/* Botão expandir/recolher */}
          <div className="flex justify-center py-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%)" }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Recolher banner
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver banner completo
                </>
              )}
            </button>

            {/* Botão lightbox — só aparece quando expandido */}
            {isExpanded && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm border-2 transition-all active:scale-95"
                style={{ borderColor: "#EE4D2D", color: "#EE4D2D" }}
              >
                <Maximize2 className="w-4 h-4" />
                Tela cheia
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal/Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 flex items-start justify-center p-4 z-50 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.90)" }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl my-4 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors z-10 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem completa */}
            <img
              src={bannerUrl}
              alt={bannerAlt}
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}
    </>
  );
}
