import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, CheckCircle, Clock, Plus, TrendingUp, Activity,
  User, LogOut, ChevronRight, Menu, X, PlusCircle, Layout,
  Layers, MessageCircle, Send
} from 'lucide-react'

const ProjectsPage = ({ onLogout, user }) => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
  const token = localStorage.getItem('token')
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const chatEndRef = useRef(null)

  const apiFetch = useCallback(async (url, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}${url}`, { ...options, headers: { ...authHeaders, ...(options.headers || {}) } })
      if (res.status === 401) { onLogout(); navigate('/'); return null }
      return res.ok ? res.json() : null
    } catch { return null }
  }, [API_BASE, token])

  const syncData = useCallback(async () => {
    if (!user) return
    const pData = await apiFetch(`/api/projects?user_id=${user.id}`)
    if (pData) {
      setProjects(pData)
      if (pData.length > 0 && !activeProjectId) setActiveProjectId(pData[0].id)
    }
    if (activeProjectId) {
      const tData = await apiFetch(`/api/projects/${activeProjectId}/tasks`)
      if (tData) setTasks(tData)
    }
    const mData = await apiFetch(`/api/messages?user_id=${user.id}`)
    if (mData) setMessages(mData)
    setLoading(false)
  }, [activeProjectId, user, apiFetch])

  useEffect(() => {
    syncData()
    const interval = setInterval(syncData, 3000)
    return () => clearInterval(interval)
  }, [syncData])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const createProject = async (e) => {
    e.preventDefault()
    if (!newProjectName || !user) return
    const data = await apiFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: newProjectName, description: 'Client initiated project.', user_id: user.id })
    })
    if (data) {
      setNewProjectName('')
      setShowProjectModal(false)
      setActiveProjectId(data.id)
      syncData()
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTaskName) return
    await apiFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ name: newTaskName, project_id: activeProjectId, is_requested: 1 })
    })
    setNewTaskName('')
    setShowTaskModal(false)
    syncData()
  }

  const removeTask = async (id) => {
    if (!confirm('Remove this task request?')) return
    await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' })
    syncData()
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!chatInput.trim || !chatInput || !user) return
    await apiFetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ sender: 'User', text: chatInput, user_id: user.id })
    })
    setChatInput('')
    syncData()
  }

  const handleLogout = () => { onLogout(); navigate('/') }
  const activeProject = projects.find(p => p.id === activeProjectId)
  const unreadCount = messages.filter(m => m.sender === 'Developer').length

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-[#1e4b8b] border-t-transparent rounded-full" />
    </div>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-[#1e4b8b] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <span className="text-[#1e4b8b] font-bold text-2xl tracking-tighter">CLIENT<span className="text-slate-300">HUB</span></span>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400"><X className="w-5 h-5" /></button>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">My Projects</p>
            <button onClick={() => setShowProjectModal(true)} className="p-1 hover:bg-white rounded-md transition-all text-[#1e4b8b]"><Plus className="w-4 h-4" /></button>
          </div>
          {projects.map(p => (
            <button key={p.id} onClick={() => { setActiveProjectId(p.id); setIsSidebarOpen(false) }}
              className={`w-full text-left p-4 rounded-2xl transition-all mb-2 flex items-center justify-between group ${activeProjectId === p.id ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100' : 'hover:bg-white/50 text-slate-400'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activeProjectId === p.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <span className={`text-sm font-medium ${activeProjectId === p.id ? 'text-slate-900' : ''}`}>{p.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeProjectId === p.id ? 'rotate-90 text-[#1e4b8b]' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
          {projects.length === 0 && <p className="text-slate-300 text-xs text-center py-4">No projects yet.</p>}
        </div>

        <div className="pt-8 border-t border-slate-100">
          <button onClick={() => setShowChat(true)} className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-slate-900 transition-all font-medium text-sm relative">
            <MessageCircle className="w-5 h-5" />
            Chat with Support
            {unreadCount > 0 && <span className="ml-auto bg-[#1e4b8b] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-red-400 hover:text-red-600 transition-all font-medium text-sm">
            <LogOut className="w-5 h-5" />Disconnect
          </button>
        </div>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-slate-800 font-outfit overflow-hidden flex">
      {/* Desktop Sidebar */}
      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="hidden lg:flex w-80 bg-slate-50 border-r border-slate-100 flex-col shrink-0">
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />
            <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="fixed left-0 top-0 h-full w-80 bg-slate-50 border-r border-slate-100 z-50 lg:hidden">
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 border-b border-slate-100 px-8 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter uppercase text-[#1e4b8b]">{activeProject?.name || 'Select a Project'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Status:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{activeProject?.status || '—'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowChat(true)} className="relative p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all">
              <MessageCircle className="w-5 h-5 text-slate-400" />
              {messages.some(m => m.sender === 'Developer') && <span className="absolute top-1 right-1 w-2 h-2 bg-[#1e4b8b] rounded-full animate-pulse" />}
            </button>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{user?.username}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Client Portal</span>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar bg-slate-50/20">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Build Progress</p>
              <h3 className="text-4xl font-bold tracking-tighter text-slate-900 mb-6">{activeProject?.progress || 0}%</h3>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${activeProject?.progress || 0}%` }} className="h-full bg-[#1e4b8b]" />
              </div>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Finance Status</p>
              <h3 className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${activeProject?.payment_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                {activeProject?.payment_status || '—'}
              </h3>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Contract</p>
              <h3 className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-3 italic">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                {activeProject?.contract_status || '—'}
              </h3>
            </motion.div>
          </div>

          {/* Task Board */}
          {activeProject && (
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><Activity className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tighter uppercase text-slate-900">Module Calibration</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">Live status of development units</p>
                  </div>
                </div>
                <button onClick={() => setShowTaskModal(true)} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                  <PlusCircle className="w-4 h-4" /> Request Module
                </button>
              </div>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-slate-50 group hover:border-slate-100 transition-all">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      {task.approved
                        ? <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"><CheckCircle className="w-5 h-5" /></div>
                        : <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[#1e4b8b]"><Clock className="w-5 h-5 animate-pulse" /></div>
                      }
                      <div>
                        <h4 className="font-bold text-slate-900 tracking-tight">{task.name}</h4>
                        {task.is_requested === 1 && <span className="text-[9px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100 font-bold uppercase">Your Request</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${task.approved ? 'text-emerald-500' : 'text-amber-500'}`}>{task.approved ? 'Completed' : task.status}</span>
                      {task.is_requested === 1 && !task.approved && (
                        <button onClick={() => removeTask(task.id)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-20 opacity-20">
                    <Layers className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Active Modules</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl">
              <h3 className="text-2xl font-bold tracking-tighter text-[#1e4b8b] mb-8">NEW PROJECT</h3>
              <form onSubmit={createProject} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-2">Project Name</label>
                  <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-[#1e4b8b] outline-none transition-all" placeholder="e.g. Genesis Platform" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Create</button>
                  <button type="button" onClick={() => setShowProjectModal(false)} className="px-6 py-4 border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl">
              <h3 className="text-2xl font-bold tracking-tighter text-emerald-600 mb-8">REQUEST MODULE</h3>
              <form onSubmit={addTask} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-2">Module Description</label>
                  <input value={newTaskName} onChange={e => setNewTaskName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Payment Integration" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Request</button>
                  <button type="button" onClick={() => setShowTaskModal(false)} className="px-6 py-4 border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChat(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative z-10 bg-white w-full md:max-w-lg rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col h-[70vh] md:h-[600px]">
              <div className="p-6 bg-[#1e4b8b] rounded-t-[40px] md:rounded-t-[40px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-white font-bold text-sm uppercase tracking-widest">Developer Support</p>
                    <p className="text-white/60 text-[9px] uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.sender === 'User' ? 'bg-[#1e4b8b] text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-40 mt-1 block">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <div className="h-full flex items-center justify-center text-slate-300 text-sm">No messages yet. Say hello!</div>}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-6 border-t border-slate-100 bg-white rounded-b-[40px] flex gap-3">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#1e4b8b] transition-all" />
                <button type="submit" className="bg-[#1e4b8b] text-white p-3 rounded-2xl hover:bg-blue-700 transition-all"><Send className="w-5 h-5" /></button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  )
}

export default ProjectsPage
