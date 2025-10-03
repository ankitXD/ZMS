import React, { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "../store/useOrderStore.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

const PRICES = { adult: 20, child: 10, senior: 15 };

const todayISO = () => new Date().toISOString().slice(0, 10);

const BookTickets = () => {
  // State
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("morning");
  const [qty, setQty] = useState({ adult: 1, child: 0, senior: 0 });

  // Contact + payment
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi|card|cash

  // Validation errors
  const [errors, setErrors] = useState({});

  // Store (createOrder calls POST /orders)
  const { creating, createdOrder, createOrder } = useOrderStore();

  // Prefill from URL params if present
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get("date");
    if (d) setDate(d);
    const s = p.get("slot");
    if (s) setSlot(s);
    const a = p.get("adult");
    if (a) setQty((q) => ({ ...q, adult: Math.max(0, parseInt(a) || 0) }));
    const c = p.get("child");
    if (c) setQty((q) => ({ ...q, child: Math.max(0, parseInt(c) || 0) }));
    const se = p.get("senior");
    if (se) setQty((q) => ({ ...q, senior: Math.max(0, parseInt(se) || 0) }));
  }, []);

  // Calculations
  const subtotal = useMemo(
    () =>
      qty.adult * PRICES.adult +
      qty.child * PRICES.child +
      qty.senior * PRICES.senior,
    [qty]
  );
  const discount = useMemo(() => 0, []);  // Promo code functionality removed
  const total = Math.max(0, subtotal - discount);

  // Zod validation schemas
  const dateSchema = z.string().min(1, "Please select a visit date").refine(
    (date) => new Date(date) >= new Date(todayISO()),
    "Date cannot be in the past"
  );

  const nameSchema = z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters");
  
  const emailSchema = z.string().min(1, "Email is required").email("Please enter a valid email address");
  
  const phoneSchema = z.string().optional().refine(
    (phone) => !phone || /^\d{10}$/.test(phone),
    "Phone number must be 10 digits"
  );

  // Validation functions
  const validateField = (field, value) => {
    let result;
    switch (field) {
      case 'date':
        result = dateSchema.safeParse(value);
        break;
      case 'tickets':
        if (qty.adult + qty.child + qty.senior === 0) {
          return 'Please select at least one ticket';
        }
        return '';
      case 'name':
        result = nameSchema.safeParse(value);
        break;
      case 'email':
        result = emailSchema.safeParse(value);
        break;
      case 'phone':
        result = phoneSchema.safeParse(value);
        break;
      default:
        return '';
    }
    
    return result.success ? '' : result.error?.issues?.[0]?.message || 'Invalid input';
  };

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    const dateError = validateField('date', date);
    if (dateError) newErrors.date = dateError;
    
    const ticketsError = validateField('tickets');
    if (ticketsError) newErrors.tickets = ticketsError;
    
    const nameError = validateField('name', name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateField('email', email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validateField('phone', phone);
    if (phoneError) newErrors.phone = phoneError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateQty = (key, delta) => {
    setQty((q) => {
      const newQty = {
        ...q,
        [key]: Math.max(0, Math.min(10, (q[key] ?? 0) + delta)),
      };
      
      // Clear tickets error when quantity changes
      if (newQty.adult + newQty.child + newQty.senior > 0) {
        clearError('tickets');
      }
      
      return newQty;
    });
  };

  // Blur validation handlers
  const handleDateBlur = (e) => {
    const value = e.target.value;
    const error = validateField('date', value);
    if (error) {
      setErrors(prev => ({ ...prev, date: error }));
    } else {
      clearError('date');
    }
  };

  const handleNameBlur = (e) => {
    const value = e.target.value;
    const error = validateField('name', value);
    if (error) {
      setErrors(prev => ({ ...prev, name: error }));
    } else {
      clearError('name');
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value;
    const error = validateField('email', value);
    if (error) {
      setErrors(prev => ({ ...prev, email: error }));
    } else {
      clearError('email');
    }
  };

  const handlePhoneBlur = (e) => {
    const value = e.target.value;
    const error = validateField('phone', value);
    if (error) {
      setErrors(prev => ({ ...prev, phone: error }));
    } else {
      clearError('phone');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    const items = [];
    if (qty.adult > 0)
      items.push({
        ticketType: "adult",
        quantity: qty.adult,
        unitPrice: PRICES.adult,
      });
    if (qty.child > 0)
      items.push({
        ticketType: "child",
        quantity: qty.child,
        unitPrice: PRICES.child,
      });
    if (qty.senior > 0)
      items.push({
        ticketType: "senior",
        quantity: qty.senior,
        unitPrice: PRICES.senior,
      });

    const contact = { name, email, phone };

    // Include visitDate and visitSlot as required by backend
    const res = await createOrder({
      visitDate: date,
      visitSlot: slot,
      contact,
      items,
      paymentMethod,
      currency: "INR",
    });

    if (res?.ok) {
      toast.success("Order created. Proceed to payment.");
      // navigate(`/checkout?orderId=${res.data._id}`);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-white"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Book Your Tickets
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Secure your spot for a day of discovery at Zoo Verse—immersive
              habitats, keeper talks, and unforgettable wildlife moments for the
              whole family.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Timed Entry
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Family Pricing
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200 shadow-sm">
                ✓ Free Reschedule
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: Booking form */}
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                Your Visit
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={handleDateBlur}
                    required
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                      errors.date
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Time Slot
                  </span>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="morning">
                      Morning (9:00 AM – 12:00 PM)
                    </option>
                    <option value="afternoon">
                      Afternoon (12:00 PM – 3:00 PM)
                    </option>
                    <option value="evening">Evening (3:00 PM – 6:00 PM)</option>
                  </select>
                </label>

                {/* Tickets */}
                <div className="grid gap-3">
                  {["adult", "child", "senior"].map((k) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium capitalize text-slate-900">
                          {k}
                        </p>
                        <p className="text-sm text-slate-500">
                          ₹{PRICES[k]} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(k, -1)}
                          disabled={qty[k] === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                          aria-label={`Decrease ${k} tickets`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">
                          {qty[k]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(k, 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                          aria-label={`Increase ${k} tickets`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  {errors.tickets && (
                    <p className="text-sm text-red-600">{errors.tickets}</p>
                  )}
                </div>

                {/* Contact */}
                <div className="grid gap-3 border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Contact
                  </h3>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleNameBlur}
                      placeholder="Your name"
                      // required
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                      placeholder="you@example.com"
                      required
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Phone
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={handlePhoneBlur}
                      placeholder="9999999999"
                      maxLength={10} // limit to max 10 characters
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </label>
                </div>

                {/* Promo */}
                {/* <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Promo code
                  </span>
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Try ZOO10"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label> */}

                {/* Payment method */}
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Payment Method
                  </span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash (at counter)</option>
                  </select>
                </label>

                {/* Totals */}
                <div className="mt-2 grid gap-1 border-t border-slate-200 pt-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo (ZOO10)</span>
                      <span>−₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-slate-900 text-base mt-1">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:opacity-50"
                  disabled={
                    creating ||
                    !date ||
                    qty.adult + qty.child + qty.senior === 0 ||
                    !name ||
                    !email
                  }
                >
                  {creating ? "Creating order..." : "Proceed to Checkout"}
                </button>
                <p className="text-xs text-slate-500">
                  Your order will be created as pending. Tickets are issued
                  after payment.
                </p>
              </div>

              {/* Confirmation */}
              {createdOrder && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="text-sm">
                    Order created:{" "}
                    <span className="font-mono">{createdOrder._id}</span>
                  </p>
                  <p className="text-xs mt-1">
                    Visit: {createdOrder.visitDate} • {createdOrder.visitSlot}
                  </p>
                  <p className="text-xs mt-1">
                    Next: complete payment to receive your QR tickets.
                  </p>
                </div>
              )}
            </form>

            {/* Right: Persuasive panel */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 p-6 text-white shadow-md">
                <h3 className="text-xl font-bold">Make it a day to remember</h3>
                <p className="mt-2 text-white/95">
                  From playful otters to majestic tigers, explore habitats
                  designed for animal welfare and unforgettable visitor
                  experiences.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Keeper talks and feedings daily
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Family amenities and stroller-friendly paths
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Free reschedule up to 24 hours before your visit
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Need help?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Questions about accessibility, group bookings, or events?
                </p>
                <Link
                  to="/contact"
                  className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookTickets;
