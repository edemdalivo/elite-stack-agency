'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import Link from 'next/link'

// ==========================================
// 1. DICTIONNAIRE DE TRADUCTION
// ==========================================
const TRANSLATIONS = {
  fr: {
    sub: "Disponible pour vos projets internationaux",
    heroSub: "Propulsez votre vision digitale vers de nouveaux sommets avec une expertise Full-Stack.",
    ctaServices: "Cliquez ici pour voir nos tarifs et packs", // Texte mis à jour
    contactIntro: "Vous avez un besoin spécifique ? Décrivez-nous votre vision ci-dessous.", // Nouvelle phrase
    contactTitle: "Démarrons votre projet",
    name: "Nom complet",
    email: "Email professionnel",
    msg: "Votre message",
    btn: "Propulser mon projet",
    sending: "Envoi en cours...",
    success: "Message reçu ! Elite Stack Agency vous recontactera.",
    services: [
      { title: "Développement Full-Stack", desc: "Applications web sur mesure avec Next.js et bases de données temps réel.", icon: "🚀" },
      { title: "UI/UX Design", desc: "Interfaces modernes et intuitives pour une expérience utilisateur exceptionnelle.", icon: "🎨" },
      { title: "Solutions Cloud", desc: "Hébergement haute performance avec Vercel et Supabase.", icon: "☁️" }
    ]
  },
  en: {
    sub: "Available for global projects",
    heroSub: "Engineering world-class digital experiences for ambitious brands.",
    ctaServices: "Click here to view our pricing and packs", // Updated text
    contactIntro: "Have a specific need? Describe your vision below.", // New sentence
    contactTitle: "Let's Build Your Project",
    name: "Full Name",
    email: "Business Email",
    msg: "Project Details",
    btn: "Launch Project",
    sending: "Sending...",
    success: "Message received! Elite Stack Agency will contact you.",
    services: [
      { title: "Full-Stack Development", desc: "Custom web applications built with Next.js and real-time databases.", icon: "🚀" },
      { title: "UI/UX Design", desc: "Modern and intuitive interfaces for an exceptional user experience.", icon: "🎨" },
      { title: "Cloud Solutions", desc: "High-performance hosting with Vercel and Supabase.", icon: "☁️" }
    ]
  }
}

export default function AgencyPage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null)

  const t = TRANSLATIONS[lang];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 🛡️ SÉCURITÉ : Honeypot (Anti-Robot)
    const botTrap = formData.get('fax_number');
    if (botTrap) {
      setStatus({ type: 'success', msg: t.success });
      form.reset();
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const content = formData.get('message') as string;

    const { error: supabaseError } = await supabase.from('messages').insert([{ name, email, content }]);

    if (supabaseError) {
      setIsSubmitting(false);
      setStatus({ type: 'error', msg: "Error: " + supabaseError.message });
      return;
    }

    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content }),
      });
    } catch (err) { console.error("Email notification failed", err); }

    setIsSubmitting(false);
    setStatus({ type: 'success', msg: t.success });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      
      {/* BOUTON LANGUE */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all font-bold text-xs backdrop-blur-md flex items-center gap-2"
        >
          {lang === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer au Français'}
        </button>
      </div>

      {/* 1. HERO SECTION (Sans le bouton maintenant) */}
      <header className="max-w-6xl mx-auto text-center pt-32 pb-20 px-6">
        <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
          {t.sub}
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Elite Stack Agency
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">{t.heroSub}</p>
      </header>

      {/* 2. SERVICES SECTION + BOUTON TARIFS (Placé après les services) */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {t.services.map((s, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* LE BOUTON VERS LES SERVICES ICI */}
        <div className="text-center">
          <Link href="/services" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-sm">
            {t.ctaServices} →
          </Link>
        </div>
      </section>

      {/* 3. FORMULAIRE DE CONTACT AVEC INTRODUCTION */}
      <div id="contact" className="max-w-xl mx-auto px-6 pb-32">
        {/* Phrase d'introduction demandée */}
        <p className="text-center text-gray-500 mb-8 font-medium">
          {t.contactIntro}
        </p>

        <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 tracking-tight">{t.contactTitle}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">{t.name}</label>
              <input name="name" type="text" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:border-blue-500/50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">{t.email}</label>
              <input name="email" type="email" required className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:border-blue-500/50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">{t.msg}</label>
              <textarea name="message" required rows={4} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:border-blue-500/50 outline-none transition-all resize-none" />
            </div>

            {/* 🛡️ PIÈGE ANTI-SPAM (Honeypot toujours présent) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="fax_number" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 font-bold py-5 rounded-2xl transition-all shadow-xl shadow-white/5">
              {isSubmitting ? t.sending : t.btn}
            </button>

            {status && (
              <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {status.msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}