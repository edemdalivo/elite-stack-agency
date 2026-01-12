'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

const SERVICES = [
  { title: "Développement Full-Stack", desc: "Applications web sur mesure avec Next.js et bases de données temps réel.", icon: "🚀" },
  { title: "UI/UX Design", desc: "Interfaces modernes et intuitives pour une expérience utilisateur exceptionnelle.", icon: "🎨" },
  { title: "Solutions Cloud", desc: "Hébergement haute performance et scalabilité avec Vercel et Supabase.", icon: "☁️" }
]

export default function AgencyPage() {
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
      setStatus({ type: 'error', msg: "Erreur : " + error.message });
    } else {
      setStatus({ type: 'success', msg: "Message reçu ! Elite Stack Agency vous recontactera." });
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Elite Stack Agency
        </h1>
        <p className="text-xl text-gray-400">Propulsez votre vision digitale vers de nouveaux sommets.</p>
      </header>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
        {SERVICES.map((s, i) => (
          <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Contact Form Section */}
      <div id="contact" className="w-full max-w-xl mx-auto bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl mb-20">
        <h2 className="text-2xl font-bold text-center mb-6">Démarrons votre projet</h2>
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
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 font-bold py-4 rounded-lg transition-all">
            {isSubmitting ? 'Envoi en cours...' : 'Propulser mon projet'}
          </button>
          {status && (
            <div className={`p-4 rounded-lg text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}