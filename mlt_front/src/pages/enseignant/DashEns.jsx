import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Loader2, Clock, BookOpen, Users, Bell, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ApercuStatsEns from '../../composants/UIenseignant/AperçuStats';
import api from '../../apiDjango/api.jsx';

const DashEns = () => {
    const navigate = useNavigate();
    const [prochainsEvenements, setProchainsEvenements] = useState([]);
    const [loadingCalendrier, setLoadingCalendrier] = useState(true);
    const [graphData, setGraphData] = useState([]);
    const [elevesNoms, setElevesNoms] = useState([]);
    const [recentScores, setRecentScores] = useState([]);
    const [loadingProgression, setLoadingProgression] = useState(true);

    const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const fetchCalendrier = async () => {
        try {
            setLoadingCalendrier(true);
            const response = await api.get('/enseignant/calendrier/');
            const aujourdhui = new Date();
            aujourdhui.setHours(0, 0, 0, 0);
            const aVenir = response.data
                .filter(event => new Date(event.date) >= aujourdhui)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);
            setProchainsEvenements(aVenir);
        } catch (err) {
            console.error("Erreur calendrier:", err);
        } finally {
            setLoadingCalendrier(false);
        }
    };

    const fetchProgression = async () => {
        try {
            setLoadingProgression(true);
            const response = await api.get('/enseignant/stats/');
            
            setGraphData(response.data.graphData || []);
            setRecentScores(response.data.recentActivity || []);
            
            // On extrait les noms des élèves depuis le premier point du graphique
            if (response.data.graphData && response.data.graphData.length > 0) {
                const noms = Object.keys(response.data.graphData[0]).filter(k => k !== 'name');
                setElevesNoms(noms);
            }
        } catch (err) {
            console.error("Erreur progression:", err);
        } finally {
            setLoadingProgression(false);
        }
    };

    const handleRefresh = () => {
        fetchCalendrier();
        fetchProgression();
    };

    useEffect(() => {
        fetchCalendrier();
        fetchProgression();
    }, []);

    const formatFullDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long'
        });
    };

    return (
        // ── FOND EXTÉRIEUR ──
        <div className="bg-base-200/50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen animate-in fade-in duration-500">
            
            {/* ══ GRAND CADRE PRINCIPAL ══ */}
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl border border-base-content/5 overflow-hidden">

                {/* ── HEADER DU GRAND CADRE ── */}
                <div className="p-8 md:p-12 flex justify-between items-center border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">
                            Tableau de bord
                        </h1>
                        <p className="text-base-content/50 font-medium italic">
                            Gérez vos activités et suivez vos élèves.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Date */}
                        <div className="hidden md:block bg-base-200 p-3 rounded-2xl">
                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Aujourd'hui</p>
                            <p className="font-bold text-sm">
                                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                        {/* Bouton refresh */}
                        <button onClick={handleRefresh} className="btn btn-circle btn-ghost text-primary">
                            <RefreshCw size={24} />
                        </button>
                    </div>
                </div>
                

                {/* ── CONTENU DU GRAND CADRE ── */}
                <div className="p-8 md:p-12 space-y-10">

                    {/* STATISTIQUES GLOBALES */}
                    <ApercuStatsEns />
                    

                    {/* GRILLE : Progression + Calendrier */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── PROGRESSION + GRAPHIQUE + SCORES ── */}
                        <div className="lg:col-span-2 bg-base-200/40 rounded-[2.5rem] p-8 border border-base-200 flex flex-col gap-8">

                            {/* Titre section */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <TrendingUp className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">
                                        Activité par élève
                                    </h3>
                                    <p className="text-xs opacity-40 font-bold italic">
                                        Nombre d'exercices réussis cette semaine
                                    </p>
                                </div>
                            </div>

                            {/* Graphique */}
                            {loadingProgression ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                </div>
                            ) : elevesNoms.length === 0 ? (
                                <div className="flex flex-col items-center py-10 opacity-20">
                                    <Users size={60} className="mb-4" />
                                    <p className="font-bold italic text-center">
                                        Inscrivez des élèves pour voir leur activité.
                                    </p>
                                </div>
                            ) : (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={graphData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: '900' }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: '900' }}
                                                allowDecimals={false}
                                            />
                                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                            {elevesNoms.map((nom, index) => (
                                                <Line
                                                    key={nom}
                                                    type="monotone"
                                                    dataKey={nom}
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
                            )}

                            {/* Derniers scores */}
                            {recentScores.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-sm font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                        <Clock size={16} className="text-primary" />
                                        Derniers scores
                                    </h4>
                                    {recentScores.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg">
                                                    {item.prenom?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-primary text-[10px] uppercase tracking-wider">{item.prenom}</p>
                                                    <p className="font-bold italic text-sm">{item.theme}</p>
                                                    <p className="text-[10px] opacity-40 font-bold">
                                                        {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-2xl font-black italic ${
                                                item.note >= 15 ? 'text-success' :
                                                item.note >= 10 ? 'text-warning' : 'text-error'
                                            }`}>
                                                {item.note}<span className="text-xs opacity-30 not-italic">/20</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── CALENDRIER + ACTIONS ── */}
                        <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex flex-col">
                            <div className="flex-1">
                                <div className="p-4 bg-white dark:bg-base-100 rounded-2xl w-fit shadow-sm mb-6 text-primary">
                                    <Clock size={28} />
                                </div>
                                <h3 className="text-2xl font-black mb-6">À venir</h3>
                                <div className="space-y-4">
                                    {loadingCalendrier ? (
                                        <div className="flex justify-center py-10">
                                            <Loader2 className="animate-spin text-primary" />
                                        </div>
                                    ) : prochainsEvenements.length > 0 ? (
                                        prochainsEvenements.map((ev) => (
                                            <div key={ev.id} className="dark:bg-base-100 p-5 rounded-3xl shadow-sm border border-primary/5 hover:scale-[1.02] transition-transform duration-300">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                        ev.type_evenement === 'reunion' ? 'bg-orange-500/10 text-orange-600' :
                                                        ev.type_evenement === 'autre' ? 'bg-red-500/10 text-red-600' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                        {ev.type_evenement || "Événement"}
                                                    </span>
                                                    <span className="text-[10px] font-black opacity-30 italic">{ev.heure}</span>
                                                </div>
                                                <p className="font-bold text-lg leading-tight mb-2">{ev.titre}</p>
                                                <div className="flex items-center gap-2 text-xs opacity-50 font-bold">
                                                    <Calendar size={12} />
                                                    <span>{formatFullDate(ev.date)}</span>
                                                </div>
                                                {ev.lecon_titre && (
                                                    <div className="mt-3 pt-3 border-t border-base-200 flex items-center gap-2 text-[10px] font-bold text-primary/60 italic">
                                                        <BookOpen size={10} />
                                                        <span className="truncate">Cours : {ev.lecon_titre}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 opacity-30 border-2 border-dashed border-primary/20 rounded-[2rem]">
                                            <Bell size={24} className="mx-auto mb-2" />
                                            <p className="text-sm font-bold italic">Rien de prévu</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => navigate('/enseignant/lecons')}
                                    className="btn btn-primary w-full rounded-2xl normal-case font-black shadow-lg shadow-primary/30"
                                >
                                    Mes Leçons
                                </button>
                                <button
                                    onClick={() => navigate('/enseignant/calendrier')}
                                    className="btn btn-ghost hover:bg-primary/10 w-full rounded-2xl normal-case font-black text-primary flex items-center justify-center gap-2"
                                >
                                    Gérer le calendrier <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashEns;

