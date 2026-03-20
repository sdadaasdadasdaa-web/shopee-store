/*
 * Design: Bazaar Digital — Checkout simples e sem distrações
 * Formulário de dados, resumo do pedido, CTA de finalização
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Lock, ChevronLeft, Check } from "lucide-react";
import { checkoutSuccessImage } from "@/lib/data";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const shippingCost = totalPrice >= 99 ? 0 : 14.90;
  const finalTotal = totalPrice + shippingCost;

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
        {/* Simplified header */}
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
              Seu pedido foi recebido com sucesso. Em breve você receberá um e-mail com os detalhes.
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
              </div>

              {/* Order summary */}
              <div>
                <div className="bg-white rounded-sm p-5 sticky top-20">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>3</span>
                    Resumo do Pedido
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 max-h-[240px] overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded object-cover shrink-0"
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

                  <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frete</span>
                      <span className={shippingCost === 0 ? "text-[#00BFA5] font-semibold" : ""}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-xl font-extrabold" style={{ color: "#EE4D2D" }}>
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
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
