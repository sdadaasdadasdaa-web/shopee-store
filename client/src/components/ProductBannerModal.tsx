/**
 * ProductBannerModal — exibe um banner infográfico em modal/lightbox
 * Permite visualizar o banner em tela cheia com botão de fechar
 */
import { X, Maximize2 } from "lucide-react";
import { useState } from "react";

interface ProductBannerModalProps {
  bannerUrl: string;
  bannerAlt: string;
  showButton?: boolean; // Mostra botão "Ver banner completo"
}

export default function ProductBannerModal({ bannerUrl, bannerAlt, showButton = true }: ProductBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Banner em miniatura com botão */}
      <div className="bg-white rounded-sm p-4 md:p-6 relative group">
        <img
          src={bannerUrl}
          alt={bannerAlt}
          className="w-full h-auto rounded-lg object-cover"
        />

        {/* Botão "Ver banner completo" sobreposto */}
        {showButton && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-white transition-all active:scale-95 shadow-lg hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%)" }}
          >
            <Maximize2 className="w-4 h-4" />
            Ver banner completo
          </button>
        )}
      </div>

      {/* Modal/Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors z-10 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem em tela cheia */}
            <img
              src={bannerUrl}
              alt={bannerAlt}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
