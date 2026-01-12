'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        name: formData.get('name'), 
        email: formData.get('email'), 
        content: formData.get('message') 
      }]);

    setIsSubmitting(false);

    if (error) {
      setStatus({ type: 'error', msg: "Zut ! Une erreur est survenue : " + error.message });
    } else {
      setStatus({ type: 'success', msg: "Message reçu ! Elite Stack Agency vous recontactera très vite." });
      form.reset(); // Correction de l'erreur reset
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Elite Stack Agency
          </h1>
          <p className="text-gray-400 mt-2">Parlons de votre prochain projet digital.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet</label>
            <input name="name" type="text" required placeholder="Edem Dalivo"
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg p-3 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email professionnel</label>
            <input name="email" type="email" required placeholder="edem@example.com"
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg p-3 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Votre message</label>
            <textarea name="message" required placeholder="Décrivez votre besoin..." rows={4}
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg p-3 focus:border-blue-500 outline-none transition-all resize-none" />
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 font-bold py-4 rounded-lg transition-all shadow-lg shadow-blue-500/20">
            {isSubmitting ? 'Envoi en cours...' : 'Propulser mon projet'}
          </button>

          {status && (
            <div className={`p-4 rounded-lg text-center animate-fade-in ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}