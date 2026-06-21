import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Target, BarChart3, Loader2, Sparkles, BookOpen } from 'lucide-react';
import api from '../../apiDjango/api.jsx';

const ApercuEnfant = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/quiz/enfant-dashboard/');
                setStats(response.data);
            } catch (err) {
                setStats({ prenom: "Aventurier", niveau: 1, xp: 45, streak: 3, totalEtoiles: 120, dernierScore: 18 });
            } finally { setLoading(false); }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-1000">

            {/* --- LE GRAND CONTENEUR MAÎTRE (Adaptatif Dark/Light) --- */}
            <div className="bg-base-100 border border-base-300 rounded-[3rem] shadow-xl overflow-hidden transition-colors duration-500">

                {/* 1. HEADER : Identité et Accroche (Fond légèrement différent) */}
                <div className="p-10 md:p-14 border-b border-base-300 bg-base-200/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                                <Sparkles size={14} className="animate-pulse" /> Espace de progression personnel
                            </div>
                            <h2 className="text-5xl font-black text-base-content tracking-tight leading-tight">
                                Salut, <span className="text-primary italic">{stats.prenom}</span> !
                            </h2>
                            <div className="space-y-2">
                                <p className="text-base-content/80 text-xl font-semibold leading-relaxed">
                                    Chaque défi relevé te rapproche de l'excellence.
                                </p>
                                <p className="text-base-content/50 text-lg font-medium italic">
                                    Affute ton esprit et deviens un véritable as des mathématiques par une pratique régulière.
                                </p>
                            </div>
                        </div>

                        {/* Indicateur de Rang (Effet Glassmorphism pour le Dark mode) */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative bg-base-100 px-8 py-6 rounded-[2.2rem] border border-base-300 shadow-sm text-center min-w-[160px]">
                                <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-widest mb-1">Rang actuel</p>
                                <p className="text-4xl font-black text-base-content tracking-tighter italic">Niveau {stats.niveau}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. BODY : Statistiques & Guide d'Orientation */}
                <div className="p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Section de Progression */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <BarChart3 size={20} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-base-content/40">Énergie d'apprentissage</span>
                                </div>
                                <span className="text-3xl font-black text-primary tracking-tighter">{stats.xp}%</span>
                            </div>

                            {/* Barre de progression adaptée */}
                            <div className="h-5 w-full bg-base-300 rounded-full overflow-hidden p-1 shadow-inner border border-base-300/50">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-lg"
                                    style={{ width: `${stats.xp}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Texte d'orientation (Fond neutre adaptatif) */}
                        <div className="flex items-start gap-4 p-6 bg-base-200/50 rounded-3xl border border-base-300/50">
                            <BookOpen className="text-primary shrink-0 mt-1" size={20} />
                            <p className="text-base-content/70 font-medium leading-relaxed">
                                Pour poursuivre ton ascension et débloquer de nouveaux succès, rends-toi simplement dans la section
                                <span className="text-primary font-bold"> "S'exercer"</span> via ton menu de navigation.
                            </p>
                        </div>
                    </div>

                    {/* Grille de Médailles Rapides */}
                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                        <StatItem icon={Flame} value={stats.streak} label="Jours consécutifs" color="text-orange-500" bg="bg-orange-500/5" />
                        <StatItem icon={Star} value={stats.totalEtoiles} label="Étoiles collectées" color="text-amber-500" bg="bg-amber-500/5" />
                        <StatItem icon={Target} value={`${stats.dernierScore}/20`} label="Dernier score" color="text-emerald-500" bg="bg-emerald-500/5" />
                    </div>
                </div>

            </div>

        </div>
    );
};

// Composant interne pour la grille de stats
const StatItem = ({ icon: Icon, value, label, color, bg }) => (
    <div className={`${bg} border border-base-300/30 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:bg-base-100`}>
        <Icon size={24} className={`${color} mb-3`} />
        <span className="text-3xl font-black text-base-content tracking-tighter leading-none">{value}</span>
        <span className="text-[8px] font-bold uppercase text-base-content/40 mt-2 leading-tight tracking-widest">{label}</span>
    </div>
);

export default ApercuEnfant;