'use client'
import { useState } from 'react'
import PaymentButton from '@/components/PaymentButton'
import { Check, ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'

// 1. DICTIONNAIRE DE TRADUCTION
const CONTENT = {
  fr: {
    back: "Retour à l'accueil",
    title: "Nos Solutions Business",
    subtitle: "Propulsez votre entreprise au Togo avec l'Elite Stack 2026.",
    customTitle: "Besoin d'un projet sur mesure ?",
    customDesc: "Vous avez des besoins spécifiques qui ne rentrent pas dans nos packs ? Discutons-en directement.",
    customBtn: "Nous contacter pour un devis",
    currency: "F CFA",
    packages: [
      {
        name: 'Pack Bronze',
        price: '150 000',
        description: 'Idéal pour les artisans et indépendants.',
        features: ['Site Vitrine 1 page', 'Formulaire de contact', 'Hébergement 1 an', 'Support Email'],
        color: 'border-white/10'
      },
      {
        name: 'Pack Argent',
        price: '450 000',
        description: 'Le choix des PME pour une gestion pro.',
        features: ['Site Multi-pages', 'Dashboard Admin sécurisé', 'Base de données prospects', 'Formation gestion'],
        color: 'border-blue-500/50 shadow-blue-500/10 shadow-xl'
      },
      {
        name: 'Pack Elite',
        price: '800 000',
        description: 'Solution complète avec paiement intégré.',
        features: ['E-commerce complet', 'Paiement T-Money / Flooz', 'Gestion de stocks', 'Accès Premium 24/7'],
        color: 'border-blue-600 shadow-blue-600/20 shadow-2xl'
      }
    ]
  },
  en: {
    back: "Back to Home",
    title: "Our Business Solutions",
    subtitle: "Power up your business in Togo with the 2026 Elite Stack.",
    customTitle: "Need a custom project?",
    customDesc: "Have specific requirements that don't fit our packages? Let's discuss it directly.",
    customBtn: "Contact us for a quote",
    currency: "XOF",
    packages: [
      {
        name: 'Bronze Pack',
        price: '150 000',
        description: 'Perfect for freelancers and small shops.',
        features: ['1-Page Showcase Site', 'Contact Form', '1-Year Hosting', 'Email Support'],
        color: 'border-white/10'
      },
      {
        name: 'Silver Pack',
        price: '450 000',
        description: 'The choice for SMEs wanting pro management.',
        features: ['Multi-page Website', 'Secure Admin Dashboard', 'Leads Database', 'Management Training'],
        color: 'border-blue-500/50 shadow-blue-500/10 shadow-xl'
      },
      {
        name: 'Elite Pack',
        price: '800 000',
        description: 'Complete solution with integrated payment.',
        features: ['Full E-commerce', 'T-Money / Flooz Payment', 'Inventory Management', '24/7 Premium Access'],
        color: 'border-blue-600 shadow-blue-600/20 shadow-2xl'
      }
    ]
  }
}

export default function ServicesPage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const t = CONTENT[lang]

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      
      {/* BOUTON DE LANGUE FLOTTANT */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all font-bold text-xs backdrop-blur-md flex items-center gap-2"
        >
          <Globe size={14} />
          {lang === 'fr' ? 'English' : 'Français'}
        </button>
      </div>

      {/* Bouton retour Accueil */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link href="/" className="text-gray-500 hover:text-white transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> {t.back}
        </Link>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">{t.title}</h1>
        <p className="text-gray-400 text-xl">{t.subtitle}</p>
      </div>

      {/* GRILLE DES PACKS */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {t.packages.map((pkg, index) => (
          <div key={index} className={`bg-[#0A0A0A] border ${pkg.color} p-8 rounded-3xl flex flex-col transition-all hover:scale-105`}>
            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-tight">{pkg.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-black">{pkg.price}</span>
              <span className="text-gray-500 ml-2">{t.currency}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-300 text-sm">
                  <Check className="text-blue-500 mr-3 w-4 h-4" /> {feature}
                </li>
              ))}
            </ul>
            <PaymentButton amount={pkg.price} packageName={pkg.name} />
          </div>
        ))}
      </div>

      {/* SECTION CONTACT SUR MESURE */}
      <div className="max-w-2xl mx-auto text-center bg-[#0A0A0A] border border-dashed border-white/20 p-10 rounded-[2.5rem]">
        <h2 className="text-2xl font-bold mb-4">{t.customTitle}</h2>
        <p className="text-gray-500 mb-8">{t.customDesc}</p>
        <Link href="/#contact" className="inline-block bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all uppercase text-sm tracking-widest">
          {t.customBtn}
        </Link>
      </div>
    </div>
  )
}