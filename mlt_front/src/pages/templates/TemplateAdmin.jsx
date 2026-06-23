import React, { useState } from 'react';
import { 
  Users, Shield, Settings, Database, Activity, Plus, Search, 
  Filter, ChevronRight, School, BookOpen, AlertTriangle, 
  ArrowUpRight, BarChart3, Lock, RefreshCw, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const TemplateAdmin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data for charts
  const statsData = [
    { name: 'Jan', Inscriptions: 140, Requetes: 2400 },
    { name: 'Fév', Inscriptions: 220, Requetes: 4500 },
    { name: 'Mar', Inscriptions: 380, Requetes: 7800 },
    { name: 'Avr', Inscriptions: 512, Requetes: 12000 },
    { name: 'Mai', Inscriptions: 620, Requetes: 15400 },
    { name: 'Juin', Inscriptions: 890, Requetes: 21000 },
  ];

  // User management mock data
  const [users, setUsers] = useState([
    { id: 1, name: "Jean Dupont", email: "jean.dupont@ecole.fr", role: "Enseignant", school: "Jules Ferry Paris", status: "Actif" },
    { id: 2, name: "Sophie Martin", email: "sophie.m@parent.com", role: "Parent", school: "N/A", status: "Actif" },
    { id: 3, name: "Marc Lambert", email: "m.lambert@lycee.fr", role: "Enseignant", school: "Albert Camus Lyon", status: "En attente" },
    { id: 4, name: "Julie Roche", email: "julie.roche@gmail.com", role: "Admin", school: "N/A", status: "Actif" },
    { id: 5, name: "Arthur Vane", email: "arthur@eleve.fr", role: "Enfant", school: "Jules Ferry Paris", status: "Suspendu" }
  ]);

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Actif' ? 'Suspendu' : 'Actif';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background neon blur lights */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Top Header Card */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-3.5xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Shield size={28} />
            </div>
            <div>
              <div className="text-xs font-black text-sky-400 uppercase tracking-widest mb-1">Système MLT</div>
              <h1 className="text-3xl font-extrabold tracking-tight">Console d'Administration</h1>
              <p className="text-slate-400 text-sm">Gestion centrale, statistiques système et contrôle des accès.</p>
            </div>
          </div>

          {/* Controls & Server Status */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-slate-850">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">API: 99.8% Online</span>
            </div>
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-sky-600/20 active:scale-95 transition-all cursor-pointer">
              <Plus size={14} /> Nouvelle École
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard icon={<Users className="text-sky-400" />} title="Inscriptions Globales" value="1,248" change="+14% ce mois" color="sky" />
          <AdminStatCard icon={<School className="text-indigo-400" />} title="Écoles Partenaires" value="42" change="+3 nouvelles" color="indigo" />
          <AdminStatCard icon={<BookOpen className="text-purple-400" />} title="Banque de Questions" value="8,490" change="98% validées" color="purple" />
          <AdminStatCard icon={<Database className="text-emerald-400" />} title="Taille Base de Données" value="1.2 GB" change="Sauvegarde automatique OK" color="emerald" />
        </div>

        {/* Main Section: Graph + Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Dashboard Info (Left/Middle) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Block */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-200">Croissance de la Plateforme</h3>
                  <p className="text-xs text-slate-500">Flux d'inscriptions comparé aux requêtes API mensuelles.</p>
                </div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2 h-2 rounded-full bg-sky-500" /> Inscriptions</span>
                  <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Requêtes</span>
                </div>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <defs>
                      <linearGradient id="colorIns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="Inscriptions" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorIns)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interactive Users List */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
              
              <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-200">Gestion des Comptes</h3>
                  <p className="text-xs text-slate-500">Activez, suspendez ou modifiez les accès des utilisateurs.</p>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filtrer par nom..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl w-full outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/60 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                      <th className="py-4 px-6">Identité</th>
                      <th className="py-4 px-6">Rôle</th>
                      <th className="py-4 px-6">École</th>
                      <th className="py-4 px-6 text-center">Statut</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                      <tr key={user.id} className="border-b border-slate-850 hover:bg-slate-900/20 transition-all duration-150">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-slate-200 text-sm">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                            user.role === 'Admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25' :
                            user.role === 'Enseignant' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25' :
                            user.role === 'Parent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/25' :
                            'bg-sky-500/10 text-sky-400 border-sky-500/25'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400">{user.school}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            user.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-400' :
                            user.status === 'En attente' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className="text-[10px] font-black uppercase px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-sky-500 hover:text-sky-400 text-slate-400 rounded-xl transition cursor-pointer"
                          >
                            {user.status === 'Actif' ? 'Suspendre' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          {/* Right Sidebar: Operations & Health */}
          <div className="space-y-6">
            
            {/* System Health */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="font-extrabold text-slate-200 flex items-center gap-2">
                <Activity size={18} className="text-sky-400" /> État Système
              </h3>
              
              <div className="space-y-3.5">
                <HealthMetric title="CPU Usage" value="28%" status="normal" />
                <HealthMetric title="Mémoire RAM" value="44%" status="normal" />
                <HealthMetric title="Latence API" value="48 ms" status="normal" />
                <HealthMetric title="Taux d'erreur" value="0.04%" status="normal" />
              </div>
            </div>

            {/* Alerts & Logs */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-slate-200 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-400" /> Activités Récentes
                </h3>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>

              <div className="space-y-4">
                <LogItem time="Il y a 2m" text="Nouvel établissement enregistré : Jules Ferry Paris." type="success" />
                <LogItem time="Il y a 15m" text="Échec de connexion suspect (IP: 184.22.90.1)." type="warning" />
                <LogItem time="Il y a 1h" text="Sauvegarde automatique hebdomadaire complétée." type="info" />
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/10 p-6 rounded-3xl">
              <h3 className="font-extrabold text-indigo-300 text-sm uppercase tracking-wider mb-4">Actions Rapides</h3>
              <div className="grid gap-2">
                <button className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-sky-500/30 text-xs font-bold rounded-xl transition cursor-pointer text-left px-4 flex justify-between items-center">
                  <span>Configuration SMTP</span>
                  <ChevronRight size={14} className="text-slate-500" />
                </button>
                <button className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-sky-500/30 text-xs font-bold rounded-xl transition cursor-pointer text-left px-4 flex justify-between items-center">
                  <span>Historique des audits</span>
                  <ChevronRight size={14} className="text-slate-500" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, title, value, change, color }) => {
  const colorMap = {
    sky: "border-sky-500/15 from-sky-500/10 to-transparent text-sky-400",
    indigo: "border-indigo-500/15 from-indigo-500/10 to-transparent text-indigo-400",
    purple: "border-purple-500/15 from-purple-500/10 to-transparent text-purple-400",
    emerald: "border-emerald-500/15 from-emerald-500/10 to-transparent text-emerald-400"
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border p-6 rounded-2.5xl flex items-center gap-4 hover:shadow-xl transition-all duration-300`}>
      <div className="p-3 bg-slate-950 rounded-2xl">
        {icon}
      </div>
      <div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</span>
        <h4 className="text-2xl font-black text-slate-200 mt-0.5 tracking-tight">{value}</h4>
        <p className="text-[10px] text-slate-400 font-medium mt-1">{change}</p>
      </div>
    </div>
  );
};

const HealthMetric = ({ title, value, status }) => (
  <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-900">
    <span className="text-xs text-slate-400 font-medium">{title}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-200">{value}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    </div>
  </div>
);

const LogItem = ({ time, text, type }) => {
  const color = type === 'warning' ? 'text-amber-400' : type === 'success' ? 'text-emerald-400' : 'text-sky-400';
  return (
    <div className="p-3 bg-slate-950/30 border border-slate-900/60 rounded-xl space-y-1">
      <div className="flex justify-between text-[9px] font-bold">
        <span className={`${color} uppercase`}>{type}</span>
        <span className="text-slate-500">{time}</span>
      </div>
      <p className="text-xs text-slate-300 leading-normal">{text}</p>
    </div>
  );
};

export default TemplateAdmin;
