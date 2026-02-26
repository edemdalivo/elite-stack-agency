'use client'
import { useState } from 'react'
import PaymentButton from '@/components/PaymentButton' // Ton bouton FedaPay actuel
import { Check, ArrowLeft, Globe, CreditCard, Smartphone } from 'lucide-react'
import Link from 'next/link'

// --- 1. CONFIGURATION DU CONTENU (FR/EN) ---
const CONTENT = {
  fr: {
    back: "Retour à l'accueil",
    title: "Nos Solutions Business",
    subtitle: "Propulsez votre entreprise avec l'Elite Stack",
    customTitle: "Besoin d'un projet sur mesure ?",
    customDesc: "Vous avez des besoins spécifiques qui ne rentrent pas dans nos packs ? Discutons-en directement.",
    customBtn: "Nous contacter pour un devis",
    currency: "F CFA",
    payCard: "Payer par Carte",
    payMobile: "Mobile Money",
    packages: [
      {
        name: 'Pack Bronze',
        price: '150 000',
        // REMPLACE par ton lien Stripe pour 150.000 FCFA
        stripeUrl: 'https://buy.stripe.com/test_3cI6oGdyO01Gb4O4dNew802', 
        description: 'Idéal pour les artisans et indépendants.',
        features: ['Site Vitrine 1 page', 'Formulaire de contact', 'Hébergement 1 an', 'Support Email'],
        color: 'border-white/10'
      },
      {
        name: 'Pack Argent',
        price: '450 000',
        // REMPLACE par ton lien Stripe pour 450.000 FCFA
        stripeUrl: 'https://buy.stripe.com/test_6oU5kCfGWdSw4Gq39Jew801',
        description: 'Le choix des PME pour une gestion pro.',
        features: ['Site Multi-pages', 'Dashboard Admin sécurisé', 'Base de données prospects', 'Formation gestion'],
        color: 'border-blue-500/50 shadow-blue-500/10 shadow-xl'
      },
      {
        name: 'Pack Elite',
        price: '800 000',
        // Ton lien actuel pour le pack Elite
        stripeUrl: 'https://buy.stripe.com/test_00w8wO3Yeg0Eb4O25Few803',
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
    payCard: "Pay by Card",
    payMobile: "Mobile Money",
    packages: [
      {
        name: 'Bronze Pack',
        price: '150 000',
        stripeUrl: 'https://buy.stripe.com/test_3cI6oGdyO01Gb4O4dNew802',
        description: 'Perfect for freelancers and small shops.',
        features: ['1-Page Showcase Site', 'Contact Form', '1-Year Hosting', 'Email Support'],
        color: 'border-white/10'
      },
      {
        name: 'Silver Pack',
        price: '450 000',
        stripeUrl: 'https://buy.stripe.com/test_6oU5kCfGWdSw4Gq39Jew801',
        description: 'The choice for SMEs wanting pro management.',
        features: ['Multi-page Website', 'Secure Admin Dashboard', 'Leads Database', 'Management Training'],
        color: 'border-blue-500/50 shadow-blue-500/10 shadow-xl'
      },
      {
        name: 'Elite Pack',
        price: '800 000',
        stripeUrl: 'https://buy.stripe.com/test_00w8wO3Yeg0Eb4O25Few803',
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
    <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
      
      {/* --- BOUTON DE LANGUE --- */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all font-bold text-xs backdrop-blur-md flex items-center gap-2"
        >
          <Globe size={14} className="text-blue-500" />
          {lang === 'fr' ? 'English' : 'Français'}
        </button>
      </div>

      {/* --- RETOUR ACCUEIL --- */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link href="/" className="text-gray-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={16} /> {t.back}
        </Link>
      </div>

      {/* --- ENTÊTE --- */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium">{t.subtitle}</p>
      </div>

      {/* --- GRILLE DES PACKS --- */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {t.packages.map((pkg, index) => (
          <div 
            key={index} 
            className={`bg-[#0A0A0A] border ${pkg.color} p-8 rounded-[2.5rem] flex flex-col transition-all hover:translate-y-[-10px] duration-300`}
          >
            {/* Nom et Description */}
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-blue-500">{pkg.name}</h3>
            <p className="text-gray-500 text-[11px] mb-6 font-bold uppercase tracking-widest leading-tight">{pkg.description}</p>
            
            {/* Prix */}
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-black tracking-tighter">{pkg.price}</span>
              <span className="text-gray-600 ml-2 font-bold text-xs uppercase tracking-widest">{t.currency}</span>
            </div>

            {/* Liste des fonctionnalités */}
            <ul className="space-y-4 mb-10 flex-grow">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-300 text-sm font-medium">
                  <div className="mr-3 bg-blue-500/10 p-1 rounded-full">
                    <Check className="text-blue-500 w-3 h-3" />
                  </div> 
                  {feature}
                </li>
              ))}
            </ul>

            {/* --- ZONE DE PAIEMENT HYBRIDE --- */}
            <div className="space-y-3 pt-6 border-t border-white/5">
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] text-center mb-2">Options de paiement sécurisé</p>
              
              <div className="grid grid-cols-1 gap-3">
                {/* 1. Bouton FedaPay (Mobile Money) */}
                {/* On retire les espaces du prix pour l'API (ex: "150 000" devient "150000") */}
                <div className="relative group">
                  <PaymentButton amount={pkg.price.replace(/\s/g, '')} packageName={pkg.name} />
                </div>
                
                {/* 2. Bouton Stripe (Carte Bancaire) */}
                <a 
                  href={pkg.stripeUrl} 
                  target="_blank"
                  className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 transition-all text-[10px] uppercase tracking-widest group"
                >
                  <CreditCard size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  {t.payCard}
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* --- SECTION SUR MESURE --- */}
      <div className="max-w-2xl mx-auto text-center bg-[#0A0A0A] border border-dashed border-white/20 p-10 rounded-[3rem]">
        <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t.customTitle}</h2>
        <p className="text-gray-500 mb-8 font-medium text-sm">{t.customDesc}</p>
        <Link href="/#contact" className="inline-block bg-white text-black font-black px-10 py-5 rounded-2xl hover:scale-105 transition-all uppercase text-xs tracking-[0.2em]">
          {t.customBtn}
        </Link>
      </div>

    </div>
  )
}