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
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') setIsAuthenticated(true)
    else alert('Accès refusé')
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
      setMessages(msgData || [])
      const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
      setSales(salesData || [])
    } catch (error) { console.error(error) } 
    finally { 
      setLoading(false)
      setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }
  }

  useEffect(() => { if (isAuthenticated) fetchData() }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-10 rounded-[2rem] border border-white/10 w-full max-w-md shadow-2xl text-center">
          <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase italic text-blue-500">ELITE ACCESS</h2>
          <input 
            type="password" 
            placeholder="Mot de passe"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none text-white text-center mb-6"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all">Vérifier</button>
        </form>
      </div>
    )
  }

  const totalRevenue = sales.filter(sale => sale.status === 'paid').reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 10px #00ff66; }
          50% { box-shadow: 0 0 25px #00ff66; }
          100% { box-shadow: 0 0 10px #00ff66; }
        }
        /* LE VERT QUI CLAQUE */
        .btn-elite-green { 
          background: #00ff66 !important; 
          color: black !important; 
          box-shadow: 0 0 25px rgba(0, 255, 102, 0.6);
        }
        .text-elite-green { color: #00ff66 !important; }
        .border-elite-green { border-color: rgba(0, 255, 102, 0.3) !important; }
        
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-8">ELITE STACK</h1>
            <div className="flex gap-4 no-print">
              <button 
                onClick={() => setActiveTab('messages')} 
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-white/5 text-gray-500'}`}
              >
                Messages ({messages.length})
              </button>
              <button 
                onClick={() => setActiveTab('sales')} 
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'btn-elite-green' : 'bg-white/5 text-gray-500'}`}
              >
                Ventes ({sales.length})
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 no-print">
            <button onClick={() => window.print()} className="bg-white/5 px-5 py-3 rounded-xl text-[10px] font-black uppercase border border-white/10">PDF</button>
            <button onClick={fetchData} className="bg-white/5 px-5 py-3 rounded-xl text-[10px] font-black uppercase border border-white/10">Actualiser</button>
          </div>
        </header>

        {activeTab === 'sales' && (
          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0A0A0A] border border-elite-green p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]"></div>
                  <span className="text-elite-green text-[10px] font-black uppercase tracking-widest">Flux Direct</span>
                </div>
                <h2 className="text-7xl font-black italic tracking-tighter">{totalRevenue.toLocaleString()} <span className="text-lg opacity-40 not-italic">CFA</span></h2>
                <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-widest">Mis à jour à {lastUpdate}</p>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-center">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Ventes Réussies</span>
                <h2 className="text-7xl font-black italic tracking-tighter">{sales.filter(s => s.status === 'paid').length}</h2>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">
                  <tr><th className="p-8">Client</th><th className="p-8 text-center">Pack</th><th className="p-8 text-right">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-8">
                        <div className="font-black text-sm uppercase">{sale.email}</div>
                        <div className="text-[10px] text-gray-600 mt-1 font-bold">{new Date(sale.created_at).toLocaleString('fr-FR')}</div>
                      </td>
                      <td className="p-8 text-center text-[11px] text-gray-400 font-bold uppercase">{sale.package}</td>
                      <td className="p-8 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${sale.status === 'paid' ? 'bg-[#00ff66]/10 text-elite-green border border-[#00ff66]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {sale.status === 'paid' ? 'PAYÉ' : 'ÉCHOUÉ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/30 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">{msg.name}</h3>
                  <span className="text-[10px] text-gray-600 font-bold">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-gray-400 text-xs mb-6 font-medium">{msg.email}</p>
                <div className="bg-white/[0.02] p-6 rounded-2xl italic text-gray-300 text-sm leading-relaxed border border-white/5">"{msg.content}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}