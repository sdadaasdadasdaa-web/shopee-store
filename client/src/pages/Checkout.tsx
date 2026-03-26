/*
 * Design: Bazaar Digital — Checkout completo com Imagens de Frete + Order Bumps + UTMify
 */
import { useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Lock, ChevronLeft, Check, Zap, Gift, Flame, Truck, Loader2, ShieldCheck, Star, Minus, Plus } from "lucide-react";
import { checkoutSuccessImage, getOrderBumpsForCart, shippingOptions, type ShippingOption } from "@/lib/data";
import UrgencyTimer from "@/components/UrgencyTimer";
import ScarcityBadge from "@/components/ScarcityBadge";
import { getUtmifyTrackingParams } from "@/components/UtmifyTracker";
import { getItemPrice } from "@/lib/pricing";
import ExitIntentPopup, { getAppliedCoupon, clearAppliedCoupon, type AppliedCoupon } from "@/components/ExitIntentPopup";
import WelcomeDiscountPopup from "@/components/WelcomeDiscountPopup";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart, updateQuantity } = useCart();
  const [, navigate] = useLocation();
  const [selectedBumps, setSelectedBumps] = useState<Set<number>>(new Set());
  const [bumpSizes, setBumpSizes] = useState<Record<number, string>>({}); 
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [cpf, setCpf] = useState("");

  const productIds = useMemo(() => items.map((i) => i.product.id), [items]);
  const currentBumps = useMemo(() => getOrderBumpsForCart(productIds), [productIds]);

  const hasCustomShipping = useMemo(() => productIds.some((id) => shippingOptions[id]), [productIds]);
  const customShippingOpts: ShippingOption[] = useMemo(() => {
    for (const id of productIds) {
      if (shippingOptions[id]) return shippingOptions[id];
    }
    return [];
  }, [productIds]);

  const [selectedShippingIdx, setSelectedShippingIdx] = useState(0);

  // LOGOS DOS FRETES (DE VOLTA!)
  const defaultShippingOpts = useMemo(() => [
    { label: "Correios", price: 0, days: "7 a 12 dias úteis", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/correios_614e42c9.png" },
    { label: "Sedex", price: 16.87, days: "4 a 7 dias úteis", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/sedex_3525a775.png" },
    { label: "Jadlog", price: 19.76, days: "3 a 6 dias úteis", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/jadlog_735e706a.png" },
  ], []);

  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    const alreadyShown = sessionStorage.getItem("exit_intent_shown");
    const alreadyApplied = localStorage.getItem("applied_coupon");
    return !alreadyShown && !alreadyApplied;
  });
  const [showExitPopup, setShowExitPopup] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "",
  });

  const bumpTotal = currentBumps.filter((b) => selectedBumps.has(b.id)).reduce((sum, b) => sum + b.price, 0);
  const activeShippingOpts = hasCustomShipping ? customShippingOpts : defaultShippingOpts;
  const shippingCost = activeShippingOpts[selectedShippingIdx]?.price ?? 0;

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => getAppliedCoupon());
  const couponDiscount = appliedCoupon ? Math.round(((totalPrice + bumpTotal) * appliedCoupon.discountPct) / 100 * 100) / 100 : 0;

  const handleCouponApply = useCallback((coupon: AppliedCoupon) => setAppliedCoupon(coupon), []);
  const finalTotal = totalPrice + bumpTotal + shippingCost - couponDiscount;

  const formatPrice = (p: number) => p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const maskCpf = (v: string) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  const maskCep = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "phone") val = maskPhone(value);
    else if (name === "cep") val = maskCep(value);
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleCepBlur = async () => {
    const cleanCep = form.cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) setForm(prev => ({ ...prev, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf }));
      } catch (e) {}
    }
  };

  const toggleBump = (id: number) => {
    setSelectedBumps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const createPixMutation = trpc.payment.createPix.useMutation({
    onSuccess: (data) => {
      if (data.pix) {
        localStorage.setItem(`pix_${data.transactionId}`, JSON.stringify({
          qrCode: data.pix.qrCode, qrCodeImageUrl: data.pix.qrCodeImageUrl, expirationDate: data.pix.expirationDate,
        }));
      }
      clearCart();
      clearAppliedCoupon();
      navigate(`/pagamento/${data.transactionId}`);
    },
    onError: (err) => alert("Erro ao gerar PIX: " + err.message)
  });

  const validateForm = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Obrigatório";
    if (!form.email.includes("@")) e.email = "E-mail inválido";
    if (cpf.length < 14) e.cpf = "CPF incompleto";
    if (form.cep.length < 9) e.cep = "CEP incompleto";
    if (!form.street) e.street = "Obrigatório";
    if (!form.number) e.number = "Obrigatório";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const paymentItems = [
      ...items.map(i => ({ title: i.product.name, unitPrice: Math.round(getItemPrice(i) * 100), quantity: i.quantity, tangible: true, externalRef: `p-${i.product.id}` })),
      ...currentBumps.filter(b => selectedBumps.has(b.id)).map(b => ({ title: b.name, unitPrice: Math.round(b.price * 100), quantity: 1, tangible: true, externalRef: `b-${b.id}` }))
    ];

    const trackingParams = getUtmifyTrackingParams();

    if ((window as any).utmify) {
      (window as any).utmify.send('checkout', {
        email: form.email, phone: form.phone, total: finalTotal, status: 'pending'
      });
    }

    createPixMutation.mutate({
      customer: { name: form.name, email: form.email, cpf, phone: form.phone, address: { ...form, zipCode: form.cep, streetNumber: form.number, country: "br" } },
      items: paymentItems,
      shippingFee: Math.round(shippingCost * 100),
      trackingParams
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center"><img src="/shopee.png" alt="Logo" className="h-7 w-auto" /></Link>
            <span className="text-gray-300">|</span><span className="text-base font-semibold">Checkout</span>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1"><Lock className="w-3 h-3"/> Ambiente Seguro</div>
        </div>
      </header>

      <main className="container py-4 md:py-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <UrgencyTimer variant="checkout" durationMinutes={30} />
            
            {/* 1. Dados Pessoais */}
            <div className="bg-white rounded-sm p-4 md:p-6 shadow-sm">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center bg-[#EE4D2D]">1</span>
                Dados de Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" name="name" placeholder="Nome Completo" value={form.name} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="cpf" placeholder="CPF" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="tel" name="phone" placeholder="WhatsApp" value={form.phone} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
              </div>
            </div>

            {/* 2. Endereço */}
            <div className="bg-white rounded-sm p-4 md:p-6 shadow-sm">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center bg-[#EE4D2D]">2</span>
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} onBlur={handleCepBlur} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="street" placeholder="Rua" value={form.street} onChange={handleChange} className="md:col-span-2 w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="number" placeholder="Número" value={form.number} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="neighborhood" placeholder="Bairro" value={form.neighborhood} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="city" placeholder="Cidade" value={form.city} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
                <input type="text" name="state" placeholder="UF" value={form.state} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm focus:border-[#EE4D2D] outline-none" required />
              </div>
            </div>

            {/* 3. Opções de Frete com IMAGENS (DE VOLTA!) */}
            <div className="bg-white rounded-sm p-4 md:p-6 shadow-sm">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#EE4D2D]" />
                Opções de Frete
              </h2>
              <div className="space-y-2">
                {activeShippingOpts.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedShippingIdx(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                      selectedShippingIdx === idx ? "border-[#EE4D2D] bg-orange-50" : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedShippingIdx === idx ? "border-[#EE4D2D]" : "border-gray-300"}`}>
                        {selectedShippingIdx === idx && <div className="w-2 h-2 rounded-full bg-[#EE4D2D]" />}
                      </div>
                      
                      {/* IMAGEM DO LOGO AQUI */}
                      {opt.logo && (
                        <img src={opt.logo} alt={opt.label} className="h-8 w-auto object-contain shrink-0" style={{ maxWidth: "70px" }} />
                      )}
                      
                      <div>
                        <p className={`text-sm font-bold ${opt.price === 0 ? "text-green-700" : "text-gray-800"}`}>{opt.label}</p>
                        <p className="text-[10px] text-gray-500">{opt.days}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold">{opt.price === 0 ? "Grátis" : formatPrice(opt.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ORDER BUMPS */}
            <div className="bg-white rounded-sm overflow-hidden border-2 border-dashed border-[#EE4D2D] shadow-sm">
              <div className="px-4 py-3 flex items-center gap-2 bg-gradient-to-r from-[#EE4D2D] to-[#FF6633]">
                <Flame className="w-5 h-5 text-white" /><h2 className="text-sm font-extrabold text-white uppercase">Aproveite! Adicione ao seu pedido</h2>
              </div>
              <div className="p-4 space-y-3">
                {currentBumps.map((bump) => (
                  <button key={bump.id} type="button" onClick={() => toggleBump(bump.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedBumps.has(bump.id) ? "border-[#EE4D2D] bg-orange-50" : "border-gray-200"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedBumps.has(bump.id) ? "bg-[#EE4D2D] border-[#EE4D2D]" : "border-gray-300"}`}>
                      {selectedBumps.has(