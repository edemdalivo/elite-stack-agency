'use client'

import { useState, useEffect } from 'react'

export default function PaymentButton({ amount, packageName }: { amount: string, packageName: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Chargement sécurisé du script au démarrage de la page
    const script = document.createElement('script');
    script.src = "https://cdn.fedapay.com/checkout.js?v=1.1.7";
    script.async = true;
    script.onload = () => setLoading(false); // Le bouton s'active quand le script est prêt
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="fedapay"]');
      if (existingScript) document.body.removeChild(existingScript);
    }
  }, []);

  const handlePayment = () => {
    const cleanAmount = parseInt(amount.replace(/\s/g, ''));

    // 2. Utilisation de la méthode universelle d'initialisation
    if (window.FedaPay) {
      const widget = window.FedaPay.init({
        public_key: 'pk_sandbox_RlwO8l2n65YYSDDsSRnujMgl', // Ta clé détectée sur tes captures
        transaction: {
          amount: cleanAmount,
          description: `Paiement ${packageName} - Elite Stack Agency`
        },
        customer: {
          // On laisse vide ou on demande à FedaPay de s'en charger
          email: '', 
          lastname: '',
          firstname: ''
        }
      });
      widget.open();
    } else {
      alert("Le système de paiement se prépare... Recliquez dans 1 seconde !");
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-sm transition-all ${
        loading 
        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 text-white hover:bg-white hover:text-black shadow-lg shadow-blue-500/20'
      }`}
    >
      {loading ? 'Chargement...' : `Payer ${amount} F CFA`}
    </button>
  );
}