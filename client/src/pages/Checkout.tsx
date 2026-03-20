/*
 * Design: Bazaar Digital — Checkout simples com Order Bump dinâmico + Pagamento BYNET PIX
 * Formulário de dados, order bumps contextuais, opções de frete, resumo do pedido
 * Nicho: Ferramentas
 */
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Lock, ChevronLeft, Check, Zap, Gift, Flame, Truck, Loader2 } from "lucide-react";
import { checkoutSuccessImage, getOrderBumpsForCart, shippingOptions, type ShippingOption } from "@/lib/data";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [selectedBumps, setSelectedBumps] = useState<Set<number>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [cpf, setCpf] = useState("");

  // Determine which shipping options are available based on cart items
  const productIds = useMemo(() => items.map((i) => i.product.id), [items]);
  const currentBumps = useMemo(() => getOrderBumpsForCart(productIds), [productIds]);

  // Shipping: check if any product has custom shipping
  const hasCustomShipping = useMemo(() => {
    return productIds.some((id) => shippingOptions[id]);
  }, [productIds]);

  const customShippingOpts: ShippingOption[] = useMemo(() => {
    for (const id of productIds) {
      if (shippingOptions[id]) return shippingOptions[id];
    }
    return [];
  }, [productIds]);

  const [selectedShippingIdx, setSelectedShippingIdx] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const bumpTotal = currentBumps
    .filter((b) => selectedBumps.has(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  // Shipping cost logic
  const shippingCost = hasCustomShipping
    ? customShippingOpts[selectedShippingIdx]?.price ?? 19.85
    : totalPrice + bumpTotal >= 99
      ? 0
      : 14.90;

  const finalTotal = totalPrice + bumpTotal + shippingCost;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCepBlur = async () => {
    const cleanCep = form.cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch {
        // Silently fail
      }
    }
  };

  const toggleBump = (id: number) => {
    setSelectedBumps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // tRPC mutation for creating PIX payment
  const createPixMutation = trpc.payment.createPix.useMutation({
    onSuccess: (data) => {
      // Save PIX data to localStorage for the payment page
      if (data.pix) {
        localStorage.setItem(
          `pix_${data.transactionId}`,
          JSON.stringify({
            qrCode: data.pix.qrCode,
            qrCodeImageUrl: data.pix.qrCodeImageUrl,
            expirationDate: data.pix.expirationDate,
          })
        );
      }
      clearCart();
      // Navigate to payment page with transaction ID
      navigate(`/pagamento/${data.transactionId}`);
    },
    onError: (error) => {
      alert(`Erro ao processar pagamento: ${error.message}`);
    },
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Nome é obrigatório";
    if (!form.email.trim() || !form.email.includes("@")) errors.email = "E-mail inválido";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone inválido";
    if (!cpf.trim() || cpf.replace(/\D/g, "").length < 11) errors.cpf = "CPF inválido";
    if (!form.cep.trim() || form.cep.replace(/\D/g, "").length < 8) errors.cep = "CEP inválido";
    if (!form.street.trim()) errors.street = "Rua é obrigatória";
    if (!form.number.trim()) errors.number = "Número é obrigatório";
    if (!form.neighborhood.trim()) errors.neighborhood = "Bairro é obrigatório";
    if (!form.city.trim()) errors.city = "Cidade é obrigatória";
    if (!form.state.trim()) errors.state = "Estado é obrigatório";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build items array (cart items + selected bumps)
    const paymentItems = [
      ...items.map((item) => ({
        title: item.product.name,
        unitPrice: Math.round(item.product.price * 100), // centavos
        quantity: item.quantity,
        tangible: true,
        externalRef: `product-${item.product.id}`,
      })),
      ...currentBumps
        .filter((b) => selectedBumps.has(b.id))
        .map((bump) => ({
          title: bump.name,
          unitPrice: Math.round(bump.price * 100),
          quantity: 1,
          tangible: true,
          externalRef: `bump-${bump.id}`,
        })),
    ];

    // Capturar UTM parameters da URL para enviar à UTMify
    const urlParams = new URLSearchParams(window.location.search);
    const trackingParams = {
      src: urlParams.get("src") || null,
      sck: urlParams.get("sck") || null,
      utm_source: urlParams.get("utm_source") || null,
      utm_campaign: urlParams.get("utm_campaign") || null,
      utm_medium: urlParams.get("utm_medium") || null,
      utm_content: urlParams.get("utm_content") || null,
      utm_term: urlParams.get("utm_term") || null,
    };

    createPixMutation.mutate({
      customer: {
        name: form.name,
        email: form.email,
        cpf: cpf,
        phone: form.phone,
        address: {
          street: form.street,
          streetNumber: form.number,
          complement: form.complement,
          zipCode: form.cep,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          country: "br",
        },
      },
      items: paymentItems,
      shippingFee: Math.round(shippingCost * 100),
      trackingParams,
    });
  };

  if (items.length === 0 && !createPixMutation.isSuccess) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Simplified header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/carrinho" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EE4D2D" }}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold" style={{ color: "#EE4D2D" }}>AchaShop</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-base font-semibold text-gray-700">Checkout</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            Ambiente Seguro
          </div>
        </div>
      </header>

      <main className="flex-1">
        <form onSubmit={handleSubmit}>
          <div className="container py-4 md:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Form */}
              <div className="lg:col-span-2 space-y-4">
                {/* Contact */}
                <div className="bg-white rounded-sm p-4 md:p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>1</span>
                    Informações de Contato
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.name ? "border-red-400" : "border-gray-200"}`}
                        placeholder="Seu nome completo"
                      />
                      {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">E-mail *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.email ? "border-red-400" : "border-gray-200"}`}
                        placeholder="seu@email.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">CPF *</label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => {
                          setCpf(e.target.value);
                          if (formErrors.cpf) {
                            setFormErrors((prev) => {
                              const next = { ...prev };
                              delete next.cpf;
                              return next;
                            });
                          }
                        }}
                        required
                        maxLength={14}
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.cpf ? "border-red-400" : "border-gray-200"}`}
                        placeholder="000.000.000-00"
                      />
                      {formErrors.cpf && <p className="text-red-500 text-[10px] mt-1">{formErrors.cpf}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.phone ? "border-red-400" : "border-gray-200"}`}
                        placeholder="(11) 99999-9999"
                      />
                      {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-sm p-4 md:p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>2</span>
                    Endereço de Entrega
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">CEP *</label>
                      <input
                        type="text"
                        name="cep"
                        value={form.cep}
                        onChange={handleChange}
                        onBlur={handleCepBlur}
                        required
                        maxLength={9}
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.cep ? "border-red-400" : "border-gray-200"}`}
                        placeholder="00000-000"
                      />
                      {formErrors.cep && <p className="text-red-500 text-[10px] mt-1">{formErrors.cep}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Rua *</label>
                      <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.street ? "border-red-400" : "border-gray-200"}`}
                        placeholder="Nome da rua"
                      />
                      {formErrors.street && <p className="text-red-500 text-[10px] mt-1">{formErrors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Número *</label>
                      <input
                        type="text"
                        name="number"
                        value={form.number}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.number ? "border-red-400" : "border-gray-200"}`}
                        placeholder="Nº"
                      />
                      {formErrors.number && <p className="text-red-500 text-[10px] mt-1">{formErrors.number}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Complemento</label>
                      <input
                        type="text"
                        name="complement"
                        value={form.complement}
                        onChange={handleChange}
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Apto, bloco..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Bairro *</label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={form.neighborhood}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.neighborhood ? "border-red-400" : "border-gray-200"}`}
                        placeholder="Bairro"
                      />
                      {formErrors.neighborhood && <p className="text-red-500 text-[10px] mt-1">{formErrors.neighborhood}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all ${formErrors.city ? "border-red-400" : "border-gray-200"}`}
                        placeholder="Cidade"
                      />
                      {formErrors.city && <p className="text-red-500 text-[10px] mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        maxLength={2}
                        className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all uppercase ${formErrors.state ? "border-red-400" : "border-gray-200"}`}
                        placeholder="UF"
                      />
                      {formErrors.state && <p className="text-red-500 text-[10px] mt-1">{formErrors.state}</p>}
                    </div>
                  </div>
                </div>

                {/* SHIPPING OPTIONS (only for products with custom shipping) */}
                {hasCustomShipping && (
                  <div className="bg-white rounded-sm p-4 md:p-6">
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5" style={{ color: "#EE4D2D" }} />
                      Opções de Frete
                    </h2>
                    <div className="space-y-2">
                      {customShippingOpts.map((opt, idx) => {
                        const isFree = opt.price === 0;
                        const isSelected = selectedShippingIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedShippingIdx(idx)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? isFree ? "border-green-500 bg-green-50" : "border-[#EE4D2D] bg-orange-50"
                                : "border-gray-200 hover:border-orange-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? (isFree ? "border-green-500" : "border-[#EE4D2D]") : "border-gray-300"
                              }`}>
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full" style={{ background: isFree ? "#22c55e" : "#EE4D2D" }} />
                                )}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${isFree ? "text-green-700" : "text-gray-800"}`}>
                                  {opt.label}
                                  {isFree && (
                                    <span className="ml-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-green-500">
                                      GRÁTIS
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">{opt.days}</p>
                              </div>
                            </div>
                            <span className={`text-sm font-extrabold ${isFree ? "text-green-600" : ""}`} style={!isFree ? { color: "#EE4D2D" } : {}}>
                              {isFree ? "R$ 0,00" : formatPrice(opt.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ORDER BUMP */}
                <div className="bg-white rounded-sm overflow-hidden border-2 border-dashed" style={{ borderColor: "#EE4D2D" }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #FF6633 100%)" }}>
                    <Flame className="w-5 h-5 text-white" />
                    <h2 className="text-sm font-extrabold text-white tracking-wide">
                      APROVEITE! ADICIONE AO SEU PEDIDO
                    </h2>
                    <Gift className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-500 mb-2">
                      {productIds.includes(21)
                        ? "Quem comprou a Roçadeira Nakasaki também levou estes itens essenciais com desconto exclusivo:"
                        : "Clientes que compraram ferramentas também levaram estes itens com desconto exclusivo:"}
                    </p>
                    {currentBumps.map((bump) => {
                      const isSelected = selectedBumps.has(bump.id);
                      return (
                        <button
                          key={bump.id}
                          type="button"
                          onClick={() => toggleBump(bump.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? "border-[#EE4D2D] bg-orange-50"
                              : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/30"
                          }`}
                        >
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "border-[#EE4D2D] bg-[#EE4D2D]"
                              : "border-gray-300"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>

                          {/* Image */}
                          <img
                            src={bump.image}
                            alt={bump.name}
                            className="w-14 h-14 rounded object-contain bg-gray-50 shrink-0 p-1"
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 line-clamp-1">{bump.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{bump.shortDescription}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(bump.originalPrice)}
                              </span>
                              <span className="text-sm font-extrabold" style={{ color: "#EE4D2D" }}>
                                {formatPrice(bump.price)}
                              </span>
                              <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ background: "#EE4D2D" }}>
                                -{bump.discount}%
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="bg-white rounded-sm p-5 sticky top-20">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>3</span>
                    Resumo do Pedido
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded object-contain bg-gray-50 shrink-0 p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-700 line-clamp-2">{item.product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Qtd: {item.quantity}</p>
                          <p className="text-sm font-bold mt-0.5" style={{ color: "#EE4D2D" }}>
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bump items in summary */}
                  {selectedBumps.size > 0 && (
                    <div className="border-t border-gray-100 pt-3 mb-3">
                      <p className="text-[10px] font-bold text-[#EE4D2D] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Itens adicionais
                      </p>
                      <div className="space-y-2">
                        {currentBumps
                          .filter((b) => selectedBumps.has(b.id))
                          .map((bump) => (
                            <div key={bump.id} className="flex justify-between text-xs">
                              <span className="text-gray-600 truncate mr-2">{bump.name}</span>
                              <span className="font-semibold text-gray-700 shrink-0">{formatPrice(bump.price)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {bumpTotal > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Itens adicionais</span>
                        <span>{formatPrice(bumpTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Frete
                        {hasCustomShipping && customShippingOpts[selectedShippingIdx] && (
                          <span className="text-[10px] text-gray-400 ml-1">
                            ({customShippingOpts[selectedShippingIdx].label})
                          </span>
                        )}
                      </span>
                      <span className={shippingCost === 0 ? "text-[#00BFA5] font-semibold" : ""}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {!hasCustomShipping && shippingCost > 0 && (
                      <p className="text-[10px] text-gray-400">
                        Frete grátis para compras acima de R$ 99,00
                      </p>
                    )}
                    {hasCustomShipping && customShippingOpts[selectedShippingIdx] && (
                      <p className="text-[10px] text-gray-400">
                        Entrega em {customShippingOpts[selectedShippingIdx].days}
                      </p>
                    )}
                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-xl font-extrabold" style={{ color: "#EE4D2D" }}>
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      ou 3x de {formatPrice(finalTotal / 3)} sem juros
                    </p>
                  </div>

                  {/* Payment method indicator */}
                  <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-sm font-bold text-green-700">Pagamento via PIX</span>
                    </div>
                    <p className="text-[10px] text-green-600">
                      Após finalizar, você receberá o QR Code PIX para pagamento instantâneo.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={createPixMutation.isPending}
                    className="w-full mt-5 py-3.5 rounded text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "#EE4D2D" }}
                  >
                    {createPixMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pagar com PIX — {formatPrice(finalTotal)}
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pagamento 100% seguro e criptografado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
