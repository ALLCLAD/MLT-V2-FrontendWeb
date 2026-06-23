import React, { useState } from 'react';
import { 
  Users, BookOpen, Calendar, Award, TrendingUp, Plus, 
  Search, Filter, ChevronRight, Mail, AlertCircle, Clock, 
  MoreVertical, BookOpenCheck, CheckCircle2, UserCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const TemplateEnseignant = () => {
  const [selectedClass, setSelectedClass] = useState('CM2-B');
  const [searchQuery, setSearchQuery] = useState('');

  const classPerformanceData = [
    { name: 'Lun', 'Moyenne': 12.5, 'Exercices': 18 },
    { name: 'Mar', 'Moyenne': 14.2, 'Exercices': 24 },
    { name: 'Mer', 'Moyenne': 13.8, 'Exercices': 12 },
    { name: 'Jeu', 'Moyenne': 15.0, 'Exercices': 30 },
    { name: 'Ven', 'Moyenne': 15.5, 'Exercices': 28 },
  ];

  const students = [
    { id: 1, name: "Léa Martin", lastScore: "17/20", progress: "+1.5", completed: 8, status: "excellent" },
    { id: 2, name: "Lucas Dubois", lastScore: "14/20", progress: "+0.8", completed: 7, status: "good" },
    { id: 3, name: "Emma Bernard", lastScore: "09/20", progress: "-0.5", completed: 4, status: "critical" },
    { id: 4, name: "Nathan Petit", lastScore: "12/20", progress: "+0.2", completed: 6, status: "good" },
  ];

  const lessons = [
    { id: 1, title: "Introduction aux Fractions", chapter: "Nombres & Calculs", activeStudents: 22, level: "CM2" },
    { id: 2, title: "Les polygones réguliers", chapter: "Géométrie", activeStudents: 18, level: "CM2" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/80 backdrop-blur-md">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> Portail Enseignant
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, Mme. Durand</h1>
            <p className="text-slate-400 text-sm mt-1">Voici l'état actuel de votre classe en temps réel.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option>CM2-A</option>
              <option>CM2-B</option>
              <option>CM1-A</option>
            </select>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer">
              <Plus size={16} /> Nouvelle leçon
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Users />} title="Total Élèves" value="24" subtitle="4 nouveaux admis" color="indigo" />
          <StatCard icon={<Award />} title="Moyenne Générale" value="13.8/20" subtitle="+0.6pts ce mois" color="amber" />
          <StatCard icon={<BookOpenCheck />} title="Exercices Résolus" value="184" subtitle="92% de taux de succès" color="emerald" />
          <StatCard icon={<Clock />} title="Temps Moyen / Élève" value="42 min" subtitle="Session quotidienne moyenne" color="sky" />
        </div>

        {/* Core Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left/Middle) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Area */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-200">Activité & Résultats</h3>
                  <p className="text-xs text-slate-500">Moyenne des notes quotidiennes par rapport au volume d'exercices.</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Moyenne</span>
                  <span className="flex items-center gap-1.5 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500" /> Volume</span>
                </div>
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={classPerformanceData}>
                    <defs>
                      <linearGradient id="colorMoy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="Moyenne" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMoy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Students List Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-200">Suivi des Élèves ({selectedClass})</h3>
                  <p className="text-xs text-slate-500">Statistiques rapides et progression globale.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Chercher un élève..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl w-full sm:w-48 outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/60 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                      <th className="py-4 px-6">Élève</th>
                      <th className="py-4 px-6 text-center">Dernier Score</th>
                      <th className="py-4 px-6 text-center">Progression</th>
                      <th className="py-4 px-6 text-center">Ex. Complétés</th>
                      <th className="py-4 px-6">Statut</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                      <tr key={student.id} className="border-b border-slate-850 hover:bg-slate-900/20 transition-all duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-500/10 text-indigo-400 font-extrabold rounded-xl flex items-center justify-center text-sm border border-indigo-500/15">
                              {student.name[0]}
                            </div>
                            <span className="font-bold text-slate-200 text-sm">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-extrabold text-slate-200 text-sm">{student.lastScore}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                            student.progress.startsWith('+') ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'
                          }`}>
                            {student.progress}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-400 text-sm">{student.completed} / 10</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            student.status === 'excellent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            student.status === 'good' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                          }`}>
                            {student.status === 'excellent' && 'Parfait'}
                            {student.status === 'good' && 'Stable'}
                            {student.status === 'critical' && 'À soutenir'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <h3 className="font-extrabold text-slate-200 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-400" /> Cours Actifs
              </h3>
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl hover:border-indigo-500/20 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {lesson.level} - {lesson.chapter}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-200 group-hover:text-indigo-300 transition">{lesson.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5">
                      <UserCheck size={12} /> {lesson.activeStudents} élèves ont complété
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timetable Widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <h3 className="font-extrabold text-slate-200 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" /> À Venir
              </h3>
              <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-6">
                
                <TimelineItem 
                  time="Aujourd'hui, 14:00" 
                  title="Session de soutien" 
                  desc="Calcul avec fractions - Groupe B" 
                  badge="Soutien" 
                  badgeColor="rose" 
                />
                
                <TimelineItem 
                  time="Jeudi 25 Juin, 10:00" 
                  title="Quiz hebdomadaire" 
                  desc="Publication automatique de l'exercice 4" 
                  badge="Exercice" 
                  badgeColor="indigo" 
                />

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorMap = {
    indigo: "from-indigo-500/10 to-indigo-600/5 text-indigo-400 border-indigo-500/15",
    amber: "from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-500/15",
    emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/15",
    sky: "from-sky-500/10 to-sky-600/5 text-sky-400 border-sky-500/15",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-2.5xl border flex items-center gap-4 hover:shadow-xl transition-all duration-300`}>
      <div className="p-3.5 bg-slate-950 rounded-2xl">
        {icon}
      </div>
      <div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</span>
        <h4 className="text-2xl font-black text-slate-200 mt-0.5 tracking-tight">{value}</h4>
        <p className="text-[10px] text-slate-500 font-medium mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc, badge, badgeColor }) => {
  const badgeColors = {
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <div className="relative">
      <div className="absolute w-3 h-3 bg-slate-900 rounded-full -left-[22.5px] border-2 border-indigo-500" />
      <span className="text-[10px] text-slate-500 font-bold">{time}</span>
      <h5 className="font-bold text-sm text-slate-200 mt-1 leading-tight">{title}</h5>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-2 border ${badgeColors[badgeColor]}`}>
        {badge}
      </span>
    </div>
  );
};

export default TemplateEnseignant;
