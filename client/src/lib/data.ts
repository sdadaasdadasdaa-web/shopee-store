export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images: string[];
  rating: number;
  sold: number;
  freeShipping: boolean;
  category: string;
  description: string;
  specifications?: { label: string; value: string }[];
  variations: {
    label: string;
    options: string[];
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariations: Record<string, string>;
}

export interface OrderBumpItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  shortDescription: string;
}

export const categories = [
  { id: 0, name: "Todos", icon: "Sparkles" },
  { id: 1, name: "Kits de Ferramentas", icon: "Wrench" },
  { id: 2, name: "Parafusadeiras", icon: "Drill" },
  { id: 3, name: "Serras", icon: "CircleDot" },
  { id: 4, name: "Medição", icon: "Ruler" },
  { id: 5, name: "Alicates", icon: "Scissors" },
  { id: 6, name: "Chaves", icon: "Key" },
  { id: 7, name: "Elétricas", icon: "Zap" },
  { id: 8, name: "Acessórios", icon: "Package" },
  { id: 9, name: "Manuais", icon: "Hammer" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Kit Ferramentas 46 Peças Jogo Soquetes Chave Catraca Reversível com Maleta",
    price: 27.99,
    originalPrice: 99.90,
    discount: 72,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/1VDYVRIdYORv_aee9ca4d.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/1VDYVRIdYORv_aee9ca4d.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/QZa0YIgW7pr3_083fbf66.jpg",
    ],
    rating: 4.8,
    sold: 52341,
    freeShipping: true,
    category: "Kits de Ferramentas",
    description: "Kit completo de ferramentas com 46 peças essenciais para manutenção doméstica e profissional. Inclui chave catraca reversível de alta resistência, soquetes em diversas medidas (4mm a 14mm), extensões, adaptadores e bits variados. Maleta organizadora compacta e resistente que mantém todas as peças organizadas. Aço cromo-vanádio de alta durabilidade com acabamento cromado anticorrosivo. Ideal para mecânica automotiva, montagem de móveis, eletricidade e reparos gerais. Encaixe padrão 1/4\" compatível com a maioria das ferramentas do mercado.",
    specifications: [
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Quantidade de Peças", value: "46" },
      { label: "Encaixe", value: "1/4\"" },
      { label: "Acabamento", value: "Cromado anticorrosivo" },
      { label: "Peso", value: "1.2 kg" },
      { label: "Maleta", value: "Plástico reforçado" },
    ],
    variations: [
      { label: "Modelo", options: ["46 Peças", "40 Peças"] },
    ],
  },
  {
    id: 2,
    name: "Parafusadeira Furadeira Sem Fio 21V com 2 Baterias e Kit 48 Peças",
    price: 89.90,
    originalPrice: 249.90,
    discount: 64,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/eWWyuU3RKcla_36c4aa3f.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/eWWyuU3RKcla_36c4aa3f.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/IRLnpB8PTo63_42c85afe.jpg",
    ],
    rating: 4.7,
    sold: 38456,
    freeShipping: true,
    category: "Parafusadeiras",
    description: "Parafusadeira e furadeira sem fio profissional com motor de 21V de alta potência. Acompanha 2 baterias de lítio recarregáveis para trabalho contínuo sem interrupção. Kit completo com 48 peças incluindo bits Phillips, fenda, Torx, soquetes e brocas para madeira, metal e concreto. LED integrado para iluminação em locais escuros. Mandril de 10mm com aperto rápido. 25+1 níveis de torque ajustável. Carregamento via USB bivolt. Maleta organizadora inclusa.",
    specifications: [
      { label: "Voltagem", value: "21V" },
      { label: "Baterias", value: "2x Lítio recarregável" },
      { label: "Mandril", value: "10mm aperto rápido" },
      { label: "Torque", value: "25+1 níveis" },
      { label: "Kit", value: "48 peças" },
      { label: "Carregamento", value: "USB Bivolt" },
    ],
    variations: [
      { label: "Voltagem", options: ["21V", "25V"] },
      { label: "Baterias", options: ["1 Bateria", "2 Baterias"] },
    ],
  },
  {
    id: 3,
    name: "Kit Ferramentas 93 Peças Jogo Soquete com Parafusadeira Furadeira e Maleta",
    price: 69.88,
    originalPrice: 199.90,
    discount: 65,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/IRLnpB8PTo63_42c85afe.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/IRLnpB8PTo63_42c85afe.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/eWWyuU3RKcla_36c4aa3f.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/1VDYVRIdYORv_aee9ca4d.jpg",
    ],
    rating: 4.6,
    sold: 28934,
    freeShipping: true,
    category: "Kits de Ferramentas",
    description: "Kit completo de ferramentas profissional com 93 peças incluindo parafusadeira/furadeira sem fio bivolt. Jogo de soquetes com chave catraca, bits variados (Phillips, fenda, Torx, Allen), brocas para madeira, metal e concreto, extensões e adaptadores. Parafusadeira com 25+1 níveis de torque, LED integrado e bateria recarregável. Maleta resistente com compartimentos organizados. Ideal para manutenção doméstica, montagem de móveis e pequenos reparos.",
    specifications: [
      { label: "Quantidade de Peças", value: "93" },
      { label: "Parafusadeira", value: "Sem fio, bivolt" },
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Maleta", value: "Plástico reforçado" },
      { label: "Peso Total", value: "3.5 kg" },
    ],
    variations: [
      { label: "Modelo", options: ["93 Peças", "94 Peças"] },
    ],
  },
  {
    id: 4,
    name: "Serra Circular Elétrica 185mm 1100W Profissional com Guia Laser",
    price: 149.90,
    originalPrice: 349.90,
    discount: 57,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/zUNp43k6FdMO_1800d46a.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/zUNp43k6FdMO_1800d46a.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/7DflIrhkB8TS_5d4cc7f3.jpg",
    ],
    rating: 4.5,
    sold: 12876,
    freeShipping: true,
    category: "Serras",
    description: "Serra circular elétrica profissional com motor potente de 1100W e disco de 185mm. Guia laser integrado para cortes precisos e retos. Profundidade de corte ajustável até 65mm a 90° e 45mm a 45°. Base em alumínio fundido para maior estabilidade. Empunhadura emborrachada ergonômica com gatilho de segurança duplo. Saída para coletor de pó. Acompanha disco de corte para madeira com 24 dentes e chave para troca de disco.",
    specifications: [
      { label: "Potência", value: "1100W" },
      { label: "Disco", value: "185mm" },
      { label: "Profundidade de Corte", value: "65mm (90°) / 45mm (45°)" },
      { label: "Rotação", value: "5000 RPM" },
      { label: "Voltagem", value: "220V" },
      { label: "Peso", value: "3.8 kg" },
    ],
    variations: [
      { label: "Voltagem", options: ["110V", "220V"] },
    ],
  },
  {
    id: 5,
    name: "Trena Laser Digital Medidor de Distância 40m Alta Precisão",
    price: 59.90,
    originalPrice: 149.90,
    discount: 60,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/NBXgbCYdwqWI_52b33b42.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/NBXgbCYdwqWI_52b33b42.jpg",
    ],
    rating: 4.7,
    sold: 18543,
    freeShipping: true,
    category: "Medição",
    description: "Trena laser digital profissional com alcance de até 40 metros e precisão de ±2mm. Display LCD retroiluminado de fácil leitura. Funções de medição de distância, área, volume e medição contínua. Referência de medição frontal e traseira. Memória para até 20 medições. Corpo compacto e resistente com proteção emborrachada contra impactos. Alimentação por 2 pilhas AAA (inclusas). Ideal para construção civil, arquitetura, decoração e reformas.",
    specifications: [
      { label: "Alcance", value: "0.05m - 40m" },
      { label: "Precisão", value: "±2mm" },
      { label: "Display", value: "LCD retroiluminado" },
      { label: "Funções", value: "Distância, Área, Volume" },
      { label: "Memória", value: "20 medições" },
      { label: "Alimentação", value: "2x AAA" },
    ],
    variations: [
      { label: "Alcance", options: ["40m", "60m", "100m"] },
    ],
  },
  {
    id: 6,
    name: "Alicate Universal 8\" Profissional Isolado 1000V Cabo Emborrachado",
    price: 19.90,
    originalPrice: 49.90,
    discount: 60,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/tnJY1AmReIxK_01cb35ba.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/tnJY1AmReIxK_01cb35ba.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/HkOExMqnwHYW_19cbb54f.jpg",
    ],
    rating: 4.8,
    sold: 45678,
    freeShipping: true,
    category: "Alicates",
    description: "Alicate universal profissional de 8 polegadas (200mm) com isolamento para até 1000V, ideal para trabalhos elétricos com segurança. Fabricado em aço cromo-vanádio temperado de alta resistência. Cabo emborrachado ergonômico antideslizante para maior conforto e firmeza. Corte lateral afiado para fios de cobre e alumínio. Mordente serrilhado para melhor aderência. Articulação precisa e suave. Ferramenta indispensável para eletricistas, técnicos e uso doméstico.",
    specifications: [
      { label: "Tamanho", value: "8\" (200mm)" },
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Isolamento", value: "1000V" },
      { label: "Cabo", value: "Emborrachado ergonômico" },
      { label: "Peso", value: "280g" },
    ],
    variations: [
      { label: "Tamanho", options: ["6\"", "8\""] },
    ],
  },
  {
    id: 7,
    name: "Nível Laser Verde 12 Linhas 360° Autonivelante Profissional",
    price: 189.90,
    originalPrice: 499.90,
    discount: 62,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/el2F1hQ1WbwQ_7553d139.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/el2F1hQ1WbwQ_7553d139.jpg",
    ],
    rating: 4.6,
    sold: 8765,
    freeShipping: true,
    category: "Medição",
    description: "Nível laser profissional com 12 linhas verdes de alta visibilidade e cobertura 360° (3x360°). Autonivelamento automático em até 4° de inclinação com alarme sonoro fora do alcance. Laser verde 4 vezes mais visível que o vermelho, ideal para ambientes claros. Alcance de até 30m (60m com receptor). Bateria de lítio recarregável com autonomia de até 8 horas. Acompanha base giratória magnética, suporte de parede, controle remoto e maleta de transporte.",
    specifications: [
      { label: "Linhas", value: "12 (3x360°)" },
      { label: "Cor do Laser", value: "Verde" },
      { label: "Alcance", value: "30m (60m com receptor)" },
      { label: "Precisão", value: "±3mm a 10m" },
      { label: "Bateria", value: "Lítio recarregável" },
      { label: "Autonomia", value: "Até 8 horas" },
    ],
    variations: [
      { label: "Linhas", options: ["8 Linhas", "12 Linhas", "16 Linhas"] },
    ],
  },
  {
    id: 8,
    name: "Multímetro Digital Profissional True RMS com Display Retroiluminado",
    price: 34.90,
    originalPrice: 89.90,
    discount: 61,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/PpZbckbSnNUv_505d5e53.webp",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/PpZbckbSnNUv_505d5e53.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/qyICtyTH0Ie5_0bcd2d96.webp",
    ],
    rating: 4.7,
    sold: 23456,
    freeShipping: true,
    category: "Elétricas",
    description: "Multímetro digital profissional com True RMS para medições precisas em circuitos não lineares. Display LCD retroiluminado de 6000 contagens com leitura clara em qualquer ambiente. Mede tensão AC/DC, corrente AC/DC, resistência, capacitância, frequência, temperatura, teste de diodo e continuidade. Proteção contra sobrecarga em todas as faixas. Desligamento automático para economia de bateria. Acompanha pontas de prova de silicone, termopar tipo K e estojo protetor.",
    specifications: [
      { label: "Display", value: "LCD 6000 contagens" },
      { label: "True RMS", value: "Sim" },
      { label: "Tensão DC", value: "0.1mV - 600V" },
      { label: "Tensão AC", value: "0.1mV - 600V" },
      { label: "Corrente", value: "0.1µA - 10A" },
      { label: "Alimentação", value: "2x AAA" },
    ],
    variations: [
      { label: "Modelo", options: ["Básico", "True RMS"] },
    ],
  },
  {
    id: 9,
    name: "Chave Inglesa Ajustável 10\" 250mm Cabo Emborrachado Profissional",
    price: 24.90,
    originalPrice: 59.90,
    discount: 58,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/Ll0qIGKtVl8F_3c5a77b7.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/Ll0qIGKtVl8F_3c5a77b7.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/wdZDAiPIPM4i_eede38f2.jpg",
    ],
    rating: 4.5,
    sold: 15678,
    freeShipping: true,
    category: "Chaves",
    description: "Chave inglesa ajustável profissional de 10 polegadas (250mm) com abertura máxima de 30mm. Fabricada em aço cromo-vanádio forjado de alta resistência com acabamento cromado anticorrosivo. Escala milimétrica gravada na mandíbula para ajuste preciso. Cabo emborrachado ergonômico antideslizante para maior conforto durante o uso prolongado. Mecanismo de ajuste suave e preciso com rosca sem folga. Ideal para encanamento, mecânica, manutenção industrial e uso doméstico.",
    specifications: [
      { label: "Tamanho", value: "10\" (250mm)" },
      { label: "Abertura Máxima", value: "30mm" },
      { label: "Material", value: "Aço Cromo-Vanádio forjado" },
      { label: "Acabamento", value: "Cromado" },
      { label: "Peso", value: "350g" },
    ],
    variations: [
      { label: "Tamanho", options: ["8\" (200mm)", "10\" (250mm)", "12\" (300mm)"] },
    ],
  },
  {
    id: 10,
    name: "Serra Tico-Tico Elétrica 500W Profissional com Velocidade Variável",
    price: 119.90,
    originalPrice: 289.90,
    discount: 59,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/wmUcZZ7AF3s6_a1ea450b.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/wmUcZZ7AF3s6_a1ea450b.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/cm4HzgTIAb7J_a229a478.jpg",
    ],
    rating: 4.6,
    sold: 9876,
    freeShipping: true,
    category: "Serras",
    description: "Serra tico-tico elétrica profissional com motor de 500W e velocidade variável de 0 a 3000 RPM. Capacidade de corte em madeira até 65mm, aço até 6mm e alumínio até 10mm. Base inclinável de 0° a 45° para cortes angulares. Sistema de troca rápida de lâmina sem ferramentas (SDS). Soprador de pó integrado para linha de corte visível. Empunhadura emborrachada com baixa vibração. Acompanha 3 lâminas (madeira, metal e curvas) e chave Allen.",
    specifications: [
      { label: "Potência", value: "500W" },
      { label: "Velocidade", value: "0-3000 RPM" },
      { label: "Corte em Madeira", value: "Até 65mm" },
      { label: "Corte em Aço", value: "Até 6mm" },
      { label: "Base Inclinável", value: "0° a 45°" },
      { label: "Peso", value: "2.1 kg" },
    ],
    variations: [
      { label: "Voltagem", options: ["110V", "220V"] },
    ],
  },
  {
    id: 11,
    name: "Pistola de Cola Quente Profissional 100W Bivolt com 10 Bastões",
    price: 29.90,
    originalPrice: 69.90,
    discount: 57,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/FV6Fff5fw0J2_806ff95c.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/FV6Fff5fw0J2_806ff95c.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/q7yz09OxkuaU_248fe2a1.png",
    ],
    rating: 4.7,
    sold: 34567,
    freeShipping: true,
    category: "Acessórios",
    description: "Pistola de cola quente profissional de 100W com aquecimento rápido em apenas 3 minutos. Compatível com bastões de cola de 11mm. Bico de precisão em cobre para aplicação controlada. Gatilho ergonômico com dosagem precisa. Suporte dobrável integrado para apoio seguro. Bivolt automático (110V/220V). Acompanha 10 bastões de cola transparente de alta aderência. Ideal para artesanato, marcenaria, decoração, reparos e trabalhos manuais diversos.",
    specifications: [
      { label: "Potência", value: "100W" },
      { label: "Bastão", value: "11mm" },
      { label: "Aquecimento", value: "3 minutos" },
      { label: "Voltagem", value: "Bivolt automático" },
      { label: "Bico", value: "Cobre de precisão" },
      { label: "Incluso", value: "10 bastões de cola" },
    ],
    variations: [
      { label: "Potência", options: ["60W", "100W", "150W"] },
    ],
  },
  {
    id: 12,
    name: "Jogo de Chaves de Fenda e Phillips 6 Peças Profissional Imantadas",
    price: 19.90,
    originalPrice: 49.90,
    discount: 60,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/n4dvQAHoxSDt_64b41144.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/n4dvQAHoxSDt_64b41144.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/9iiJZmPLvy1v_7b979659.webp",
    ],
    rating: 4.8,
    sold: 41234,
    freeShipping: true,
    category: "Chaves",
    description: "Jogo profissional com 6 chaves de fenda e Phillips em tamanhos variados. Pontas imantadas de alta qualidade que seguram parafusos com firmeza, facilitando o trabalho em locais de difícil acesso. Hastes em aço cromo-vanádio temperado e revenido para máxima durabilidade. Cabos emborrachados ergonômicos bicolor com design antideslizante para maior conforto e torque. Tamanhos inclusos: Fenda 3.2x75mm, 5x100mm, 6x150mm e Phillips PH1x75mm, PH2x100mm, PH2x150mm.",
    specifications: [
      { label: "Quantidade", value: "6 peças" },
      { label: "Tipos", value: "Fenda e Phillips" },
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Pontas", value: "Imantadas" },
      { label: "Cabo", value: "Emborrachado bicolor" },
    ],
    variations: [
      { label: "Modelo", options: ["6 Peças", "10 Peças"] },
    ],
  },
  {
    id: 13,
    name: "Maleta de Ferramentas Completa 151 Peças Profissional com Soquetes e Chaves",
    price: 129.90,
    originalPrice: 349.90,
    discount: 63,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/WoeLWkJ5OJxb_502eec1e.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/WoeLWkJ5OJxb_502eec1e.jpg",
    ],
    rating: 4.5,
    sold: 15432,
    freeShipping: true,
    category: "Kits de Ferramentas",
    description: "Maleta profissional completa com 151 peças para atender todas as necessidades de manutenção. Inclui: jogo de soquetes com chave catraca em encaixes 1/4\" e 1/2\", chaves combinadas, chaves Allen, alicate universal, alicate de bico, alicate de corte, martelo, estilete, trena 5m, nível de bolha, chaves de fenda e Phillips, bits variados, brocas e muito mais. Todas as ferramentas em aço cromo-vanádio com acabamento cromado. Maleta em alumínio reforçado com fechos de segurança.",
    specifications: [
      { label: "Quantidade de Peças", value: "151" },
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Maleta", value: "Alumínio reforçado" },
      { label: "Encaixes", value: "1/4\" e 1/2\"" },
      { label: "Peso Total", value: "8.5 kg" },
    ],
    variations: [
      { label: "Modelo", options: ["129 Peças", "151 Peças"] },
    ],
  },
  {
    id: 14,
    name: "Kit Parafusadeira Chave de Impacto + Maleta Jogo Soquete 46 Peças",
    price: 99.90,
    originalPrice: 279.90,
    discount: 64,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/IRLnpB8PTo63_42c85afe.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/IRLnpB8PTo63_42c85afe.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/eWWyuU3RKcla_36c4aa3f.jpg",
    ],
    rating: 4.6,
    sold: 19876,
    freeShipping: true,
    category: "Parafusadeiras",
    description: "Kit profissional com parafusadeira/chave de impacto sem fio e maleta com jogo de soquetes de 46 peças. Parafusadeira com motor brushless de alto torque (250N.m), ideal para parafusos e porcas resistentes. Bateria de lítio 21V recarregável com indicador de carga LED. Jogo de soquetes em aço cromo-vanádio com chave catraca reversível, extensões e adaptadores. Maleta organizadora resistente a impactos.",
    specifications: [
      { label: "Torque Máximo", value: "250N.m" },
      { label: "Motor", value: "Brushless" },
      { label: "Bateria", value: "21V Lítio" },
      { label: "Soquetes", value: "46 peças" },
      { label: "Peso", value: "4.2 kg" },
    ],
    variations: [
      { label: "Baterias", options: ["1 Bateria", "2 Baterias"] },
    ],
  },
  {
    id: 15,
    name: "Alicate Multifuncional Heavy Duty 8\" com 4 Funções Profissional",
    price: 22.90,
    originalPrice: 54.90,
    discount: 58,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/HkOExMqnwHYW_19cbb54f.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/HkOExMqnwHYW_19cbb54f.jpg",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/tnJY1AmReIxK_01cb35ba.jpg",
    ],
    rating: 4.7,
    sold: 32456,
    freeShipping: true,
    category: "Alicates",
    description: "Alicate multifuncional Heavy Duty de 8 polegadas com 4 funções em uma única ferramenta: corte lateral, mordente serrilhado, desencapador de fios e crimpador de terminais. Fabricado em aço cromo-vanádio de alta resistência com tratamento térmico para máxima durabilidade. Cabo emborrachado bicolor ergonômico com design antideslizante. Articulação de precisão com mola de retorno para uso contínuo sem fadiga. Ideal para eletricistas, técnicos e profissionais de manutenção.",
    specifications: [
      { label: "Tamanho", value: "8\" (200mm)" },
      { label: "Funções", value: "4 em 1" },
      { label: "Material", value: "Aço Cromo-Vanádio" },
      { label: "Cabo", value: "Emborrachado bicolor" },
      { label: "Peso", value: "300g" },
    ],
    variations: [
      { label: "Tamanho", options: ["6\"", "8\""] },
    ],
  },
  {
    id: 16,
    name: "Kit 5 em 1 Ferramentas Sem Fio Parafusadeira Esmerilhadeira Furadeira com Maleta",
    price: 299.90,
    originalPrice: 799.90,
    discount: 63,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/7DflIrhkB8TS_5d4cc7f3.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/7DflIrhkB8TS_5d4cc7f3.jpg",
    ],
    rating: 4.4,
    sold: 7654,
    freeShipping: true,
    category: "Kits de Ferramentas",
    description: "Kit profissional 5 em 1 com ferramentas sem fio intercambiáveis: parafusadeira, furadeira de impacto, esmerilhadeira, mini motosserra e chave de impacto pneumática. Motor brushless de alta eficiência com 2 baterias de lítio 68V. Cada ferramenta se encaixa no mesmo corpo motorizado, economizando espaço e dinheiro. Maleta organizadora resistente com compartimentos para todas as peças e acessórios. Ideal para profissionais que precisam de versatilidade.",
    specifications: [
      { label: "Ferramentas", value: "5 em 1" },
      { label: "Motor", value: "Brushless" },
      { label: "Baterias", value: "2x 68V Lítio" },
      { label: "Inclui", value: "Parafusadeira, Furadeira, Esmerilhadeira, Mini Motosserra, Chave de Impacto" },
      { label: "Maleta", value: "Resistente a impactos" },
    ],
    variations: [
      { label: "Baterias", options: ["1 Bateria", "2 Baterias"] },
    ],
  },
  {
    id: 17,
    name: "Jogo de Chaves Allen Torx Hexagonal 30 Peças com Suporte",
    price: 14.90,
    originalPrice: 39.90,
    discount: 63,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/9iiJZmPLvy1v_7b979659.webp",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/9iiJZmPLvy1v_7b979659.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/n4dvQAHoxSDt_64b41144.jpg",
    ],
    rating: 4.6,
    sold: 27890,
    freeShipping: true,
    category: "Chaves",
    description: "Jogo completo com 30 chaves Allen e Torx em medidas métricas e polegadas. Inclui chaves hexagonais (1.5mm a 10mm), chaves Torx (T10 a T50) e chaves em polegadas (1/16\" a 3/8\"). Fabricadas em aço cromo-vanádio S2 de alta durabilidade com acabamento niquelado anticorrosivo. Pontas com formato de bola (ball-end) que permitem trabalhar em ângulos de até 25°. Suporte organizador dobrável que mantém todas as chaves acessíveis e organizadas.",
    specifications: [
      { label: "Quantidade", value: "30 peças" },
      { label: "Tipos", value: "Allen + Torx" },
      { label: "Material", value: "Aço Cromo-Vanádio S2" },
      { label: "Acabamento", value: "Niquelado" },
      { label: "Pontas", value: "Ball-end (25°)" },
    ],
    variations: [
      { label: "Modelo", options: ["30 Peças", "25 Peças"] },
    ],
  },
  {
    id: 18,
    name: "Serra Mármore 125mm 1500W Profissional com Disco de Corte",
    price: 139.90,
    originalPrice: 329.90,
    discount: 58,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/zUNp43k6FdMO_1800d46a.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/zUNp43k6FdMO_1800d46a.jpg",
    ],
    rating: 4.5,
    sold: 11234,
    freeShipping: true,
    category: "Serras",
    description: "Serra mármore profissional com motor potente de 1500W e disco de 125mm (4.1/2\"). Ideal para corte de cerâmicas, porcelanatos, mármores, granitos, tijolos e blocos de concreto. Profundidade de corte de até 34mm. Rotação de 12000 RPM para cortes rápidos e limpos. Proteção de disco com ajuste de profundidade. Empunhadura ergonômica emborrachada com gatilho de segurança. Acompanha disco diamantado segmentado e chave para troca.",
    specifications: [
      { label: "Potência", value: "1500W" },
      { label: "Disco", value: "125mm (4.1/2\")" },
      { label: "Profundidade de Corte", value: "34mm" },
      { label: "Rotação", value: "12000 RPM" },
      { label: "Peso", value: "2.9 kg" },
    ],
    variations: [
      { label: "Voltagem", options: ["110V", "220V"] },
    ],
  },
  {
    id: 19,
    name: "Kit Bits Ponteiras Magnéticas 10 Peças PH2 Dupla para Parafusadeira",
    price: 18.98,
    originalPrice: 34.90,
    discount: 46,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/QZa0YIgW7pr3_083fbf66.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/QZa0YIgW7pr3_083fbf66.jpg",
    ],
    rating: 4.8,
    sold: 56789,
    freeShipping: true,
    category: "Acessórios",
    description: "Kit com 10 ponteiras (bits) magnéticas duplas PH2 (Phillips) de 65mm, as mais utilizadas em montagem de móveis, instalações elétricas e manutenção geral. Encaixe sextavado 1/4\" compatível com todas as parafusadeiras e furadeiras do mercado. Fabricadas em aço S2 de alta resistência ao torque e desgaste. Ponta imantada de alta retenção que segura parafusos com firmeza. Dupla ponta (PH2 + Fenda 6mm) para maior versatilidade.",
    specifications: [
      { label: "Quantidade", value: "10 peças" },
      { label: "Tipo", value: "PH2 + Fenda 6mm (dupla)" },
      { label: "Comprimento", value: "65mm" },
      { label: "Encaixe", value: "Sextavado 1/4\"" },
      { label: "Material", value: "Aço S2" },
      { label: "Magnética", value: "Sim" },
    ],
    variations: [
      { label: "Quantidade", options: ["10 Peças", "20 Peças"] },
    ],
  },
  {
    id: 20,
    name: "Esmerilhadeira Angular 4.1/2\" 850W Profissional com Disco",
    price: 109.90,
    originalPrice: 249.90,
    discount: 56,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/7DflIrhkB8TS_5d4cc7f3.jpg",
    images: [
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/7DflIrhkB8TS_5d4cc7f3.jpg",
    ],
    rating: 4.5,
    sold: 14567,
    freeShipping: true,
    category: "Elétricas",
    description: "Esmerilhadeira angular profissional de 4.1/2\" (115mm) com motor de 850W de alta performance. Rotação de 11000 RPM para corte e desbaste eficientes. Empunhadura lateral reposicionável para maior controle e versatilidade. Proteção de disco ajustável sem ferramentas. Trava de eixo para troca rápida de disco. Corpo compacto e ergonômico com ventilação otimizada para trabalho prolongado. Acompanha disco de corte para metal, disco de desbaste e chave de pino.",
    specifications: [
      { label: "Potência", value: "850W" },
      { label: "Disco", value: "4.1/2\" (115mm)" },
      { label: "Rotação", value: "11000 RPM" },
      { label: "Rosca do Eixo", value: "M14" },
      { label: "Peso", value: "1.9 kg" },
    ],
    variations: [
      { label: "Voltagem", options: ["110V", "220V"] },
    ],
  },
];

