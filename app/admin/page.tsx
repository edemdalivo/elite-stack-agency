'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
// Importation des outils Recharts pour le suivi visuel des revenus
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboard() {
  // --- 1. ÉTATS (STATES) ---
  const [messages, setMessages] = useState<any[]>([]) // Stockage des messages de contact
  const [sales, setSales] = useState<any[]>([])      // Stockage des transactions (Stripe/Feda)
  const [activeTab, setActiveTab] = useState<'messages' | 'sales'>('messages') // Navigation
  const [loading, setLoading] = useState(true)       // État de chargement des données
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Sécurité Admin
  const [password, setPassword] = useState('')       // Champ mot de passe
  const [showPassword, setShowPassword] = useState(false) // Toggle visibilité MDP
  const [lastUpdate, setLastUpdate] = useState("")   // Horodatage de synchronisation

  // --- 2. LOGIQUE DE SÉCURITÉ ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

  // --- 3. RÉCUPÉRATION DES DONNÉES DEPUIS SUPABASE ---
  const fetchData = async () => {
    try {
      setLoading(true)
      // Récupération des messages classés par date
      const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
      setMessages(msgData || [])
      
      // Récupération des ventes confirmées ou échouées
      const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
      setSales(salesData || [])
    } catch (error) {
      console.error('Erreur SQL:', error)
    } finally {
      setLoading(false)
      setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }
  }

  // --- 4. FONCTION DE SUPPRESSION ---
  const deleteData = async (id: string, table: 'messages' | 'sales') => {
    if (!confirm('Action irréversible. Confirmer ?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchData() // Rafraîchissement automatique
    } catch (error) {
      alert('Erreur technique lors de la suppression')
    }
  }

  // Déclenchement du chargement après authentification
  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // --- 5. LOGIQUE DU GRAPHIQUE (DERNIERS 7 JOURS) ---
  const getChartData = () => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    }).reverse();

    return days.map(day => {
      const totalDay = sales
        .filter(s => s.status === 'paid' && new Date(s.created_at).toLocaleDateString('fr-FR', { weekday: 'short' }) === day)
        .reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
      return { name: day, total: totalDay };
    });
  };

  const chartData = getChartData();

  // --- 6. ANALYSE FINANCIÈRE (FCFA) ---
  const totalRevenue = sales.filter(s => s.status === 'paid').reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const stripeRevenue = sales.filter(s => s.status === 'paid' && s.package?.includes("Pack")).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const fedaRevenue = sales.filter(s => s.status === 'paid' && !s.package?.includes("Pack")).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

  // --- 7. ÉCRAN D'ACCÈS ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md">
          <h2 className="text-2xl font-black mb-8 text-center text-blue-500 uppercase italic tracking-tighter">Elite Authentication</h2>
          <div className="relative mb-6">
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-white font-bold outline-none focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Code d'accès"
            />
          </div>
          <button className="w-full bg-blue-600 p-5 rounded-2xl font-black uppercase text-xs tracking-widest text-white">Ouvrir la session</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      
      {/* ANIMATIONS CSS GLOBALES */}
      <style jsx global>{`
        @keyframes rgbPulse {
          0% { background-color: #22c55e; box-shadow: 0 0 10px #22c55e; }
          50% { background-color: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
          100% { background-color: #22c55e; box-shadow: 0 0 10px #22c55e; }
        }
        .animate-rgb { animation: rgbPulse 3s infinite linear; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div className="max-w-6xl mx-auto">
        
        {/* --- NAVIGATION & HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Elite <span className="text-blue-500">Stack</span> Console</h1>
            <div className="flex gap-4 mt-6 no-print">
              <button onClick={() => setActiveTab('messages')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === 'messages' ? 'bg-blue-600' : 'bg-white/5 text-gray-500'}`}>Messages</button>
              <button onClick={() => setActiveTab('sales')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === 'sales' ? 'bg-green-600' : 'bg-white/5 text-gray-500'}`}>Finances</button>
            </div>
          </div>
          <div className="flex gap-3 no-print">
            <button onClick={() => window.print()} className="bg-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase border border-white/10">Exporter PDF</button>
            <button onClick={fetchData} className="bg-blue-600/10 text-blue-500 px-6 py-2 rounded-full text-[10px] font-black uppercase border border-blue-500/20">Rafraîchir</button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-24 animate-pulse text-gray-600 font-black uppercase tracking-[0.4em]">Lecture des données...</div>
        ) : (
          <div className="space-y-10">

            {/* --- SECTION MESSAGES --- */}
            {activeTab === 'messages' && (
              <div className="grid gap-6">
                {messages.length === 0 ? <p className="text-center py-20 text-gray-700 italic">Aucun message entrant.</p> : 
                  messages.map(msg => (
                    <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] relative group hover:border-blue-500/30 transition-all">
                      <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 text-red-600 text-[10px] font-black uppercase no-print">Supprimer</button>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter mb-1">{msg.name}</h3>
                          <p className="text-xs text-gray-500 font-bold">{msg.email}</p>
                        </div>
                        <span className="text-[10px] text-gray-700 font-black">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed">"{msg.content}"</div>
                    </div>
                  ))
                }
              </div>
            )}

            {/* --- SECTION FINANCES --- */}
            {activeTab === 'sales' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* CARTES STATISTIQUES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* CARTE GLOW VERTE (Trésorerie) */}
                  <div className="relative bg-[#0A0A0A] border border-green-500/50 p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full animate-rgb"></div>
                      <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Flux Monétaire Réel</p>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter italic">
                      {totalRevenue.toLocaleString()} <span className="text-sm opacity-30 italic font-sans ml-2">FCFA</span>
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5">
                      <div>
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Stripe (Card)</p>
                        <p className="text-xs font-black text-blue-500">{stripeRevenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">FedaPay (Local)</p>
                        <p className="text-xs font-black text-orange-500">{fedaRevenue.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Sync</p>
                        <p className="text-xs font-black text-white/30 tracking-tighter">{lastUpdate}</p>
                      </div>
                    </div>
                  </div>

                  {/* CARTE VOLUME CLIENTS */}
                  <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-center">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-4">Volume de Services</p>
                    <h2 className="text-6xl font-black tracking-tighter italic">
                      {sales.filter(s => s.status === 'paid').length}
                      <span className="text-sm opacity-30 ml-4 italic font-sans">CLIENTS</span>
                    </h2>
                    <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest italic">Base de données à jour à 100%</p>
                  </div>
                </div>

                {/* --- GRAPHIQUE DE PERFORMANCE (VERT) --- */}
                <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-gray-700">Progression hebdomadaire</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 10, fontWeight: 'bold'}} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{backgroundColor: '#000', border: '1px solid #222', borderRadius: '15px'}} 
                          itemStyle={{color: '#22c55e', fontWeight: 'bold', fontSize: '12px'}} 
                        />
                        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.total > 0 ? '#22c55e' : '#111'} 
                              style={{ filter: entry.total > 0 ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))' : 'none' }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* --- LISTE DES TRANSACTIONS --- */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-[9px] font-black uppercase text-gray-600 tracking-widest">
                      <tr>
                        <th className="p-8">Détails Client</th>
                        <th className="p-8 text-center">Service / Méthode</th>
                        <th className="p-8 text-center">Montant Net</th>
                        <th className="p-8 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sales.map(sale => (
                        <tr key={sale.id} className="hover:bg-white/[0.01] group transition-all">
                          <td className="p-8">
                            <p className="text-sm font-black italic tracking-tight">{sale.email}</p>
                            <p className="text-[10px] text-gray-700 font-bold mt-1 uppercase">{new Date(sale.created_at).toLocaleString('fr-FR')}</p>
                          </td>
                          <td className="p-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[11px] font-black uppercase italic text-gray-400">{sale.package}</span>
                              <span className={`text-[8px] font-black px-2 py-1 rounded border ${sale.package?.includes("Pack") ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"}`}>
                                {sale.package?.includes("Pack") ? "STRIPE CARD" : "MOBILE MONEY"}
                              </span>
                            </div>
                          </td>
                          <td className="p-8 text-center text-lg font-black italic tracking-tighter">
                            {Number(sale.amount).toLocaleString()} <span className="text-[10px] opacity-20">F</span>
                          </td>
                          <td className="p-8 text-right">
                            <div className="flex items-center justify-end gap-6">
                              <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${sale.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {sale.status === 'paid' ? 'Succès' : 'Échec'}
                              </span>
                              <button onClick={() => deleteData(sale.id, 'sales')} className="opacity-0 group-hover:opacity-100 text-red-700 text-[9px] font-black uppercase no-print transition-all">Effacer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}