/**
 * COMPOSANT : AperçuStats
 * DESCRIPTION : Centralise les statistiques globales du parent (total enfants, moyenne, activité).
 * API : Consomme '/quiz/stats-globales-parent/'
 */

import React, { useState, useEffect } from 'react';
import { Users, Star, Trophy, RefreshCw, Activity, Clock, TrendingUp } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '../../apiDjango/api';

const StatCard = ({ title, value, icon, color, label }) => (
    <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 ${color} transition-transform group-hover:scale-150`}></div>
        <div className="flex justify-between items-start mb-6 relative">
            <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-current/20`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div className="text-[10px] font-black bg-base-200 px-3 py-1 rounded-full uppercase tracking-widest opacity-50">
                {label}
            </div>
        </div>
        <div className="relative">
            <p className="text-xs font-black opacity-30 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-4xl font-black italic tracking-tighter">{value}</h3>
        </div>
    </div>
);

const AperçuStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Récupération des données statistiques depuis le backend
    const fetchData = () => {
        setLoading(true);
        api.get('/quiz/stats-global/')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur stats:", err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-black opacity-50 italic">Mise à jour du tableau de bord...</p>
        </div>
    );

    const childNames = stats?.graphData?.length > 0
        ? Object.keys(stats.graphData[0]).filter(key => key !== 'name')
        : [];

    const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* Header simplifié sans fioritures */}
                <div className="p-8 md:p-12 flex justify-between items-center border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Tableau de Bord</h1>
                        <p className="text-base-content/50 font-medium italic flex items-center gap-2">
                            <Activity size={16} className="text-primary" /> Activité en temps réel
                        </p>
                    </div>
                    <button onClick={fetchData} className="btn btn-circle btn-ghost text-primary">
                        <RefreshCw size={24} />
                    </button>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    {/* Cartes de statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard title="Enfants" value={stats?.totalEnfants || 0} icon={<Users />} color="bg-blue-600" label="Inscrits" />
                        <StatCard title="Moyenne" value={stats?.moyenneGenerale ? `${stats.moyenneGenerale}/20` : "N/A"} icon={<Star />} color="bg-amber-500" label="Globale" />
                        <StatCard title="Exercices" value={stats?.exercicesTermines || 0} icon={<Trophy />} color="bg-emerald-500" label="Terminés" />
                    </div>

                    {/* GRAPHIQUE UNIQUE (Remplace les deux anciens blocs) */}
                    <div className="bg-base-100 p-8 rounded-[3rem] border border-base-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><TrendingUp size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest">Activité par enfant</h3>
                                <p className="text-xs opacity-40 font-bold italic">Nombre d'exercices réussis cette semaine</p>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.graphData || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: '900'}} />
                                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                    {childNames.map((name, index) => (
                                        <Line
                                            key={name}
                                            type="monotone"
                                            dataKey={name}
                                            stroke={colors[index % colors.length]}
                                            strokeWidth={5}
                                            dot={{ r: 6, fill: colors[index % colors.length], strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 10 }}
                                            animationDuration={1500}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Liste des dernières réussites */}
                    <div className="bg-base-200/40 rounded-[2.5rem] p-8 md:p-10 border border-base-200">
                        <h3 className="text-xl font-black uppercase flex items-center gap-3 mb-8 tracking-widest">
                            <Clock size={24} className="text-primary" /> Derniers scores
                        </h3>
                        <div className="grid gap-4">
                            {stats?.recentActivity?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-6 bg-base-100 rounded-3xl border border-base-200 shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                                            {item.prenom[0]}
                                        </div>
                                        <div>
                                            <p className="font-black text-primary text-xs uppercase">{item.prenom}</p>
                                            <p className="text-lg font-bold italic">{item.theme}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black italic text-primary">{item.score}<span className="text-sm opacity-30 not-italic">/20</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AperçuStats;