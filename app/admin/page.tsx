'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  // --- ÉTATS (STATES) : Stockage des données locales ---
  const [messages, setMessages] = useState<any[]>([]) // Liste des messages reçus
  const [sales, setSales] = useState<any[]>([])       // Liste des ventes (FedaPay)
  const [activeTab, setActiveTab] = useState<'messages' | 'sales'>('messages') // Onglet sélectionné
  const [loading, setLoading] = useState(true)        // État de chargement
  const [isAuthenticated, setIsAuthenticated] = useState(false) // État de la connexion
  const [password, setPassword] = useState('')        // Saisie du mot de passe

  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

  // --- RÉCUPÉRATION DES DONNÉES DEPUIS SUPABASE ---
  const fetchData = async () => {
    try {
      setLoading(true)
      // Récupère les messages classés par les plus récents
      const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
      setMessages(msgData || [])
      
      // Récupère les ventes classées par les plus récentes
      const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
      setSales(salesData || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- FONCTION DE SUPPRESSION ---
  const deleteData = async (id: string, table: 'messages' | 'sales') => {
    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchData() // Rafraîchit l'affichage après suppression
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  // Charge les données automatiquement une fois connecté
  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // --- ÉCRAN DE VERROUILLAGE (Si non connecté) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white font-sans">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase text-center italic text-blue-500">Elite Access</h2>
          <input 
            type="password" 
            placeholder="Mot de passe secret"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 focus:border-blue-500 outline-none text-white text-center"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoFocus
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
            Vérifier l'identité
          </button>
        </form>
      </div>
    )
  }

  // --- CALCUL DU CHIFFRE D'AFFAIRES (Seulement les ventes 'paid') ---
  const totalRevenue = sales
    .filter(sale => sale.status === 'paid')
    .reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      
      {/* --- CONFIGURATION IMPRESSION PDF --- */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-[#0A0A0A], .bg-[#050505], .bg-white\/5 { background: white !important; border: 1px solid #eee !important; color: black !important; }
          .text-white, .text-gray-400, .text-gray-300, .text-blue-500, .text-green-500 { color: black !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #eee !important; color: black !important; padding: 10px !important; }
          .shadow-2xl, .shadow-lg { shadow: none !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        
        {/* --- EN-TÊTE DU DASHBOARD --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Elite Stack Dashboard</h1>
            <div className="flex gap-4 mt-6 no-print">
              <button onClick={() => setActiveTab('messages')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                Messages ({messages.length})
              </button>
              <button onClick={() => setActiveTab('sales')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                Ventes ({sales.length})
              </button>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
              Rapport PDF
            </button>
            <button onClick={fetchData} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 transition-all">
              Actualiser
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-blue-500 animate-pulse font-black uppercase tracking-widest text-white">Synchronisation...</div>
        ) : (
          <div className="grid gap-6">
            
            {/* --- CONTENU ONGLET : MESSAGES --- */}
            {activeTab === 'messages' && (
              messages.length === 0 ? <p className="text-center py-20 text-gray-600">Aucun message pour le moment.</p> : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl relative group transition-all hover:border-blue-500/30">
                    <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest no-print transition-all">Supprimer</button>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black text-blue-500 uppercase tracking-tighter text-lg">{msg.name}</h3>
                      <span className="text-[10px] text-gray-600 font-bold">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-4 font-medium">{msg.email}</p>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 italic text-gray-300 text-sm leading-relaxed">
                      "{msg.content}"
                    </div>
                  </div>
                ))
              )
            )}

            {/* --- CONTENU ONGLET : VENTES --- */}
            {activeTab === 'sales' && (
              <>
                {/* CARTES DE RÉSUMÉ AVEC EFFET VERT GLOW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Carte Chiffre d'Affaires */}
                  <div className="relative group overflow-hidden bg-gradient-to-br from-green-600/20 to-emerald-600/5 border border-green-500/30 p-8 rounded-3xl shadow-[0_0_20px_rgba(34,197,94,0.05)] transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 blur-3xl rounded-full group-hover:bg-green-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">Flux de Trésorerie</p>
                      </div>
                      <h2 className="text-5xl font-black text-white tracking-tighter flex items-baseline gap-2">
                        {totalRevenue.toLocaleString('fr-FR')} 
                        <span className="text-sm font-medium text-green-500/80 text-white">CFA</span>
                      </h2>
                      <p className="text-[9px] text-green-500/40 mt-2 uppercase font-bold tracking-widest">Vérifié en direct</p>
                    </div>
                  </div>

                  {/* Carte Volume de Ventes */}
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-center transition-all hover:border-white/20">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Transactions Réussies</p>
                    <h2 className="text-5xl font-black text-white tracking-tighter">
                      {sales.filter(s => s.status === 'paid').length}
                    </h2>
                    <p className="text-[9px] text-gray-600 mt-2 uppercase font-bold tracking-widest">Clients confirmés</p>
                  </div>
                </div>

                {/* TABLEAU DES VENTES */}
                {sales.length === 0 ? <p className="text-center py-20 text-gray-600">Aucune vente enregistrée.</p> : (
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        <tr>
                          <th className="p-6 text-white">Client / Date</th>
                          <th className="p-6 text-center text-white">Pack</th>
                          <th className="p-6 text-center text-white">Montant</th>
                          <th className="p-6 text-right text-white">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-white/[0.02] group transition-all">
                            <td className="p-6">
                              <div className="text-sm font-black text-white uppercase tracking-tighter">{sale.email}</div>
                              <div className="text-[10px] text-gray-600 font-bold mt-1">{new Date(sale.created_at).toLocaleString()}</div>
                            </td>
                            <td className="p-6 text-center text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{sale.package}</td>
                            <td className="p-6 text-center font-black text-sm text-white tracking-tighter">{sale.amount.toLocaleString('fr-FR')} CFA</td>
                            <td className="p-6 text-right">
                              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${sale.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {sale.status === 'paid' ? 'Payé' : 'Échoué'}
                              </span>
                              <button onClick={() => deleteData(sale.id, 'sales')} className="ml-4 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-[10px] font-black uppercase no-print transition-all">Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}