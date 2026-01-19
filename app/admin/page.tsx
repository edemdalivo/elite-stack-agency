'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // 1. Fonctions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  // 2. LE HOOK DOIT ÊTRE ICI (Avant tous les "return")
  useEffect(() => {
    if (isAuthenticated) { // On ne lance la recherche que si on est connecté
      fetchMessages()
    }
  }, [isAuthenticated]) // Se relance quand isAuthenticated change

  // 3. AFFICHAGE CONDITIONNEL (Toujours après les Hooks)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Elite Access</h2>
          <p className="text-gray-500 text-sm mb-8">Entrez vos identifiants de sécurité</p>
          
          <div className="relative group text-white">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe secret"
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-5 text-gray-500 hover:text-blue-400 text-xs font-bold uppercase tracking-widest"
            >
              {showPassword ? "Masquer" : "Voir"}
            </button>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
            Vérifier l'identité
          </button>
        </form>
      </div>
    )
  }

  // 4. LE DASHBOARD (Si authentifié)
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400">Gestion des prospects Elite Stack</p>
          </div>
          <button 
            onClick={fetchMessages}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-bold transition-all"
          >
            Actualiser
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Chargement des données...</div>
        ) : (
          <div className="grid gap-6">
            {messages.length === 0 ? (
              <p className="text-center py-20 text-gray-600">Aucun message reçu pour le moment.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-400">{msg.name}</h3>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl italic">
                    "{msg.content}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}