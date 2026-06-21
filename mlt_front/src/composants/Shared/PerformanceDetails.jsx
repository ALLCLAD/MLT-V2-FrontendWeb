import React, { useState } from 'react';
import { 
    Clock, 
    BookOpen, 
    TrendingUp, 
    Star, 
    Activity, 
    LayoutGrid, 
    List, 
    ChevronDown, 
    BarChart3,
    History as HistoryIcon
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';

const PerformanceDetails = ({ data }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [graphType, setGraphType] = useState('notes'); // 'notes' ou 'exercices'
    const [showAllHistory, setShowAllHistory] = useState(false);

    if (!data) return null;

    const { 
        stats_par_theme, 
        historique, 
        progression_notes, 
        progression_exercices 
    } = data;

    const displayedHistory = showAllHistory ? historique : historique.slice(0, 5);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            
            {/* 1. SECTION GRAPHIQUE COMMUTABLE */}
            <div className="bg-base-100 p-8 rounded-[3rem] border border-base-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Analyse de Progression</h3>
                            <p className="text-xs opacity-40 font-bold italic">Visualisez l'évolution des performances</p>
                        </div>
                    </div>

                    <div className="join bg-base-200 p-1 rounded-2xl">
                        <button 
                            onClick={() => setGraphType('notes')}
                            className={`btn btn-sm join-item border-none px-6 ${graphType === 'notes' ? 'btn-primary shadow-md' : 'btn-ghost'}`}
                        >
                            Notes / 20
                        </button>
                        <button 
                            onClick={() => setGraphType('exercices')}
                            className={`btn btn-sm join-item border-none px-6 ${graphType === 'exercices' ? 'btn-primary shadow-md' : 'btn-ghost'}`}
                        >
                            Activité
                        </button>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {graphType === 'notes' ? (
                            <LineChart data={progression_notes}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    domain={[0, 20]} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} 
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                                    formatter={(value) => [`${value}/20`, 'Note']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="note" 
                                    stroke="#6366f1" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        ) : (
                            <AreaChart data={progression_exercices}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} 
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#10b981" 
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    strokeWidth={4}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. SECTION MAÎTRISE PAR THÈME */}
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-widest">Maîtrise par Thème</h3>
                    </div>
                    
                    <div className="join bg-base-200 p-1 rounded-2xl hidden sm:flex">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`btn btn-sm join-item border-none ${viewMode === 'grid' ? 'btn-primary shadow-md' : 'btn-ghost'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`btn btn-sm join-item border-none ${viewMode === 'list' ? 'btn-primary shadow-md' : 'btn-ghost'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                    : "space-y-4"
                }>
                    {stats_par_theme.map((stat, index) => (
                        viewMode === 'grid' ? (
                            <div key={index} className="group bg-base-100 border border-base-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
                                <div className="flex justify-between items-start mb-8">
                                    <span className="badge badge-primary font-black uppercase p-4 rounded-xl text-[10px] tracking-widest">
                                        {stat.theme_label}
                                    </span>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-primary italic leading-none">
                                            {stat.moyenne}
                                        </div>
                                        <p className="text-[10px] font-black opacity-30 uppercase mt-1">Moyenne / 20</p>
                                    </div>
                                </div>
                                <div className="w-full bg-base-200 h-2 rounded-full mb-8 overflow-hidden">
                                    <div 
                                        className="bg-primary h-full transition-all duration-1000"
                                        style={{ width: `${(stat.moyenne / 20) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="space-y-4 bg-base-200/40 p-6 rounded-3xl">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-60 font-bold flex items-center gap-2 italic">
                                            <BookOpen size={18} className="text-primary"/> Quiz faits
                                        </span>
                                        <span className="font-black text-xl">{stat.nb_exercices}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-60 font-bold flex items-center gap-2 italic">
                                            <Clock size={18} className="text-primary"/> Temps moy.
                                        </span>
                                        <span className="font-black text-xl">{stat.temps_moyen}s</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="flex flex-col md:flex-row items-center justify-between p-6 bg-base-100 border border-base-200 rounded-3xl hover:bg-primary/5 hover:border-primary/20 transition-all group shadow-sm">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="bg-primary/10 text-primary p-3 rounded-2xl font-black text-xs uppercase tracking-widest w-40 text-center">
                                        {stat.theme_label}
                                    </div>
                                    <div className="hidden lg:block w-48">
                                        <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full" style={{ width: `${(stat.moyenne / 20) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 mt-4 md:mt-0">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black opacity-40 uppercase mb-1">Exercices</p>
                                        <p className="font-black text-lg">{stat.nb_exercices}</p>
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-[10px] font-black opacity-40 uppercase mb-1">Note Moyenne</p>
                                        <p className="font-black text-2xl text-primary italic">
                                            {stat.moyenne}
                                            <span className="text-xs opacity-30 not-italic ml-1">/20</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* 3. SECTION HISTORIQUE DES SCORES */}
            <div className="bg-base-200/40 rounded-[3rem] p-8 md:p-12 border border-base-200">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-600">
                        <HistoryIcon size={24} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Dernières Activités</h3>
                </div>

                <div className="grid gap-4">
                    {displayedHistory.map((score, index) => (
                        <div 
                            key={score.id} 
                            className="bg-base-100 border border-base-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">
                                    {historique.length - index}
                                </div>
                                <div>
                                    <p className="font-black text-lg">{score.theme}</p>
                                    <p className="text-xs opacity-40 font-bold italic">
                                        {new Date(score.date).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className={`text-3xl font-black italic ${
                                score.note >= 15 ? 'text-success' : 
                                score.note >= 10 ? 'text-warning' : 'text-error'
                            }`}>
                                {score.note}
                                <span className="text-xs opacity-30 not-italic ml-1">/20</span>
                            </div>
                        </div>
                    ))}
                </div>

                {historique.length > 5 && (
                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => setShowAllHistory(!showAllHistory)}
                            className="btn btn-ghost rounded-2xl gap-2 font-black opacity-50 hover:opacity-100"
                        >
                            {showAllHistory ? "Voir moins" : "Voir tout l'historique"}
                            <ChevronDown className={`transition-transform duration-300 ${showAllHistory ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceDetails;










