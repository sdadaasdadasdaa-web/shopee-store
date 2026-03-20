/*
 * Design: Bazaar Digital — Checkout simples com Order Bump
 * Formulário de dados, order bumps, resumo do pedido, CTA de finalização
 * Nicho: Ferramentas
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Lock, ChevronLeft, Check, Zap, Gift, Flame } from "lucide-react";
import { checkoutSuccessImage, orderBumpItems } from "@/lib/data";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<Set<number>>(new Set());

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

  const bumpTotal = orderBumpItems
    .filter((b) => selectedBumps.has(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const shippingCost = totalPrice + bumpTotal >= 99 ? 0 : 14.90;
  const finalTotal = totalPrice + bumpTotal + shippingCost;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    navigate("/");
    return null;
  }

  // Success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        <header className="bg-white border-b border-gray-100">
          <div className="container flex items-center gap-3 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EE4D2D" }}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold" style={{ color: "#EE4D2D" }}>AchaShop</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 md:p-12 text-center max-w-md w-full shadow-sm">
            <img
              src={checkoutSuccessImage}
              alt="Pedido confirmado"
              className="w-40 h-40 mx-auto mb-6 object-contain"
            />
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Pedido Confirmado!</h1>
            <p className="text-gray-500 mb-6">
              Seu pedido foi recebido com sucesso. Em breve você receberá um e-mail com os detalhes e o código de rastreamento.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded text-white font-bold text-sm"
              style={{ background: "#EE4D2D" }}
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
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
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">E-mail *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="(11) 99999-9999"
                      />
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
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Rua *</label>
                      <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Nome da rua"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Número *</label>
                      <input
                        type="text"
                        name="number"
                        value={form.number}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Nº"
                      />
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
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Bairro"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all"
                        placeholder="Cidade"
                      />
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
                        className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/30 transition-all uppercase"
                        placeholder="UF"
                      />
                    </div>
                  </div>
                </div>

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
                      Clientes que compraram ferramentas também levaram estes itens com desconto exclusivo:
                    </p>
                    {orderBumpItems.map((bump) => {
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
                        {orderBumpItems
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
                      <span>Frete</span>
                      <span className={shippingCost === 0 ? "text-[#00BFA5] font-semibold" : ""}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-[10px] text-gray-400">
                        Frete grátis para compras acima de R$ 99,00
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

                  <button
                    type="submit"
                    className="w-full mt-5 py-3.5 rounded text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: "#EE4D2D" }}
                  >
                    <Check className="w-4 h-4" />
                    Finalizar Compra
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
