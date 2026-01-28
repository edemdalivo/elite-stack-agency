'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [messages, setMessages] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'messages' | 'sales'>('messages')
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

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
      
      <style jsx global>{`
        @keyframes rgbPulse {
          0% { background-color: #22c55e; box-shadow: 0 0 15px #22c55e; }
          33% { background-color: #3b82f6; box-shadow: 0 0 15px #3b82f6; }
          66% { background-color: #ec4899; box-shadow: 0 0 15px #ec4899; }
          100% { background-color: #22c55e; box-shadow: 0 0 15px #22c55e; }
        }
        .animate-rgb { animation: rgbPulse 4s infinite linear; }
        .btn-glow-green { background: #16a34a !important; box-shadow: 0 0 20px rgba(22, 163, 74, 0.4); color: white !important; }
        .btn-glow-blue { background: #2563eb !important; box-shadow: 0 0 20px rgba(37, 99, 235, 0.4); color: white !important; }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-[#0A0A0A], .bg-[#050505], .bg-white\/5 { background: white !important; border: 1px solid #eee !important; color: black !important; }
          .text-white, .text-gray-400, .text-gray-300, .text-blue-500, .text-green-500 { color: black !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic italic tracking-tight">ELITE STACK DASHBOARD</h1>
            <div className="flex gap-4 mt-8 no-print">
              <button 
                onClick={() => setActiveTab('messages')} 
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'btn-glow-blue' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                Messages ({messages.length})
              </button>
              <button 
                onClick={() => setActiveTab('sales')} 
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'btn-glow-green' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                Ventes ({sales.length})
              </button>
            </div>
          </div>
          <div className="flex gap-3 no-print">
            <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Rapport PDF</button>
            <button onClick={fetchData} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 transition-all">Actualiser</button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest text-xs">Synchronisation des données sécurisées...</div>
        ) : (
          <div className="grid gap-6">
            {activeTab === 'messages' && (
              messages.map((msg) => (
                <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-7 rounded-[2rem] relative group transition-all hover:border-blue-500/40 shadow-xl">
                  <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 text-red-500 text-[10px] font-black uppercase no-print transition-opacity">Supprimer</button>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-blue-500 uppercase tracking-tighter text-xl italic">{msg.name}</h3>
                    <span className="text-[10px] text-gray-600 font-bold tabular-nums">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-6 font-medium">{msg.email}</p>
                  <div className="bg-white/[0.03] p-7 rounded-2xl border border-white/5 italic text-gray-200 text-sm leading-relaxed shadow-inner">
                    "{msg.content}"
                  </div>
                </div>
              ))
            )}

            {activeTab === 'sales' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="relative group bg-[#0A0A0A] border border-green-500/20 p-10 rounded-[2.5rem] transition-all hover:border-green-500/50 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[80px]"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full animate-rgb"></div>
                      <p className="text-green-500 text-[11px] font-black uppercase tracking-[0.3em]">Flux de Trésorerie</p>
                    </div>
                    <h2 className="text-6xl font-black text-white tracking-tighter italic">
                      {totalRevenue.toLocaleString('fr-FR')} <span className="text-lg font-bold text-green-500/60 not-italic ml-2">CFA</span>
                    </h2>
                    <p className="text-[10px] text-green-500/40 mt-4 uppercase font-bold italic tracking-wider">Vérifié à {lastUpdate}</p>
                  </div>
                  
                  <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-center shadow-xl">
                    <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4">Clients Confirmés</p>
                    <h2 className="text-6xl font-black text-white tracking-tighter italic">{sales.filter(s => s.status === 'paid').length}</h2>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.03] text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                      <tr><th className="p-8">Client / Date</th><th className="p-8 text-center">Pack Elite</th><th className="p-8 text-center">Montant</th><th className="p-8 text-right">Statut</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-white/[0.02] group transition-all">
                          <td className="p-8">
                            <div className="text-[13px] font-black text-white uppercase tracking-tight">{sale.email}</div>
                            <div className="text-[10px] text-gray-600 font-bold mt-2 tabular-nums italic">{new Date(sale.created_at).toLocaleString('fr-FR')}</div>
                          </td>
                          <td className="p-8 text-center text-[11px] text-gray-400 font-bold uppercase italic">{sale.package}</td>
                          <td className="p-8 text-center font-black text-base text-white tabular-nums">{sale.amount.toLocaleString('fr-FR')} CFA</td>
                          <td className="p-8 text-right">
                            <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${sale.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                              {sale.status === 'paid' ? 'PAYÉ' : 'ÉCHOUÉ'}
                            </span>
                            <button onClick={() => deleteData(sale.id, 'sales')} className="ml-6 opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 text-[10px] font-black transition-all no-print">SUPPRIMER</button>
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