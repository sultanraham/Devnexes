import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, X, Cpu, Menu, LogOut, Plus, Target, TrendingUp, Activity, CheckCircle, Database, Users, Clock, Mail
} from 'lucide-react'
import { supabase } from '../supabaseClient'

const AdminPortal = ({ onLogout }) => {
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('social')
  const [saveStatus, setSaveStatus] = useState(null)
  
  const [siteSettings, setSiteSettings] = useState({ 
    download_title: '', download_subtitle: '', download_desc: '', qr_url: '', mobile_wallpaper: '', trusted_clients_count: '1000+k',
    stat_1_value: '150K', stat_1_label: 'AI Solutions',
    stat_2_value: '500K', stat_2_label: 'Vision AI',
    stat_3_value: '250M', stat_3_label: 'Web Dev',
    stat_4_value: '200K', stat_4_label: 'Custom'
  })
  const [socialData, setSocialData] = useState({ transaction_volume: '9.9M', split_values: '3.5%', reviewed_by: '100k+', social_proof: '' })
  const [trustedClients, setTrustedClients] = useState([])
  const [sessions, setSessions] = useState([])
  const [contacts, setContacts] = useState([])

  const syncData = useCallback(async () => {
    const { data: sData } = await supabase.from('site_settings').select('*')
    if (sData) {
      const settings = {}
      sData.forEach(r => settings[r.key] = r.value)
      setSiteSettings(settings)
    }

    const { data: social } = await supabase.from('social_data').select('*').eq('id', 1).single()
    if (social) setSocialData(social)

    const { data: clients } = await supabase.from('trusted_clients').select('*').order('ring').order('angle')
    if (clients && clients.length > 0) setTrustedClients(clients)
    else {
      setTrustedClients([
        { id: 1, name: 'Sara', role: 'Digital Creator', ring: 'outer', angle: 0, text: 'Quick and easy account opening.' },
        { id: 2, name: 'Jack', role: 'Software Engineer', ring: 'outer', angle: 90, text: 'Best automation tools available.' },
        { id: 3, name: 'Oliver', role: 'Business Owner', ring: 'outer', angle: 180, text: 'Expert technical guidance.' },
        { id: 4, name: 'Emma', role: 'Marketing Lead', ring: 'outer', angle: 270, text: 'Secure digital platforms.' }
      ])
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
    try {
      const res = await fetch(`${API_BASE}/api/admin/sessions`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      if (res.ok) setSessions(await res.json())

      const cRes = await fetch(`${API_BASE}/api/admin/contacts`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      if (cRes.ok) setContacts(await cRes.json())
    } catch {}

    setLoading(false)
  }, [])

  useEffect(() => {
    syncData()
    const channel = supabase.channel('admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        syncData()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [syncData])

  const showSuccess = () => {
    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const updateSettings = async () => {
    const updates = Object.keys(siteSettings).map((key) => ({ key, value: siteSettings[key] }))
    await supabase.from('site_settings').upsert(updates, { onConflict: 'key' })
    showSuccess()
  }

  const updateSocialData = async () => {
    await supabase.from('social_data').upsert({ id: 1, ...socialData })
    showSuccess()
  }

  const updateTrustedClients = async () => {
    for (const client of trustedClients) {
      await supabase.from('trusted_clients').upsert(client)
    }
    const ids = trustedClients.map(c => c.id).filter(id => id);
    if (ids.length > 0) {
      await supabase.from('trusted_clients').delete().not('id', 'in', `(${ids.join(',')})`);
    } else {
      await supabase.from('trusted_clients').delete().neq('id', 0);
    }
    
    if (siteSettings.trusted_clients_count !== undefined) {
      const { data } = await supabase.from('site_settings').select('id').eq('key', 'trusted_clients_count').single();
      const settingId = data ? data.id : 6;
      await supabase.from('site_settings').upsert({ id: settingId, key: 'trusted_clients_count', value: siteSettings.trusted_clients_count }, { onConflict: 'key' })
    }
    
    showSuccess()
  }

  const addNewClient = () => {
    const maxId = Math.max(...trustedClients.map(c => c.id || 0), 0)
    const newClient = {
      id: maxId + 1,
      name: 'New Client',
      role: 'Role',
      ring: 'outer',
      angle: (trustedClients.filter(c => c.ring === 'outer').length) * 90,
      text: 'Share your testimonial...'
    }
    setTrustedClients([...trustedClients, newClient])
  }

  const removeClient = (idx) => {
    const updated = trustedClients.filter((_, i) => i !== idx)
    setTrustedClients(updated)
  }

  const markContactRead = async (id) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
    await fetch(`${API_BASE}/api/admin/contacts/${id}/read`, { 
      method: 'PUT', 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    })
    syncData()
  }

  const handleLogout = () => { onLogout() }

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <Database className="w-12 h-12 text-blue-600" />
      </motion.div>
    </div>
  )

  const Sidebar = () => (
    <div className="w-80 h-full bg-white backdrop-blur-2xl border-r border-slate-200 flex flex-col p-8 shadow-xl">
      <div className="flex items-center justify-between lg:block mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-slate-900 font-bold text-xl tracking-tight block leading-none">Command Hub</span>
            <span className="text-blue-600 text-[9px] font-bold uppercase tracking-[0.4em] mt-1.5 block">Admin Access</span>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-800"><X className="w-6 h-6" /></button>
      </div>

      <div className="mb-8 space-y-3">
        <button onClick={() => setActiveTab('social')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'social' ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><TrendingUp size={16} /> Social Metrics</button>
        <button onClick={() => setActiveTab('trusted')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'trusted' ? 'bg-pink-50 text-pink-600 border border-pink-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Activity size={16} /> Trusted Clients</button>
        <button onClick={() => setActiveTab('marketing')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'marketing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Target size={16} /> Marketing Assets</button>
        <button onClick={() => setActiveTab('users')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Users size={16} /> Active Users</button>
        <button onClick={() => setActiveTab('inquiries')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'inquiries' ? 'bg-purple-50 text-purple-600 border border-purple-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Mail size={16} /> Contact Inquiries</button>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-hide"></nav>

      <div className="mt-auto pt-8 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-all font-medium text-xs w-full p-3 rounded-xl hover:bg-red-50">
          <LogOut className="w-4 h-4" /><span>Disconnect Session</span>
        </button>
      </div>
    </div>
  )

  const TopBar = ({ title, subtitle, onSave, colorClass, btnColorClass }) => (
    <header className="h-28 lg:h-36 border-b border-slate-200 flex items-center justify-between px-8 lg:px-14 bg-white/90 backdrop-blur-xl shrink-0 sticky top-0 z-20 shadow-sm">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className={`text-3xl lg:text-4xl font-bold tracking-tight ${colorClass}`}>{title}</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">{subtitle}</p>
      </motion.div>
      <div className="flex items-center gap-4">
        <AnimatePresence>
          {saveStatus && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle size={14} /> <span className="text-xs font-bold uppercase tracking-wider">{saveStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSave} className={`${btnColorClass} text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all border border-white/20 relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Push to Live</span>
        </motion.button>
      </div>
    </header>
  )

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-700 font-outfit overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-slate-900 font-medium text-xl">Command</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500"><Menu className="w-6 h-6" /></button>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block z-10 relative"><Sidebar /></div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 z-40 h-full">
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-20 lg:pt-0 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Social Data Hub" subtitle="Live hero section metrics" onSave={updateSocialData} colorClass="text-blue-600" btnColorClass="bg-gradient-to-r from-blue-600 to-indigo-600" />
              <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                <div className="max-w-5xl mx-auto space-y-8">
                  <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h3 className="text-slate-900 font-bold text-xl mb-8 flex items-center gap-3"><TrendingUp className="w-5 h-5 text-blue-600" /> Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block mb-3">Daily Transaction Volume</label>
                          <input type="text" value={socialData.transaction_volume || ''} onChange={e => setSocialData({ ...socialData, transaction_volume: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block mb-3">Growth / Split Values</label>
                          <input type="text" value={socialData.split_values || ''} onChange={e => setSocialData({ ...socialData, split_values: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block mb-3">Reviewed By Text</label>
                          <input type="text" value={socialData.reviewed_by || ''} onChange={e => setSocialData({ ...socialData, reviewed_by: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block mb-3">Social Proof Quote</label>
                          <textarea rows="3" value={socialData.social_proof || ''} onChange={e => setSocialData({ ...socialData, social_proof: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Preview Pane */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[32px] p-10 border border-blue-100 shadow-inner">
                    <h3 className="text-slate-900 font-bold text-lg mb-8 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600" /> Live Synchronized View</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">Transactions</p>
                        <p className="text-5xl font-outfit font-bold text-slate-900 tracking-tighter drop-shadow-sm">{socialData.transaction_volume}</p>
                      </div>
                      <div className="text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">Growth Rate</p>
                        <p className="text-5xl font-outfit font-bold text-slate-900 tracking-tighter drop-shadow-sm">{socialData.split_values}</p>
                      </div>
                      <div className="text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">Reviews</p>
                        <p className="text-5xl font-outfit font-bold text-slate-900 tracking-tighter drop-shadow-sm">{socialData.reviewed_by}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trusted' && (
            <motion.div key="trusted" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Client Roster" subtitle="Manage orbit testimonials" onSave={updateTrustedClients} colorClass="text-pink-600" btnColorClass="bg-gradient-to-r from-pink-600 to-rose-600" />
              <div className="px-8 lg:px-14 py-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button onClick={addNewClient} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"><Plus size={16} /> Mint New Client Node</button>
                <div className="flex items-center gap-4 bg-slate-50 p-2 pl-4 rounded-xl border border-slate-200">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-600">Total Clients Count</label>
                  <input type="text" value={siteSettings.trusted_clients_count || '1000+k'} onChange={e => setSiteSettings({ ...siteSettings, trusted_clients_count: e.target.value })} className="w-28 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none text-center" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatePresence>
                    {trustedClients.map((client, idx) => (
                      <motion.div key={client.id || idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-xl relative group">
                        <button onClick={() => removeClient(idx)} className="absolute top-5 right-5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all opacity-0 group-hover:opacity-100"><X size={16} /></button>
                        
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-pink-500/20 overflow-hidden shrink-0 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} alt="avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <input type="text" value={client.name || ''} onChange={e => { const updated = [...trustedClients]; updated[idx] = { ...updated[idx], name: e.target.value }; setTrustedClients(updated); }} className="w-full bg-transparent border-none text-2xl font-bold text-slate-900 placeholder-slate-300 focus:ring-0 outline-none mb-1" placeholder="Client Name" />
                            <input type="text" value={client.role || ''} onChange={e => { const updated = [...trustedClients]; updated[idx] = { ...updated[idx], role: e.target.value }; setTrustedClients(updated); }} className="w-full bg-transparent border-none text-xs uppercase tracking-widest text-pink-600 placeholder-pink-300 focus:ring-0 outline-none" placeholder="Role / Position" />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Orbit Ring</label>
                              <select value={client.ring || 'outer'} onChange={e => { const updated = [...trustedClients]; updated[idx] = { ...updated[idx], ring: e.target.value }; setTrustedClients(updated); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 appearance-none">
                                <option value="outer">Outer Orbit</option>
                                <option value="middle">Middle Orbit</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Testimonial Quote</label>
                            <textarea rows="2" value={client.text || ''} onChange={e => { const updated = [...trustedClients]; updated[idx] = { ...updated[idx], text: e.target.value }; setTrustedClients(updated); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 resize-none italic" placeholder="Enter quote..." />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'marketing' && (
            <motion.div key="marketing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Digital Assets" subtitle="Manage static content" onSave={updateSettings} colorClass="text-emerald-600" btnColorClass="bg-gradient-to-r from-emerald-600 to-teal-600" />
              <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl">
                    <h3 className="text-slate-900 font-bold text-xl mb-8 flex items-center gap-3"><Target className="w-5 h-5 text-emerald-600" /> Download App Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        {[['Section Title', 'download_title'], ['Subtitle', 'download_subtitle']].map(([label, key]) => (
                          <div key={key}>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-3">{label}</label>
                            <input type="text" value={siteSettings[key] || ''} onChange={e => setSiteSettings({ ...siteSettings, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-3">Description</label>
                        <textarea rows="6" value={siteSettings.download_desc || ''} onChange={e => setSiteSettings({ ...siteSettings, download_desc: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-slate-200">
                      {[['QR Code URL', 'qr_url'], ['Mobile UI Image URL', 'mobile_wallpaper']].map(([label, key]) => (
                        <div key={key}>
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-3">{label}</label>
                          <input type="text" value={siteSettings[key] || ''} onChange={e => setSiteSettings({ ...siteSettings, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[13px] font-mono text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl">
                    <h3 className="text-slate-900 font-bold text-xl mb-8 flex items-center gap-3"><TrendingUp className="w-5 h-5 text-emerald-600" /> Global Statistics Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map(num => (
                        <div key={num} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-2">Stat {num} Value</label>
                            <input type="text" value={siteSettings[`stat_${num}_value`] || ''} onChange={e => setSiteSettings({ ...siteSettings, [`stat_${num}_value`]: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-2">Stat {num} Label</label>
                            <input type="text" value={siteSettings[`stat_${num}_label`] || ''} onChange={e => setSiteSettings({ ...siteSettings, [`stat_${num}_label`]: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col overflow-hidden bg-white text-slate-900 z-20">
              <TopBar title="Active User Sessions" subtitle="Real-time tracking of user activity" onSave={syncData} colorClass="text-orange-600" btnColorClass="bg-gradient-to-r from-orange-500 to-red-500" />
              <div className="flex-1 overflow-y-auto p-6 lg:p-14 custom-scrollbar bg-[#f8fafc]">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                        <tr>
                          <th className="px-6 py-5">User</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5">Login Time</th>
                          <th className="px-6 py-5">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sessions.map(s => {
                          const login = new Date(s.first_seen + 'Z')
                          const lastSeen = new Date(s.last_seen + 'Z')
                          const isOnline = s.is_active === 1
                          const diffMinutes = Math.max(0, Math.floor((lastSeen - login) / 60000))
                          
                          return (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-5 font-bold text-slate-800">
                                {s.username === 'Anonymous' ? <span className="text-slate-400 italic">Guest Visitor</span> : s.username}
                              </td>
                              <td className="px-6 py-5">
                                {isOnline ? (
                                  <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active</span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Offline</span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-slate-600 text-sm font-medium">{login.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                              <td className="px-6 py-5 text-slate-600 text-sm font-medium flex items-center gap-2"><Clock size={16} className="text-slate-400" /> {diffMinutes} mins</td>
                            </tr>
                          )
                        })}
                        {sessions.length === 0 && (
                          <tr><td colSpan="4" className="text-center py-10 text-slate-500 font-medium">No sessions found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inquiries' && (
            <motion.div key="inquiries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] z-20">
              <TopBar title="Contact Inquiries" subtitle="Manage user consultation requests" onSave={syncData} colorClass="text-purple-600" btnColorClass="bg-gradient-to-r from-purple-600 to-fuchsia-600" />
              <div className="flex-1 overflow-y-auto p-6 lg:p-14 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6">
                  {contacts.map(contact => (
                    <div key={contact.id} className={`p-8 rounded-[24px] border transition-all shadow-sm ${contact.is_read ? 'bg-white border-slate-200' : 'bg-purple-50 border-purple-200 shadow-md shadow-purple-500/5'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            {contact.name}
                            {!contact.is_read && <span className="text-[9px] bg-purple-600 text-white px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">New</span>}
                          </h3>
                          <p className="text-purple-600 text-sm mt-1">{contact.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 text-xs font-medium">{new Date(contact.timestamp + 'Z').toLocaleString()}</p>
                          {!contact.is_read && (
                            <button onClick={() => markContactRead(contact.id)} className="mt-3 text-[10px] text-purple-600 border border-purple-200 hover:bg-purple-100 px-4 py-2 rounded-lg uppercase tracking-widest font-bold transition-all bg-white shadow-sm">Mark as Read</button>
                          )}
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-inner">
                        {contact.message}
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">No inquiries found.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

export default AdminPortal
