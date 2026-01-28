'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  // --- ÉTATS (STATES) ---
  const [messages, setMessages] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'messages' | 'sales'>('messages')
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

  // --- RÉCUPÉRATION DES DONNÉES ---
  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
      setMessages(msgData || [])
      const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
      setSales(salesData || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
      setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }
  }

  // --- SUPPRESSION ---
  const deleteData = async (id: string, table: 'messages' | 'sales') => {
    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // --- ÉCRAN DE VERROUILLAGE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white font-sans">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase text-center italic text-blue-500">Elite Access</h2>
          <div className="relative mb-6">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe secret"
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none text-white text-center"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.413 8.245 7.051 5 12 5c4.949 0 8.587 3.245 9.964 6.678.028.068.028.143 0 .211C20.587 15.755 16.949 19 12 19c-4.949 0-8.587-3.245-9.964-6.678z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
            Vérifier l'identité
          </button>
        </form>
      </div>
    )
  }

  const totalRevenue = sales.filter(sale => sale.status === 'paid').reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      
      {/* --- CONFIGURATION STYLES (CORRIGÉ POUR VERCEL) --- */}
      <style jsx global>{`
        @keyframes rgbPulse {
          0% { background-color: #22c55e; box-shadow: 0 0 8px #22c55e; }
          33% { background-color: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
          66% { background-color: #ec4899; box-shadow: 0 0 8px #ec4899; }
          100% { background-color: #22c55e; box-shadow: 0 0 8px #22c55e; }
        }
        .animate-rgb { animation: rgbPulse 4s infinite linear; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-[#0A0A0A], .bg-[#050505], .bg-white\/5 { background: white !important; border: 1px solid #eee !important; color: black !important; }
          .text-white, .text-gray-400, .text-gray-300, .text-blue-500, .text-green-500 { color: black !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #eee !important; color: black !important; padding: 10px !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Elite Stack Dashboard</h1>
            <div className="flex gap-4 mt-6 no-print">
              <button onClick={() => setActiveTab('messages')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                Messages ({messages.length})
              </button>
              <button onClick={() => setActiveTab('sales')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                Ventes ({sales.length})
              </button>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Rapport PDF</button>
            <button onClick={fetchData} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Actualiser</button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest">Synchronisation...</div>
        ) : (
          <div className="grid gap-6">
            {activeTab === 'messages' && (
              messages.length === 0 ? <p className="text-center py-20 text-gray-600">Aucun message.</p> : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl relative group transition-all hover:border-blue-500/30">
                    <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 text-[10px] font-black uppercase no-print">Supprimer</button>
                    <h3 className="font-black text-blue-500 uppercase tracking-tighter text-lg">{msg.name}</h3>
                    <p className="text-gray-400 text-xs mb-4">{msg.email}</p>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 italic text-gray-300 text-sm">"{msg.content}"</div>
                  </div>
                ))
              )
            )}

            {activeTab === 'sales' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="relative group bg-[#0A0A0A] border border-green-500/30 p-8 rounded-3xl transition-all hover:border-green-400">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full animate-rgb"></div>
                      <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Flux de Trésorerie</p>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter">{totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-medium text-green-500/80">CFA</span></h2>
                    <p className="text-[9px] text-green-500/40 mt-2 uppercase font-bold italic">Vérifié à {lastUpdate}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-center">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Transactions Réussies</p>
                    <h2 className="text-5xl font-black text-white tracking-tighter">{sales.filter(s => s.status === 'paid').length}</h2>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                      <tr><th className="p-6">Client</th><th className="p-6 text-center">Pack</th><th className="p-6 text-center">Montant</th><th className="p-6 text-right">Statut</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-white/[0.02] group transition-all">
                          <td className="p-6"><div className="text-sm font-black text-white uppercase">{sale.email}</div></td>
                          <td className="p-6 text-center text-[11px] text-gray-400 font-bold uppercase">{sale.package}</td>
                          <td className="p-6 text-center font-black text-sm text-white">{sale.amount.toLocaleString('fr-FR')} CFA</td>
                          <td className="p-6 text-right">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${sale.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{sale.status === 'paid' ? 'Payé' : 'Échoué'}</span>
                            <button onClick={() => deleteData(sale.id, 'sales')} className="ml-4 opacity-0 group-hover:opacity-100 text-red-500 text-[10px] font-black no-print">Supprimer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}