// Order Bump items - produtos complementares sugeridos no checkout
export const orderBumpItems: OrderBumpItem[] = [
  {
    id: 101,
    name: "Kit 10 Brocas Aço Rápido HSS 1mm a 10mm",
    price: 12.90,
    originalPrice: 29.90,
    discount: 57,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/QZa0YIgW7pr3_083fbf66.jpg",
    shortDescription: "Brocas HSS para madeira, metal e plástico. Encaixe universal.",
  },
  {
    id: 102,
    name: "Óculos de Proteção Segurança Antiembaçante",
    price: 9.90,
    originalPrice: 24.90,
    discount: 60,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/tnJY1AmReIxK_01cb35ba.jpg",
    shortDescription: "Proteção UV, antiembaçante e antirisco. Norma ANSI Z87.1.",
  },
  {
    id: 103,
    name: "Fita Isolante Preta 20m Profissional",
    price: 5.90,
    originalPrice: 12.90,
    discount: 54,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/1VDYVRIdYORv_aee9ca4d.jpg",
    shortDescription: "Fita isolante 19mm x 20m. Alta aderência e resistência.",
  },
  {
    id: 104,
    name: "Luvas de Proteção Anticorte Nitrílica",
    price: 14.90,
    originalPrice: 34.90,
    discount: 57,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/HkOExMqnwHYW_19cbb54f.jpg",
    shortDescription: "Proteção nível 5 contra cortes. Aderência em superfícies úmidas.",
  },
];

export const bannerImages = [
  {
    id: 1,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-1-XKj7aLPik4Kyt4NLECeDeA.webp",
    alt: "Super Ofertas em Ferramentas - Descontos até 72%",
  },
  {
    id: 2,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-2-Zuy3M2EwTYqDtMzRptkujs.webp",
    alt: "Mega Ofertas Ferramentas - Tempo Limitado",
  },
  {
    id: 3,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-3-YPRRYxdwTUa9UWAFkbPoGQ.webp",
    alt: "Frete Grátis para Todo o Brasil",
  },
  {
    id: 4,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-4-fgCA8EDSXhSPhmt6HiPnbx.webp",
    alt: "Cupons e Cashback em Ferramentas",
  },
];

export const checkoutSuccessImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/checkout-success-8YTmXGVpK8mfh69EbXbtJJ.webp";
