'use client';
import { useState } from 'react';

export default function HomePage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  const content = {
    fr: {
      hero: { title: "Elite Digital Solutions", desc: "Expert TypeScript & IA basé au Togo." },
      services: [
        { title: "Pack Starter", price: "50 000 F", desc: "Logo + Landing Page simple." },
        { title: "Visibilité Express", price: "100 000 F", desc: "Branding + Site Mobile First." },
        { title: "Site Vitrine Premium", price: "300 000 F", desc: "Site ultra-rapide & SEO Pro." }
      ],
      cta: "Commander via WhatsApp",
      switch: "English"
    },
    en: {
      hero: { title: "Elite Digital Solutions", desc: "TypeScript & AI Expert based in Togo." },
      services: [
        { title: "Starter Pack", price: "$400", desc: "Logo + Simple Landing Page." },
        { title: "Express Visibility", price: "$800", desc: "Branding + Mobile First Site." },
        { title: "Premium Showcase Website", price: "$1,500", desc: "Ultra-fast site & Pro SEO." }
      ],
      cta: "Order via WhatsApp",
      switch: "Français"
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* BOUTON LANGUE */}
      <div className="flex justify-end">
        <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="border border-neutral-800 px-4 py-2 rounded-full text-sm">
          {content[lang].switch}
        </button>
      </div>

      {/* SECTION HERO */}
      <div className="py-20 text-center">
        <h1 className="text-6xl font-black mb-4">{content[lang].hero.title}</h1>
        <p className="text-neutral-500 text-xl mb-10">{content[lang].hero.desc}</p>
        {/* BARRE DES TECHNOLOGIES - Preuve d'expertise */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="font-bold tracking-widest text-sm">NEXT.JS 15</span>
          <span className="font-bold tracking-widest text-sm">TYPESCRIPT</span>
          <span className="font-bold tracking-widest text-sm">TAILWIND CSS</span>
          <span className="font-bold tracking-widest text-sm">SUPABASE</span>
        </div>
        <a href="https://wa.me/+22893591643" className="bg-blue-600 px-10 py-4 rounded-2xl font-bold text-lg">
          {content[lang].cta}
        </a>
      </div>

      {/* SECTION SERVICES (GRILLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
        {content[lang].services.map((service, index) => (
          <div key={index} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl hover:border-blue-500 transition-all group">
            <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
            <div className="text-blue-500 text-3xl font-black mb-4">{service.price}</div>
            <p className="text-neutral-400">{service.desc}</p>
            <div className="mt-6 text-sm text-neutral-600 group-hover:text-blue-400 transition-colors">
              {lang === 'fr' ? "En savoir plus →" : "Learn more →"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}