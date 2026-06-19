import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Plus, 
  TrendingUp, 
  Activity,
  User,
  LogOut,
  ChevronRight,
  Target,
  Menu,
  X,
  PlusCircle,
  Layout,
  Layers,
  Settings
} from 'lucide-react'

const ProjectsPage = ({ onLogout, user }) => {
  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '');
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const syncData = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(`${API_BASE}/api/projects?user_id=${user.id}`)
      const data = await res.json()
      setProjects(data)
      if (data.length > 0 && !activeProjectId) setActiveProjectId(data[0].id)
      
      if (activeProjectId) {
        const tRes = await fetch(`${API_BASE}/api/projects/${activeProjectId}/tasks`)
        const tData = await tRes.json()
        setTasks(tData)
      }
      setLoading(false)
    } catch (err) { console.error(err) }
  }, [activeProjectId, user, API_BASE])

  useEffect(() => {
    syncData()
    const interval = setInterval(syncData, 3000)
    return () => clearInterval(interval)
  }, [syncData])

  const createProject = async (e) => {
    e.preventDefault()
    if (!newProjectName || !user) return
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: 'Client initiated project core.', user_id: user.id })
      })
      const data = await res.json()
      setNewProjectName('')
      setShowProjectModal(false)
      setActiveProjectId(data.id)
      syncData()
    } catch (err) { console.error(err) }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTaskName) return
    try {
      await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newTaskName, 
          status: 'Pending', 
          project_id: activeProjectId,
          is_requested: 1,
          assignee: 'Elite Studio',
          due_date: 'TBD',
          priority: 'Strategic'
        })
      })
      setNewTaskName('')
      setShowTaskModal(false)
      syncData()
    } catch (err) { console.error(err) }
  }

  const removeTask = async (id) => {
    if (!confirm('Are you sure you want to remove this functionality?')) return
    try {
      await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' })
      syncData()
    } catch (err) { console.error(err) }
  }

  const activeProject = projects.find(p => p.id === activeProjectId)

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-slate-800 font-outfit overflow-hidden flex">
      {/* Sidebar (Modern Desktop) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-80 bg-slate-50 border-r border-slate-100 flex-col p-8 shrink-0"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#1e4b8b] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <span className="text-[#1e4b8b] font-bold text-2xl tracking-tighter">CLIENT<span className="text-slate-300">HUB</span></span>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Active Ecosystems</p>
              <button onClick={() => setShowProjectModal(true)} className="p-1 hover:bg-white rounded-md transition-all text-[#1e4b8b]"><Plus className="w-4 h-4" /></button>
            </div>
            {projects.map(p => (
              <button 
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all mb-2 flex items-center justify-between group ${activeProjectId === p.id ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100' : 'hover:bg-white/50 text-slate-400'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activeProjectId === p.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <span className={`text-sm font-medium ${activeProjectId === p.id ? 'text-slate-900' : ''}`}>{p.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeProjectId === p.id ? 'rotate-90 text-[#1e4b8b]' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-4">Strategic Access</p>
            <button className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-slate-900 transition-all font-medium text-sm">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 text-red-400 hover:text-red-600 transition-all font-medium text-sm">
              <LogOut className="w-5 h-5" />
              Disconnect
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 border-b border-slate-100 px-8 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter uppercase text-[#1e4b8b]">{activeProject?.name || 'Project Blueprint'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Phase:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{activeProject?.status || 'Deployment'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{user?.username}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Strategic Partner</span>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar bg-slate-50/20">
          
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="w-12 h-12" /></div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Build Progress</p>
              <h3 className="text-4xl font-bold tracking-tighter text-slate-900 mb-6">{activeProject?.progress || 0}%</h3>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${activeProject?.progress || 0}%` }} className="h-full bg-[#1e4b8b]" />
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Finance Status</p>
              <h3 className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${activeProject?.payment_status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                {activeProject?.payment_status || 'Pending Verification'}
              </h3>
              <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">Next Invoice: 15th July</p>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">Strategic Contract</p>
              <h3 className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-3 italic">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                {activeProject?.contract_status || 'Under Review'}
              </h3>
              <button className="text-[10px] font-bold text-[#1e4b8b] uppercase tracking-widest mt-4 hover:underline">View Agreement</button>
            </motion.div>
          </div>

          {/* Task Board */}
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><Activity className="w-6 h-6 text-emerald-600" /></div>
                <div>
                  <h3 className="text-xl font-bold tracking-tighter uppercase text-slate-900">Module Calibration</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">Live status of active development units</p>
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
                    {task.approved ? (
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"><CheckCircle className="w-5 h-5" /></div>
                    ) : (
                      <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[#1e4b8b]"><Clock className="w-5 h-5 animate-pulse" /></div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight">{task.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-[#1e4b8b] uppercase tracking-widest">{task.priority || 'High'}</span>
                        <span className="text-slate-200">•</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.assignee || 'Elite Studio'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Status</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${task.approved ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {task.status || (task.approved ? 'Completed' : 'Calibrating')}
                      </span>
                    </div>
                    {task.is_requested === 1 && !task.approved && (
                       <button onClick={() => removeTask(task.id)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-20 opacity-20">
                  <Layers className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">No Active Modules Detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl">
              <h3 className="text-2xl font-bold tracking-tighter text-[#1e4b8b] mb-8">INITIATE ECOSYSTEM</h3>
              <form onSubmit={createProject} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-2">Project Identity</label>
                  <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-[#1e4b8b] outline-none transition-all" placeholder="e.g. Genesis Platform" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Launch</button>
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block mb-2">Module Requirement</label>
                  <input value={newTaskName} onChange={e => setNewTaskName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Payment Integration Layer" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Request</button>
                  <button type="button" onClick={() => setShowTaskModal(false)} className="px-6 py-4 border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                </div>
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
