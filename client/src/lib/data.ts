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

export const categories = [
  { id: 1, name: "Eletrônicos", icon: "Smartphone" },
  { id: 2, name: "Moda", icon: "Shirt" },
  { id: 3, name: "Casa", icon: "Home" },
  { id: 4, name: "Beleza", icon: "Sparkles" },
  { id: 5, name: "Esportes", icon: "Dumbbell" },
  { id: 6, name: "Brinquedos", icon: "Gamepad2" },
  { id: 7, name: "Livros", icon: "BookOpen" },
  { id: 8, name: "Pets", icon: "Dog" },
  { id: 9, name: "Automotivo", icon: "Car" },
  { id: 10, name: "Saúde", icon: "Heart" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Fone de Ouvido Bluetooth TWS com Cancelamento de Ruído Ativo",
    price: 49.90,
    originalPrice: 129.90,
    discount: 62,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    ],
    rating: 4.8,
    sold: 15234,
    freeShipping: true,
    category: "Eletrônicos",
    description: "Fone de ouvido Bluetooth 5.3 com cancelamento de ruído ativo (ANC), bateria de longa duração de até 30 horas, microfone integrado para chamadas cristalinas, resistente à água IPX5. Design ergonômico e leve para uso prolongado. Compatível com iOS e Android.",
    variations: [
      { label: "Cor", options: ["Preto", "Branco", "Azul"] },
    ],
  },
  {
    id: 2,
    name: "Camiseta Oversized Unissex Algodão Premium Streetwear",
    price: 34.90,
    originalPrice: 79.90,
    discount: 56,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop",
    ],
    rating: 4.6,
    sold: 8921,
    freeShipping: true,
    category: "Moda",
    description: "Camiseta oversized unissex confeccionada em algodão premium 100%. Modelagem ampla e confortável, ideal para o dia a dia. Tecido macio e respirável com acabamento de alta qualidade. Disponível em diversos tamanhos e cores.",
    variations: [
      { label: "Cor", options: ["Preto", "Branco", "Cinza", "Bege"] },
      { label: "Tamanho", options: ["P", "M", "G", "GG"] },
    ],
  },
  {
    id: 3,
    name: "Smartwatch Relógio Inteligente com Monitor Cardíaco e GPS",
    price: 89.90,
    originalPrice: 249.90,
    discount: 64,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop",
    ],
    rating: 4.5,
    sold: 12456,
    freeShipping: true,
    category: "Eletrônicos",
    description: "Smartwatch com tela AMOLED de 1.85 polegadas, monitor cardíaco 24h, GPS integrado, mais de 100 modos de exercício. Resistente à água IP68. Bateria de até 7 dias. Notificações de apps, controle de música e câmera remota.",
    variations: [
      { label: "Cor", options: ["Preto", "Prata", "Rosa"] },
    ],
  },
  {
    id: 4,
    name: "Luminária LED de Mesa com Carregador Wireless Qi",
    price: 59.90,
    originalPrice: 149.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop",
    ],
    rating: 4.7,
    sold: 5678,
    freeShipping: true,
    category: "Casa",
    description: "Luminária LED de mesa com 3 níveis de brilho e temperatura de cor ajustável. Base com carregador wireless Qi 15W para smartphones compatíveis. Design moderno e minimalista. Braço flexível e ajustável.",
    variations: [
      { label: "Cor", options: ["Branco", "Preto"] },
    ],
  },
  {
    id: 5,
    name: "Kit Skincare Coreano 7 Etapas Hidratação Profunda",
    price: 79.90,
    originalPrice: 199.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop",
    ],
    rating: 4.9,
    sold: 23456,
    freeShipping: true,
    category: "Beleza",
    description: "Kit completo de skincare coreano com 7 etapas: óleo de limpeza, espuma facial, tônico, essência, sérum de vitamina C, hidratante e protetor solar. Produtos veganos e cruelty-free. Para todos os tipos de pele.",
    variations: [
      { label: "Tipo de Pele", options: ["Normal", "Oleosa", "Seca", "Mista"] },
    ],
  },
  {
    id: 6,
    name: "Tênis Esportivo Ultra Leve para Corrida e Academia",
    price: 119.90,
    originalPrice: 299.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
    ],
    rating: 4.7,
    sold: 18234,
    freeShipping: true,
    category: "Esportes",
    description: "Tênis esportivo ultra leve com tecnologia de amortecimento em gel. Solado antiderrapante, cabedal em malha respirável. Ideal para corrida, caminhada e treinos na academia. Conforto durante todo o dia.",
    variations: [
      { label: "Cor", options: ["Preto/Vermelho", "Branco/Azul", "Cinza/Verde"] },
      { label: "Tamanho", options: ["38", "39", "40", "41", "42", "43", "44"] },
    ],
  },
  {
    id: 7,
    name: "Câmera de Segurança WiFi 360° Full HD com Visão Noturna",
    price: 69.90,
    originalPrice: 179.90,
    discount: 61,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=800&fit=crop",
    ],
    rating: 4.4,
    sold: 9876,
    freeShipping: false,
    category: "Eletrônicos",
    description: "Câmera de segurança WiFi com rotação 360°, resolução Full HD 1080p, visão noturna infravermelha, detecção de movimento com alerta no celular. Áudio bidirecional e armazenamento em nuvem ou cartão SD.",
    variations: [
      { label: "Modelo", options: ["Interior", "Exterior"] },
    ],
  },
  {
    id: 8,
    name: "Mochila Notebook Impermeável com USB Antifurto",
    price: 54.90,
    originalPrice: 139.90,
    discount: 61,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&h=800&fit=crop",
    ],
    rating: 4.6,
    sold: 7654,
    freeShipping: true,
    category: "Moda",
    description: "Mochila para notebook até 15.6 polegadas com tecido impermeável, porta USB externa para carregamento, zíper antifurto oculto. Múltiplos compartimentos organizadores. Alças acolchoadas e ergonômicas.",
    variations: [
      { label: "Cor", options: ["Preto", "Cinza", "Azul Marinho"] },
    ],
  },
  {
    id: 9,
    name: "Panela Elétrica de Arroz Multifuncional 5L Digital",
    price: 99.90,
    originalPrice: 259.90,
    discount: 62,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop",
    ],
    rating: 4.8,
    sold: 4567,
    freeShipping: true,
    category: "Casa",
    description: "Panela elétrica multifuncional com capacidade de 5 litros. Display digital com timer programável. 12 funções: arroz, feijão, sopa, vapor, bolo e mais. Revestimento antiaderente. Mantém aquecido automaticamente.",
    variations: [
      { label: "Cor", options: ["Branco", "Vermelho"] },
    ],
  },
  {
    id: 10,
    name: "Ring Light LED 26cm com Tripé Ajustável e Suporte Celular",
    price: 39.90,
    originalPrice: 99.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=800&fit=crop",
    ],
    rating: 4.5,
    sold: 31245,
    freeShipping: true,
    category: "Eletrônicos",
    description: "Ring Light LED de 26cm com 3 modos de iluminação (quente, frio e neutro) e 10 níveis de brilho. Tripé ajustável de até 2.1m com suporte para celular. Ideal para selfies, vídeos, lives e maquiagem.",
    variations: [
      { label: "Tamanho", options: ["26cm", "33cm"] },
    ],
  },
  {
    id: 11,
    name: "Garrafa Térmica Inox 500ml com Infusor de Chá",
    price: 29.90,
    originalPrice: 69.90,
    discount: 57,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
    ],
    rating: 4.7,
    sold: 14567,
    freeShipping: true,
    category: "Casa",
    description: "Garrafa térmica em aço inoxidável 304 com capacidade de 500ml. Mantém a temperatura por até 12 horas. Inclui infusor removível para chás. Tampa com trava de segurança. Livre de BPA.",
    variations: [
      { label: "Cor", options: ["Prata", "Preto", "Rosa", "Azul"] },
    ],
  },
  {
    id: 12,
    name: "Organizador de Maquiagem Acrílico Giratório 360°",
    price: 44.90,
    originalPrice: 109.90,
    discount: 59,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    ],
    rating: 4.8,
    sold: 6789,
    freeShipping: true,
    category: "Beleza",
    description: "Organizador de maquiagem em acrílico transparente com base giratória 360°. Múltiplos compartimentos ajustáveis para batons, pincéis, cremes e perfumes. Design elegante que decora qualquer penteadeira.",
    variations: [
      { label: "Modelo", options: ["Pequeno", "Grande"] },
    ],
  },
  {
    id: 13,
    name: "Controle Gamepad Bluetooth para Celular e PC Gamer",
    price: 59.90,
    originalPrice: 149.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=800&fit=crop",
    ],
    rating: 4.3,
    sold: 5432,
    freeShipping: false,
    category: "Brinquedos",
    description: "Controle gamepad Bluetooth 5.0 compatível com Android, iOS, PC e Switch. Joysticks analógicos de precisão, gatilhos responsivos, vibração dupla. Bateria recarregável de até 15 horas. Design ergonômico.",
    variations: [
      { label: "Cor", options: ["Preto", "Branco", "Transparente"] },
    ],
  },
  {
    id: 14,
    name: "Coleira GPS Rastreador Pet com App em Tempo Real",
    price: 79.90,
    originalPrice: 199.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
    ],
    rating: 4.6,
    sold: 3456,
    freeShipping: true,
    category: "Pets",
    description: "Coleira com rastreador GPS em tempo real via aplicativo. Cerca virtual com alerta de fuga. Resistente à água IP67. Bateria de até 5 dias. Histórico de rotas. Compatível com cães e gatos de todos os portes.",
    variations: [
      { label: "Tamanho", options: ["P (até 10kg)", "M (10-25kg)", "G (25kg+)"] },
    ],
  },
  {
    id: 15,
    name: "Aspirador de Pó Robô Inteligente com Mapeamento Laser",
    price: 199.90,
    originalPrice: 499.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?w=800&h=800&fit=crop",
    ],
    rating: 4.5,
    sold: 2345,
    freeShipping: true,
    category: "Casa",
    description: "Robô aspirador com mapeamento laser LiDAR, sucção de 4000Pa, função de aspirar e passar pano simultaneamente. Controle por app e voz (Alexa/Google). Bateria de até 180 minutos. Retorno automático à base.",
    variations: [
      { label: "Cor", options: ["Branco", "Preto"] },
    ],
  },
  {
    id: 16,
    name: "Carregador Portátil Power Bank 20000mAh com Display LED",
    price: 44.90,
    originalPrice: 119.90,
    discount: 63,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop",
    ],
    rating: 4.4,
    sold: 19876,
    freeShipping: true,
    category: "Eletrônicos",
    description: "Power bank de 20000mAh com display LED que mostra a porcentagem de carga. Carregamento rápido 22.5W, 2 portas USB-A e 1 USB-C. Carrega até 4 dispositivos simultaneamente. Compacto e leve.",
    variations: [
      { label: "Cor", options: ["Preto", "Branco", "Azul"] },
    ],
  },
  {
    id: 17,
    name: "Óculos de Sol Polarizado UV400 Estilo Aviador Clássico",
    price: 24.90,
    originalPrice: 79.90,
    discount: 69,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    ],
    rating: 4.3,
    sold: 25678,
    freeShipping: true,
    category: "Moda",
    description: "Óculos de sol com lentes polarizadas e proteção UV400. Armação em metal com acabamento premium. Estilo aviador clássico unissex. Inclui estojo rígido e flanela de limpeza.",
    variations: [
      { label: "Cor da Lente", options: ["Preto", "Marrom", "Espelhado Azul", "Verde"] },
    ],
  },
  {
    id: 18,
    name: "Mini Projetor LED Portátil Full HD WiFi com Espelhamento",
    price: 159.90,
    originalPrice: 399.90,
    discount: 60,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop",
    ],
    rating: 4.2,
    sold: 4321,
    freeShipping: true,
    category: "Eletrônicos",
    description: "Mini projetor LED com resolução nativa Full HD 1080p, WiFi integrado para espelhamento de tela sem fio. Tela de até 200 polegadas. Alto-falantes estéreo embutidos. Portas HDMI, USB e AV. Ideal para cinema em casa.",
    variations: [
      { label: "Cor", options: ["Branco", "Preto"] },
    ],
  },
  {
    id: 19,
    name: "Tapete de Yoga Antiderrapante NBR 10mm com Bolsa",
    price: 39.90,
    originalPrice: 89.90,
    discount: 56,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop",
    ],
    rating: 4.6,
    sold: 8765,
    freeShipping: true,
    category: "Esportes",
    description: "Tapete de yoga em NBR de alta densidade com 10mm de espessura. Superfície antiderrapante dupla face. Dimensões 183x61cm. Inclui bolsa de transporte com alça. Ideal para yoga, pilates e exercícios no chão.",
    variations: [
      { label: "Cor", options: ["Roxo", "Azul", "Rosa", "Preto", "Verde"] },
    ],
  },
  {
    id: 20,
    name: "Conjunto de Pincéis de Maquiagem Profissional 15 Peças",
    price: 32.90,
    originalPrice: 89.90,
    discount: 63,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
    ],
    rating: 4.7,
    sold: 11234,
    freeShipping: true,
    category: "Beleza",
    description: "Kit com 15 pincéis de maquiagem profissional com cerdas sintéticas ultra macias. Inclui pincéis para base, pó, contorno, sombra, blush e lábios. Cabo em madeira com acabamento rose gold. Acompanha nécessaire organizadora.",
    variations: [
      { label: "Cor do Cabo", options: ["Rose Gold", "Preto", "Branco"] },
    ],
  },
];

export const bannerImages = [
  {
    id: 1,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-1-XKj7aLPik4Kyt4NLECeDeA.webp",
    alt: "Super Ofertas Brasil - Descontos até 70%",
  },
  {
    id: 2,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-2-Zuy3M2EwTYqDtMzRptkujs.webp",
    alt: "Mega Ofertas - Tempo Limitado",
  },
  {
    id: 3,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-3-YPRRYxdwTUa9UWAFkbPoGQ.webp",
    alt: "Frete Grátis para Todo o Brasil",
  },
  {
    id: 4,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/banner-hero-4-fgCA8EDSXhSPhmt6HiPnbx.webp",
    alt: "Cupons e Cashback",
  },
];

export const checkoutSuccessImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/checkout-success-8YTmXGVpK8mfh69EbXbtJJ.webp";
