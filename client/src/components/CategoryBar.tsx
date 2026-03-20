/*
 * Design: Bazaar Digital — Barra de categorias horizontal scrollável
 * Ícones circulares com nome, estilo Shopee
 */
import { categories } from "@/lib/data";
import {
  Smartphone, Shirt, Home, Sparkles, Dumbbell,
  Gamepad2, BookOpen, Dog, Car, Heart,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Smartphone, Shirt, Home, Sparkles, Dumbbell,
  Gamepad2, BookOpen, Dog, Car, Heart,
};

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container py-3 md:py-4">
        <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-1">
          {/* All */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex flex-col items-center gap-1.5 shrink-0 px-2 md:px-3 group transition-all ${
              selectedCategory === null ? "opacity-100" : "opacity-60 hover:opacity-100"
            }`}
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                selectedCategory === null
                  ? "text-white shadow-md"
                  : "bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-[#EE4D2D]"
              }`}
              style={selectedCategory === null ? { background: "#EE4D2D" } : {}}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className={`text-[10px] md:text-xs font-medium whitespace-nowrap ${
              selectedCategory === null ? "font-bold" : "text-gray-600"
            }`}
              style={selectedCategory === null ? { color: "#EE4D2D" } : {}}>
              Todos
            </span>
          </button>

          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col items-center gap-1.5 shrink-0 px-2 md:px-3 group transition-all ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-[#EE4D2D]"
                  }`}
                  style={isActive ? { background: "#EE4D2D" } : {}}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`text-[10px] md:text-xs font-medium whitespace-nowrap ${
                  isActive ? "font-bold" : "text-gray-600"
                }`}
                  style={isActive ? { color: "#EE4D2D" } : {}}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
