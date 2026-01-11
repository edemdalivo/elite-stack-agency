'use client';
import React from 'react';

const ContactActions = () => {
  // Numéro au format international sans le "+" pour le lien wa.me
  const whatsappNumber = "+22893591643";
  const email = "edemdalivo93@gmail.com";
  
  const message = encodeURIComponent("Bonjour Edem ! Je vous contacte depuis votre site pour un projet.");

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      
      {/* BOUTON WHATSAPP : Ton outil principal de vente actuel */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="text-xl">💬</span>
        <span>Commander via WhatsApp</span>
      </a>

      {/* BOUTON EMAIL : L'alternative pro */}
      <a 
      
        href={`mailto:${email}?subject=Demande de services - Elite Stack`}
        className="flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-4 px-8 rounded-2xl transition-all border border-neutral-800"
      >
        <span>✉️</span>
        <span>Envoyer un Email</span>
      </a>

      <p className="text-[10px] text-neutral-500 uppercase tracking-widest text-center mt-2">
         Expertise Togo & International • +228 93 59 16 43
      </p>
    </div>
  );
};

export default ContactActions;