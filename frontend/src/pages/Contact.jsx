import React, { useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import toast from "react-hot-toast";
import { z } from "zod";

const Contact = () => {
  const { submitMessage, submitting, submitSuccess } = useMessageStore();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  // Zod validation schemas
  const nameSchema = z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters");
  
  const emailSchema = z.string().min(1, "Email is required").email("Please enter a valid email address");
  
  const subjectSchema = z.string(); // Subject is optional
  
  const messageSchema = z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters");

  // Validation functions
  const validateField = (field, value) => {
    let result;
    switch (field) {
      case 'name':
        result = nameSchema.safeParse(value);
        break;
      case 'email':
        result = emailSchema.safeParse(value);
        break;
      case 'subject':
        result = subjectSchema.safeParse(value);
        break;
      case 'message':
        result = messageSchema.safeParse(value);
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
    
    const nameError = validateField('name', name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateField('email', email);
    if (emailError) newErrors.email = emailError;
    
    const messageError = validateField('message', message);
    if (messageError) newErrors.message = messageError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Blur validation handlers
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

  const handleMessageBlur = (e) => {
    const value = e.target.value;
    const error = validateField('message', value);
    if (error) {
      setErrors(prev => ({ ...prev, message: error }));
    } else {
      clearError('message');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    const payload = {
      name,
      email,
      subject,
      message,
    };
    const res = await submitMessage(payload);
    if (res?.ok) {
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
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
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Contact Us
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
            Questions, feedback, or planning a group visit? We’d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            {/* Left: Contact details */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Get in touch
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Our team is here to help with tickets, memberships,
                accessibility, and events.
              </p>

              <ul className="mt-6 space-y-4 text-slate-700">
                <li>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Address
                  </p>
                  <p className="mt-1">123 Safari Lane, Green Park</p>
                </li>
                <li>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <a
                    className="mt-1 inline-block text-emerald-700 hover:text-emerald-800"
                    href="tel:+10000000000"
                  >
                    +1 (000) 000-0000
                  </a>
                </li>
                <li>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <a
                    className="mt-1 inline-block text-emerald-700 hover:text-emerald-800"
                    href="mailto:hello@zooverse.example"
                  >
                    hello@zooverse.example
                  </a>
                </li>
                <li>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Hours
                  </p>
                  <p className="mt-1">Open daily: 9:00 AM – 6:00 PM</p>
                </li>
              </ul>

              {/* Optional mini map placeholder */}
              {/* <div className="mt-8 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 p-6 text-slate-600">
                <p className="text-sm">
                  Map placeholder — add an embed here if needed.
                </p>
              </div> */}
            </div>

            {/* Right: Contact form */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Send us a message
              </h2>
              <form onSubmit={onSubmit} className="mt-4 grid gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    // required
                    placeholder="Your name"
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
                    // required
                    placeholder="you@example.com"
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
                    Subject
                  </span>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (optional)"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Message
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={handleMessageBlur}
                    rows="5"
                    // required
                    placeholder="How can we help?"
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                {submitSuccess && (
                  <p className="text-sm text-emerald-700">
                    Thanks! We’ll get back to you soon.
                  </p>
                )}

                <p className="text-xs text-slate-500">
                  We usually reply within 1–2 business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
