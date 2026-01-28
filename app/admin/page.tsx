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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase text-center italic text-blue-500">Elite Access</h2>
          <div className="relative mb-6">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe secret"
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none text-white text-center"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all">Vérifier l'identité</button>
        </form>
      </div>
    )
  }

  const totalRevenue = sales.filter(sale => sale.status === 'paid').reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      
      {/* STYLE TAG UNIQUE POUR VERCEL */}
      <style jsx global>{`
        @keyframes rgbPulse {
          0% { background-color: #00ff66; box-shadow: 0 0 10px #00ff66; }
          50% { background-color: #00ff66; box-shadow: 0 0 20px #00ff66; }
          100% { background-color: #00ff66; box-shadow: 0 0 10px #00ff66; }
        }
        .animate-rgb { animation: rgbPulse 2s infinite ease-in-out; }
        .btn-ventes-active {
            background: #00ff66 !important;
            color: black !important;
            box-shadow: 0 0 25px rgba(0, 255, 102, 0.4);
        }
        .card-flux-green {
            background: linear-gradient(135deg, rgba(0,255,102,0.05) 0%, rgba(0,0,0,0) 100%);
            border: 2px solid #00ff66 !important;
            box-shadow: 0 0 30px rgba(0, 255, 102, 0.1);
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">ELITE STACK DASHBOARD</h1>
            <div className="flex gap-4 mt-8 no-print">
              <button onClick={() => setActiveTab('messages')} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500'}`}>
                MESSAGES ({messages.length})
              </button>
              <button onClick={() => setActiveTab('sales')} className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'btn-ventes-active' : 'bg-white/5 text-gray-500'}`}>
                VENTES ({sales.length})
              </button>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="bg-white/5 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10">RAPPORT PDF</button>
            <button onClick={fetchData} className="bg-[#001a0a] text-blue-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">ACTUALISER</button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-white animate-pulse font-black uppercase tracking-widest">SYNCHRONISATION...</div>
        ) : (
          <div className="grid gap-6">
            {activeTab === 'messages' && (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-7 rounded-[2rem] relative group transition-all hover:border-blue-500/30">
                    <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 text-red-500 text-[10px] font-black uppercase no-print">Supprimer</button>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black text-blue-500 uppercase tracking-tighter text-xl italic">{msg.name}</h3>
                      <span className="text-[10px] text-gray-600 font-bold">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-4 font-medium italic">{msg.email}</p>
                    <div className="bg-white/[0.02] p-7 rounded-2xl border border-white/5 italic text-gray-200 text-sm leading-relaxed">"{msg.content}"</div>
                  </div>
                ))
            )}

            {activeTab === 'sales' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* LA CARTE VERTE FLUX DIRECT */}
                  <div className="card-flux-green p-10 rounded-[2.5rem] relative group transition-all">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full animate-rgb"></div>
                      <p className="text-[#00ff66] text-[11px] font-black uppercase tracking-[0.3em]">FLUX DIRECT</p>
                    </div>
                    <h2 className="text-7xl font-black text-white tracking-tighter italic">
                        {totalRevenue.toLocaleString('fr-FR')} <span className="text-lg opacity-50 not-italic ml-2">CFA</span>
                    </h2>
                    <p className="text-[10px] text-[#00ff66]/60 mt-4 uppercase font-bold italic tracking-widest">VÉRIFIÉ DIRECT</p>
                  </div>

                  <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-center">
                    <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-4">TRANSACTIONS RÉUSSIES</p>
                    <h2 className="text-7xl font-black text-white tracking-tighter italic">{sales.filter(s => s.status === 'paid').length}</h2>
                    <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-widest">CLIENTS CONFIRMÉS</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-[#0A0A0A]">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.03] text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                      <tr>
                        <th className="p-8">CLIENT / DATE</th>
                        <th className="p-8 text-center">PACK</th>
                        <th className="p-8 text-center">MONTANT</th>
                        <th className="p-8 text-right">STATUT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-white/[0.01] group transition-all">
                          <td className="p-8">
                            <div className="text-sm font-black text-white uppercase">{sale.email}</div>
                            <div className="text-[10px] text-gray-700 font-bold mt-2">{new Date(sale.created_at).toLocaleString('fr-FR')}</div>
                          </td>
                          <td className="p-8 text-center text-[11px] text-gray-500 font-bold uppercase">{sale.package}</td>
                          <td className="p-8 text-center font-black text-base text-white italic">{sale.amount.toLocaleString('fr-FR')} CFA</td>
                          <td className="p-8 text-right">
                            <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${sale.status === 'paid' ? 'bg-[#00ff66]/10 text-[#00ff66]' : 'bg-red-500/10 text-red-500'}`}>
                                {sale.status === 'paid' ? 'PAYÉ' : 'ÉCHOUÉ'}
                            </span>
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