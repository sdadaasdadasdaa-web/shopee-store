/*
 * Design: Bazaar Digital — Checkout simples com Order Bump dinâmico + Pagamento Sigilo Pay PIX
 * Formulário de dados, order bumps contextuais, opções de frete, resumo do pedido
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

  const defaultShippingOpts = useMemo(() => [
    {
      label: "Correios",
      price: 0,
      days: "7 a 12 dias úteis",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/correios_614e42c9.png",
    },
    {
      label: "Sedex",
      price: 16.87,
      days: "4 a 7 dias úteis",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/sedex_3525a775.png",
    },
    {
      label: "Jadlog",
      price: 19.76,
      days: "3 a 6 dias úteis",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663285681492/T9MpEVnAhq2PrGidiTemVi/jadlog_735e706a.png",
    },
  ], []);

  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    const alreadyShown = sessionStorage.getItem("exit_intent_shown");
    const alreadyApplied = localStorage.getItem("applied_coupon");
    return !alreadyShown && !alreadyApplied;
  });
  const [showExitPopup, setShowExitPopup] = useState(false);

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

  const activeShippingOpts = hasCustomShipping ? customShippingOpts : defaultShippingOpts;
  const shippingCost = activeShippingOpts[selectedShippingIdx]?.price ?? 0;

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => getAppliedCoupon());
  const couponDiscount = appliedCoupon
    ? Math.round(((totalPrice + bumpTotal) * appliedCoupon.discountPct) / 100 * 100) / 100
    : 0;

  const handleCouponApply = useCallback((coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const finalTotal = totalPrice + bumpTotal + shippingCost - couponDiscount;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const maskCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const maskCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "phone") maskedValue = maskPhone(value);
    else if (name === "cep") maskedValue = maskCep(value);
    setForm((prev) => ({ ...prev, [name]: maskedValue }));
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
      } catch { /* ignore */ }
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

  const createPixMutation = trpc.payment.createPix.useMutation({
    onSuccess: (data) => {
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
      clearAppliedCoupon();
      navigate(`/pagamento/${data.transactionId}`);
    },
    onError: (error) => {
      const msg = error.message;
      if (msg.includes("CPF")) {
        setFormErrors((prev) => ({ ...prev, cpf: "CPF inválido. Verifique e tente novamente." }));
      } else {
        alert("Ocorreu um erro ao gerar o PIX. Por favor, tente novamente.");
      }
    },
  });

  const isValidCpf = (raw: string): boolean => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(digits[10]);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Nome é obrigatório";
    if (!form.email.trim() || !form.email.includes("@")) errors.email = "E-mail inválido";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone inválido";
    if (!cpf.trim() || !isValidCpf(cpf)) errors.cpf = "CPF inválido";
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
    if (!validateForm()) {
      const fieldOrder = ["name", "email", "phone", "cpf", "cep", "street", "number", "neighborhood", "city", "state"];
      const firstError = fieldOrder.find((f) => {
        if (f === "cpf") return !cpf.trim() || !isValidCpf(cpf);
        return !(form as any)[f].trim();
      });
      if (firstError) {
        const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const paymentItems = [
      ...items.map((item) => ({
        title: item.product.name,
        unitPrice: Math.round(getItemPrice(item) * 100),
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

    if (couponDiscount > 0 && appliedCoupon) {
      paymentItems.push({
        title: `Cupom ${appliedCoupon.code} (-${appliedCoupon.discountPct}%)`,
        unitPrice: -Math.round(couponDiscount * 100),
        quantity: 1,
        tangible: false,
        externalRef: `coupon-${appliedCoupon.code}`,
      });
    }

    // 1. Capturar parâmetros (Incluindo XCOD do UtmifyTracker atualizado)
    const trackingParams = getUtmifyTrackingParams();

    // 2. DISPARO MANUAL DO PIXEL UTMIFY (Resolve atribuição e status pendente)
    if ((window as any).utmify) {
      (window as any).utmify.send('checkout', {
        email: form.email,
        phone: form.phone,
        firstname: form.name.split(' ')[0],
        lastname: form.name.split(' ').slice(1).join(' '),
        total: finalTotal,
        product_id: productIds.length > 0 ? productIds[0] : null,
        product_name: items.length > 0 ? items[0].product.name : 'Vários Produtos',
        status: 'pending' 
      });
    }

    // 3. Gerar PIX no servidor
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
      trackingParams, // Agora contém o xcod necessário
    });
  };

  if (items.length === 0 && !createPixMutation.isSuccess) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const alreadyShown = sessionStorage.getItem("exit_intent_shown");
                if (!alreadyShown) {
                  setShowExitPopup(true);
                  sessionStorage.setItem("exit_intent_shown", "1");
                } else {
                  window.history.back();
                }
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center">
              <img src="/shopee.png" alt="Logo" className="h-7 md:h-8 w-auto object-contain" />
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-base font-semibold text-gray-700">Checkout</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" /> Ambiente Seguro
          </div>
        </div>
      </header>

      <main className="flex-1">
        <form onSubmit={handleSubmit}>
          <div className="container py-4 md:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <UrgencyTimer variant="checkout" durationMinutes={30} />
                <div className="bg-white rounded-sm p-4 md:p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>1</span>
                    Informações de Contato
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nome Completo *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] ${formErrors.name ? "border-red-400" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">E-mail *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] ${formErrors.email ? "border-red-400" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">CPF *</label>
                      <input type="text" name="cpf" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} required className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] ${formErrors.cpf ? "border-red-400" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Telefone *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={`w-full h-11 px-3 border rounded text-sm focus:outline-none focus:border-[#EE4D2D] ${formErrors.phone ? "border-red-400" : "border-gray-200"}`} />
                    </div>
                  </div>
                </div>

                {/* Morada */}
                <div className="bg-white rounded-sm p-4 md:p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>2</span>
                    Endereço de Entrega
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} onBlur={handleCepBlur} className="w-full h-11 px-3 border border-gray-200 rounded text-sm" />
                    <input type="text" name="street" placeholder="Rua" value={form.street} onChange={handleChange} className="md:col-span-2 w-full h-11 px-3 border border-gray-200 rounded text-sm" />
                    <input type="text" name="number" placeholder="Nº" value={form.number} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm" />
                    <input type="text" name="neighborhood" placeholder="Bairro" value={form.neighborhood} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm" />
                    <input type="text" name="city" placeholder="Cidade" value={form.city} onChange={handleChange} className="w-full h-11 px-3 border border-gray-200 rounded text-sm" />
                  </div>
                </div>

                {/* Frete */}
                <div className="bg-white rounded-sm p-4 md:p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#EE4D2D]" /> Opções de Frete
                  </h2>
                  <div className="space-y-2">
                    {activeShippingOpts.map((opt, idx) => (
                      <button key={idx} type="button" onClick={() => setSelectedShippingIdx(idx)} className={`w-full flex items-center justify-between p-3 rounded-lg border-2 ${selectedShippingIdx === idx ? "border-[#EE4D2D] bg-orange-50" : "border-gray-200"}`}>
                        <span className="text-sm font-bold">{opt.label}</span>
                        <span className="text-sm font-extrabold">{opt.price === 0 ? "Grátis" : formatPrice(opt.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumo */}
              <div>
                <div className="bg-white rounded-sm p-5 sticky top-20 shadow-sm">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#EE4D2D" }}>3</span>
                    Resumo do Pedido
                  </h3>
                  <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Total</span>
                      <span className="text-xl font-extrabold text-[#EE4D2D]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <button type="submit" disabled={createPixMutation.isPending} className="w-full mt-5 py-3.5 rounded text-white font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#EE4D2D" }}>
                    {createPixMutation.isPending ? <Loader2 className="animate-spin" /> : "Finalizar Pagamento PIX"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {showWelcomePopup && (
        <WelcomeDiscountPopup onApply={(c) => { handleCouponApply(c); setShowWelcomePopup(false); }} onClose={() => setShowWelcomePopup(false)} />
      )}
      {!showWelcomePopup && (
        <ExitIntentPopup enabled={true} forceShow={showExitPopup} onApply={handleCouponApply} onClose={() => setShowExitPopup(false)} />
      )}
    </div>
  );
}