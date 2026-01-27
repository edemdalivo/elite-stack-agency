'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  // --- ÉTATS (STATES) ---
  const [messages, setMessages] = useState<any[]>([]) // Stocke les messages de contact
  const [sales, setSales] = useState<any[]>([])       // Stocke les transactions FedaPay
  const [activeTab, setActiveTab] = useState<'messages' | 'sales'>('messages') // Gère l'onglet actif
  const [loading, setLoading] = useState(true)        // État de chargement des données
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Sécurité d'accès
  const [password, setPassword] = useState('')        // Stocke la saisie du mot de passe
  const [showPassword, setShowPassword] = useState(false)

  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'ELITE2026') {
      setIsAuthenticated(true)
    } else {
      alert('Accès refusé')
    }
  }

  // --- RÉCUPÉRATION DES DONNÉES (FETCH) ---
  const fetchData = async () => {
    try {
      setLoading(true)
      // On récupère les messages (table 'messages') par date décroissante
      const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
      setMessages(msgData || [])
      
      // On récupère les ventes (table 'sales') par date décroissante
      const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
      setSales(salesData || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- SUPPRESSION ---
  const deleteData = async (id: string, table: 'messages' | 'sales') => {
    // Fenêtre de confirmation avant d'effacer en base de données
    if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchData() // On rafraîchit la liste après la suppression
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  // Déclenche le chargement des données dès que l'admin est authentifié
  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // --- ÉCRAN DE VERROUILLAGE (LOGIN) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
        <form onSubmit={handleLogin} className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase text-center">Elite Access</h2>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mot de passe secret"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 focus:border-blue-500 outline-none text-white mt-4"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoFocus
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all">
            Vérifier l'identité
          </button>
        </form>
      </div>
    )
  }

  // --- CALCULS FINANCIERS ---
  // On filtre uniquement les ventes avec le statut 'paid' pour calculer le total
  const totalRevenue = sales
    .filter(sale => sale.status === 'paid')
    .reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0);

  // --- INTERFACE PRINCIPALE (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* CSS SPÉCIFIQUE À L'IMPRESSION (CTRL+P) */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; } /* Cache les éléments inutiles sur papier */
          body { background: white !important; color: black !important; }
          .bg-[#0A0A0A], .bg-[#050505] { background: white !important; border: 1px solid #eee !important; }
          .text-white, .text-gray-400, .text-gray-300 { color: black !important; }
          .bg-gradient-to-br { background: #f9f9f9 !important; border: 1px solid #ccc !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #eee !important; color: black !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Elite Stack Dashboard</h1>
            {/* SÉLECTEUR D'ONGLETS */}
            <div className="flex gap-4 mt-4 no-print">
              <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-blue-600' : 'bg-white/5 text-gray-400'}`}>
                Messages ({messages.length})
              </button>
              <button onClick={() => setActiveTab('sales')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-green-600' : 'bg-white/5 text-gray-400'}`}>
                Ventes ({sales.length})
              </button>
            </div>
          </div>
          
          {/* BOUTONS D'ACTION */}
          <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold border border-white/10 transition-all">
              Imprimer le rapport
            </button>
            <button onClick={fetchData} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-xs font-bold transition-all">
              Actualiser
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse text-white">Synchronisation...</div>
        ) : (
          <div className="grid gap-6">
            
            {/* --- RENDU DE L'ONGLET MESSAGES --- */}
            {activeTab === 'messages' && (
              messages.length === 0 ? <p className="text-center py-20 text-gray-600">Aucun message.</p> : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl relative group">
                    {/* Bouton supprimer visible uniquement au survol de la souris (group-hover) */}
                    <button onClick={() => deleteData(msg.id, 'messages')} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs no-print transition-all">Supprimer</button>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-blue-400">{msg.name}</h3>
                      <span className="text-[10px] text-gray-600 uppercase">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{msg.email}</p>
                    <p className="text-gray-300 italic bg-white/5 p-4 rounded-xl border border-white/5">"{msg.content}"</p>
                  </div>
                ))
              )
            )}

            {/* --- RENDU DE L'ONGLET VENTES --- */}
            {activeTab === 'sales' && (
              <>
                {/* CARTES DE RÉSUMÉ (REVENUS & NOMBRE DE VENTES) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/5 border border-green-500/20 p-6 rounded-3xl">
                    <p className="text-green-500 text-xs font-black uppercase tracking-widest mb-2">Chiffre d'Affaires</p>
                    <h2 className="text-4xl font-black text-white">{totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-normal text-green-500">CFA</span></h2>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2 text-white">Ventes Réussies</p>
                    <h2 className="text-4xl font-black text-white">{sales.filter(s => s.status === 'paid').length}</h2>
                  </div>
                </div>

                {/* TABLEAU DES TRANSACTIONS */}
                {sales.length === 0 ? <p className="text-center py-20 text-gray-600 text-white">Aucune vente.</p> : (
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full text-left bg-[#0A0A0A]">
                      <thead className="bg-white/5 text-[10px] uppercase text-gray-500">
                        <tr>
                          <th className="p-4 text-white">Client</th>
                          <th className="p-4 text-white">Pack</th>
                          <th className="p-4 text-white">Montant</th>
                          <th className="p-4 text-right text-white">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-white/[0.02] group">
                            <td className="p-4 text-white">
                              <div className="text-sm font-medium">{sale.email}</div>
                              <div className="text-[10px] text-gray-500">{new Date(sale.created_at).toLocaleString()}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-400">{sale.package}</td>
                            <td className="p-4 font-bold text-sm text-white">{sale.amount.toLocaleString('fr-FR')} CFA</td>
                            <td className="p-4 text-right">
                              {/* Pastille de statut (Vert pour payé, Rouge pour échec) */}
                              <span className={`text-[10px] font-black uppercase mr-4 ${sale.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                                {sale.status === 'paid' ? 'Payé' : 'Échoué'}
                              </span>
                              <button onClick={() => deleteData(sale.id, 'sales')} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-[10px] font-bold no-print transition-all">Supprimer</button>
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