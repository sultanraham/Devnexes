import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, CheckCircle, Briefcase, TrendingUp, X, Settings,
  Activity, Cpu, Send, Menu, Users, Search, Clock, LogOut, User, Plus, Target
} from 'lucide-react'

const AdminPortal = ({ onLogout }) => {
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
  const token = localStorage.getItem('token')
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [activeTab, setActiveTab] = useState('projects')
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [siteSettings, setSiteSettings] = useState({ download_title: '', download_subtitle: '', download_desc: '', qr_url: '', mobile_wallpaper: '' })
  const chatEndRef = useRef(null)

  const apiFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers: { ...authHeaders, ...(options.headers || {}) } })
    if (res.status === 401) { onLogout(); navigate('/'); return null }
    return res.ok ? res.json() : null
  }, [API_BASE, token])

  const syncData = useCallback(async () => {
    const cData = await apiFetch('/api/admin/users')
    if (cData) {
      setClients(cData)
      if (cData.length > 0 && !selectedClientId) setSelectedClientId(cData[0].id)
    }

    const sData = await apiFetch('/api/settings')
    if (sData) setSiteSettings(sData)

    if (selectedClientId) {
      const pData = await apiFetch(`/api/projects?user_id=${selectedClientId}`)
      if (pData) {
        setProjects(pData)
        if (pData.length > 0 && !activeProjectId) setActiveProjectId(pData[0].id)
      }

      if (activeProjectId) {
        const tData = await apiFetch(`/api/projects/${activeProjectId}/tasks`)
        if (tData) setTasks(tData)
      } else {
        setTasks([])
      }

      const mData = await apiFetch(`/api/messages?user_id=${selectedClientId}`)
      if (mData) setMessages(mData)
    }
    setLoading(false)
  }, [selectedClientId, activeProjectId, apiFetch])

  useEffect(() => {
    syncData()
    const interval = setInterval(syncData, 3000)
    return () => clearInterval(interval)
  }, [syncData])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendReply = async (e) => {
    e.preventDefault()
    if (!chatInput.trim() || !selectedClientId) return
    await apiFetch('/api/messages', { method: 'POST', body: JSON.stringify({ sender: 'Developer', text: chatInput, user_id: selectedClientId }) })
    setChatInput('')
    syncData()
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTaskName || !activeProjectId) return
    await apiFetch('/api/tasks', { method: 'POST', body: JSON.stringify({ project_id: activeProjectId, name: newTaskName }) })
    setNewTaskName('')
    setShowAddTask(false)
    syncData()
  }

  const approveProject = async (id) => {
    await apiFetch(`/api/projects/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'Active', progress: 15 }) })
    syncData()
  }

  const updateProgress = async (id, progress) => {
    await apiFetch(`/api/projects/${id}/status`, { method: 'PUT', body: JSON.stringify({ progress }) })
    syncData()
  }

  const updateFinance = async (id, field, value) => {
    await apiFetch(`/api/projects/${id}/status`, { method: 'PUT', body: JSON.stringify({ [field]: value }) })
    syncData()
  }

  const approveTask = async (taskId) => {
    await apiFetch(`/api/tasks/${taskId}/approve`, { method: 'PUT' })
    syncData()
  }

  const removeTask = async (id) => {
    await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' })
    syncData()
  }

  const updateSettings = async () => {
    const res = await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(siteSettings) })
    if (res) alert('Marketing Hub Updated!')
  }

  const handleLogout = () => { onLogout(); navigate('/') }

  const filteredClients = clients.filter(c => c.username.toLowerCase().includes(searchTerm.toLowerCase()))
  const activeProject = projects.find(p => p.id === activeProjectId)
  const selectedClient = clients.find(c => c.id === selectedClientId)

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Cpu className="w-8 h-8 text-[#1e4b8b] animate-pulse" />
    </div>
  )

  const Sidebar = () => (
    <div className="w-80 h-full bg-white border-r border-slate-100 flex flex-col p-8">
      <div className="flex items-center justify-between lg:block mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#1e4b8b]" />
          <div>
            <span className="text-[#1e4b8b] font-medium text-lg tracking-tighter block leading-none">ADMIN</span>
            <span className="text-slate-300 text-[8px] font-medium uppercase tracking-[0.4em] mt-1 block">Command Hub</span>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X className="w-6 h-6" /></button>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search Clients..." className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-3 text-xs font-medium outline-none focus:border-[#1e4b8b] transition-all" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('projects')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-[#1e4b8b] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Clients</button>
          <button onClick={() => setActiveTab('marketing')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'marketing' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>Marketing</button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        {activeTab === 'projects' && (
          <>
            <div>
              <p className="text-slate-300 text-[9px] font-medium uppercase tracking-widest mb-4 px-2">Clients ({filteredClients.length})</p>
              {filteredClients.map(client => (
                <button key={client.id} onClick={() => { setSelectedClientId(client.id); setActiveProjectId(null) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${selectedClientId === client.id ? 'bg-[#1e4b8b] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                  <User className="w-4 h-4" />
                  <span className="text-[13px] font-medium truncate">{client.username}</span>
                </button>
              ))}
            </div>
            <div>
              <p className="text-slate-300 text-[9px] font-medium uppercase tracking-widest mb-4 px-2">Projects</p>
              {projects.map(project => (
                <button key={project.id} onClick={() => setActiveProjectId(project.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all mb-1 flex items-center gap-3 ${activeProjectId === project.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                  <Briefcase className="w-4 h-4" />
                  <span className="text-[12px] font-medium truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition-all font-medium text-xs w-full p-2">
          <LogOut className="w-4 h-4" /><span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-600 font-outfit overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#1e4b8b]" />
          <span className="text-[#1e4b8b] font-medium text-xl">Command</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400"><Menu className="w-6 h-6" /></button>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 z-40 h-full shadow-xl">
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-20 lg:pt-0">
        {activeTab === 'projects' ? (
          <>
            <header className="min-h-[100px] lg:h-28 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-4 lg:py-0 bg-white gap-4">
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <h1 className="text-[#1e4b8b] text-2xl lg:text-3xl font-medium tracking-tighter uppercase">{activeProject?.name || 'No Project Selected'}</h1>
                  {activeProject && (
                    <span className={`text-[8px] font-medium px-2 py-1 rounded-md uppercase tracking-widest border ${activeProject.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{activeProject.status}</span>
                  )}
                </div>
                <p className="text-slate-300 text-[10px] font-medium uppercase tracking-[0.4em]">Client: {selectedClient?.username || 'None'}</p>
              </div>
              {activeProject && (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-[#1e4b8b] font-medium text-xl">{activeProject.progress}%</span>
                    <div className="flex gap-1 ml-2">
                      {[0, 25, 50, 75, 100].map(v => (
                        <button key={v} onClick={() => updateProgress(activeProject.id, v)} className={`text-[9px] px-2 py-1 rounded-md border font-bold transition-all ${activeProject.progress === v ? 'bg-[#1e4b8b] text-white border-[#1e4b8b]' : 'border-slate-100 text-slate-400 hover:border-[#1e4b8b]'}`}>{v}%</button>
                      ))}
                    </div>
                  </div>
                  <div className="w-48 h-1 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${activeProject.progress}%` }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              )}
            </header>

            <div className="flex-1 p-6 lg:p-12 overflow-y-auto grid grid-cols-1 xl:grid-cols-3 gap-8 custom-scrollbar bg-slate-50/30">
              {activeProject ? (
                <>
                  <div className="xl:col-span-2 space-y-8">
                    {/* Finance Controls */}
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#1e4b8b] mb-6 flex items-center gap-3"><Activity className="w-4 h-4" /> Finance & Contract</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Payment</p>
                          <div className="flex gap-2">
                            {['Unpaid', 'Paid'].map(v => (
                              <button key={v} onClick={() => updateFinance(activeProject.id, 'payment_status', v)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${activeProject.payment_status === v ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-100 text-slate-400 hover:border-emerald-200'}`}>{v}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Contract</p>
                          <div className="flex gap-2">
                            {['Pending', 'Signed'].map(v => (
                              <button key={v} onClick={() => updateFinance(activeProject.id, 'contract_status', v)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${activeProject.contract_status === v ? 'bg-[#1e4b8b] text-white border-[#1e4b8b]' : 'border-slate-100 text-slate-400 hover:border-blue-200'}`}>{v}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Project Status</p>
                          <div className="flex gap-2">
                            {['Pending Approval', 'Active'].map(v => (
                              <button key={v} onClick={() => updateFinance(activeProject.id, 'status', v)} className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${activeProject.status === v ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-100 text-slate-400 hover:border-amber-200'}`}>{v === 'Pending Approval' ? 'Pending' : v}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task Control */}
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-medium uppercase tracking-tighter flex items-center gap-4 text-[#1e4b8b]"><Activity className="w-5 h-5" /> Module Control</h3>
                        <button onClick={() => setShowAddTask(!showAddTask)} className="flex items-center gap-2 bg-[#1e4b8b] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                          <Plus className="w-4 h-4" /> Add Task
                        </button>
                      </div>

                      <AnimatePresence>
                        {showAddTask && (
                          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={addTask} className="flex gap-3 mb-6 overflow-hidden">
                            <input value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="Task name..." className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1e4b8b] transition-all" />
                            <button type="submit" className="bg-[#1e4b8b] text-white px-6 rounded-xl text-xs font-bold uppercase">Add</button>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        {tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                              {task.approved ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-amber-400" />}
                              <div>
                                <span className={`text-sm font-medium ${task.approved ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.name}</span>
                                {task.is_requested === 1 && <span className="ml-2 text-[9px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100 font-bold uppercase">Client Request</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!task.approved && <button onClick={() => approveTask(task.id)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"><CheckCircle className="w-4 h-4" /></button>}
                              <button onClick={() => removeTask(task.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))}
                        {tasks.length === 0 && <p className="text-center text-slate-300 text-sm py-8">No tasks. Add one above.</p>}
                      </div>
                    </div>
                  </div>

                  {/* Chat */}
                  <div className="space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm h-[580px] flex flex-col">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#1e4b8b] mb-6">Client Chat — {selectedClient?.username}</h3>
                      <div className="flex-1 overflow-y-auto space-y-3 mb-6 custom-scrollbar pr-2">
                        {messages.map((m, i) => (
                          <div key={i} className={`p-3 rounded-xl text-xs ${m.sender === 'Developer' ? 'bg-blue-50 text-blue-700 ml-4' : 'bg-slate-50 text-slate-600 mr-4'}`}>
                            <p className="font-medium">{m.sender}</p>
                            <p className="mt-0.5">{m.text}</p>
                            <p className="text-[9px] opacity-40 mt-1">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        ))}
                        {messages.length === 0 && <p className="text-center text-slate-300 text-xs py-8">No messages yet.</p>}
                        <div ref={chatEndRef} />
                      </div>
                      <form onSubmit={sendReply} className="flex gap-2">
                        <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs outline-none" placeholder="Reply to client..." />
                        <button type="submit" className="bg-[#1e4b8b] text-white p-2 rounded-xl"><Send className="w-4 h-4" /></button>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-full h-full flex flex-col items-center justify-center text-center p-20 bg-white/50 border border-dashed border-slate-200 rounded-[40px]">
                  <Briefcase className="w-12 h-12 text-slate-200 mb-6" />
                  <p className="text-slate-400 font-medium">Select a client and project from the sidebar.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            <header className="h-24 lg:h-32 border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 bg-white shrink-0">
              <div>
                <h1 className="text-emerald-600 text-2xl lg:text-3xl font-medium tracking-tighter uppercase">Marketing Hub</h1>
                <p className="text-slate-300 text-[9px] font-medium uppercase tracking-[0.4em] mt-1">Manage public assets</p>
              </div>
              <button onClick={updateSettings} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Save Settings</button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                  <h3 className="text-[#1e4b8b] font-bold text-lg mb-8 flex items-center gap-3"><Target className="w-5 h-5" /> Download Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {[['Section Title', 'download_title'], ['Subtitle', 'download_subtitle']].map(([label, key]) => (
                        <div key={key}>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
                          <input type="text" value={siteSettings[key] || ''} onChange={e => setSiteSettings({ ...siteSettings, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 transition-all outline-none" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Description</label>
                      <textarea rows="5" value={siteSettings.download_desc || ''} onChange={e => setSiteSettings({ ...siteSettings, download_desc: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 transition-all outline-none resize-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-slate-50">
                    {[['QR Code URL', 'qr_url'], ['Mobile UI Image URL', 'mobile_wallpaper']].map(([label, key]) => (
                      <div key={key}>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
                        <input type="text" value={siteSettings[key] || ''} onChange={e => setSiteSettings({ ...siteSettings, [key]: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono focus:border-emerald-500 transition-all outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

export default AdminPortal
