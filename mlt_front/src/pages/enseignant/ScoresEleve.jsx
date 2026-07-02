import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    Star,
    TrendingUp,
    Award,
    BookOpen,
    Clock,
    Target
} from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import PerformanceDetails from '../../composants/Shared/PerformanceDetails';

// 🦴 SKELETON LOADERS
const HeaderSkeleton = () => (
    <div className="p-8 md:p-12 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                <div className="space-y-3">
                    <div className="w-64 h-8 bg-base-300 rounded-xl"></div>
                    <div className="w-40 h-4 bg-base-300 rounded-lg"></div>
                </div>
            </div>
            <div className="w-44 h-20 bg-base-300 rounded-2xl hidden md:block"></div>
        </div>
    </div>
);

const StatCardSkeleton = () => (
    <div className="bg-base-100 border border-base-300 rounded-[2rem] p-6 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-base-300 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
                <div className="w-20 h-3 bg-base-300 rounded-lg"></div>
                <div className="w-16 h-7 bg-base-300 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const ChartSkeleton = () => (
    <div className="bg-base-100 border border-base-300 rounded-[3rem] p-8 animate-pulse">
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-base-300 rounded-2xl"></div>
                <div className="space-y-2">
                    <div className="w-48 h-6 bg-base-300 rounded-lg"></div>
                    <div className="w-32 h-3 bg-base-300 rounded-lg"></div>
                </div>
            </div>
            <div className="w-40 h-10 bg-base-300 rounded-2xl"></div>
        </div>
        <div className="w-full h-[300px] bg-base-200 rounded-3xl"></div>
    </div>
);

const ThemeCardSkeleton = () => (
    <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-8 animate-pulse">
        <div className="flex justify-between items-start mb-8">
            <div className="w-28 h-8 bg-base-300 rounded-xl"></div>
            <div className="space-y-1 text-right">
                <div className="w-16 h-10 bg-base-300 rounded-lg ml-auto"></div>
                <div className="w-20 h-3 bg-base-300 rounded-lg ml-auto"></div>
            </div>
        </div>
        <div className="w-full h-2 bg-base-300 rounded-full mb-8"></div>
        <div className="bg-base-200 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between">
                <div className="w-24 h-4 bg-base-300 rounded-lg"></div>
                <div className="w-10 h-5 bg-base-300 rounded-lg"></div>
            </div>
            <div className="flex justify-between">
                <div className="w-24 h-4 bg-base-300 rounded-lg"></div>
                <div className="w-10 h-5 bg-base-300 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const ScoresEleve = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
                const [response] = await Promise.all([
                    api.get(`/enseignant/eleves/${id}/scores/`),
                    minDelay
                ]);
                setData(response.data);
            } catch (err) {
                console.error("Erreur récupération stats élève:", err);
                setError("Impossible de charger les scores de l'élève.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // Calcul des statistiques globales depuis les données
    const globalStats = data?.stats_par_theme ? {
        moyenneGenerale: (data.stats_par_theme.reduce((acc, s) => acc + parseFloat(s.moyenne), 0) / data.stats_par_theme.length).toFixed(1),
        totalExercices: data.stats_par_theme.reduce((acc, s) => acc + s.nb_exercices, 0),
        tempsMoyen: Math.round(data.stats_par_theme.reduce((acc, s) => acc + parseFloat(s.temps_moyen), 0) / data.stats_par_theme.length),
        nbThemes: data.stats_par_theme.length
    } : null;

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                {loading ? (
                    <HeaderSkeleton />
                ) : (
                    <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate('/enseignant/eleves')}
                                className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
                                    <TrendingUp size={14} /> Tableau de bord élève
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight uppercase leading-none">
                                    {data?.enfant || 'Profil Élève'}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-primary font-black italic text-sm">Classe : {data?.classe || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex bg-primary/5 p-4 rounded-2xl border border-primary/10 items-center gap-3">
                                <Award className="text-primary" size={32} />
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-40 leading-none">Statut Global</p>
                                    <p className="font-black text-lg text-primary uppercase italic">
                                        {globalStats && parseFloat(globalStats.moyenneGenerale) >= 15 ? 'Petit Génie' :
                                         globalStats && parseFloat(globalStats.moyenneGenerale) >= 10 ? 'Bon Travail' : 'En Progrès'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ZONE DE CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">

                    {loading ? (
                        /* SKELETON COMPLET */
                        <div className="space-y-12 animate-in fade-in duration-500">
                            {/* Stats Summary Skeletons */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
                            </div>
                            {/* Chart Skeleton */}
                            <ChartSkeleton />
                            {/* Theme Cards Skeletons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(3)].map((_, i) => <ThemeCardSkeleton key={i} />)}
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error rounded-2xl font-bold mb-8 shadow-md border-none">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    ) : !data || !data.historique || data.historique.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                            <div className="bg-gradient-to-tr from-primary/10 to-primary/5 w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Star size={54} className="text-primary animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-base-content">Aucune donnée disponible</h3>
                            <p className="text-base-content/60 max-w-sm mx-auto font-semibold mt-2">
                                {data?.enfant} n'a pas encore terminé d'exercices. Les statistiques apparaîtront dès qu'il commencera à travailler !
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in duration-700">
                            {/* CARTES RÉSUMÉ STATISTIQUES */}
                            {globalStats && (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-base-100 border border-base-200 rounded-[2rem] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                                <TrendingUp size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase opacity-40 tracking-wider">Moyenne</p>
                                                <p className="text-2xl font-black text-primary italic">{globalStats.moyenneGenerale}<span className="text-xs opacity-40 not-italic">/20</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 border border-base-200 rounded-[2rem] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
                                                <BookOpen size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase opacity-40 tracking-wider">Exercices</p>
                                                <p className="text-2xl font-black text-base-content">{globalStats.totalExercices}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 border border-base-200 rounded-[2rem] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                                                <Clock size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase opacity-40 tracking-wider">Temps moy.</p>
                                                <p className="text-2xl font-black text-base-content">{globalStats.tempsMoyen}<span className="text-xs opacity-40 ml-0.5">s</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-base-100 border border-base-200 rounded-[2rem] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-600">
                                                <Target size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase opacity-40 tracking-wider">Thèmes</p>
                                                <p className="text-2xl font-black text-base-content">{globalStats.nbThemes}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* COMPOSANT DE DÉTAILS DE PERFORMANCE */}
                            <PerformanceDetails data={data} />
                        </div>
                    )}
                </div>

                {/* BOUTON BAS DE PAGE */}
                {!loading && (
                    <div className="p-8 md:p-12 pt-0 flex justify-end">
                        <button
                            onClick={() => navigate('/enseignant/eleves')}
                            className="btn btn-ghost rounded-2xl font-black opacity-50 hover:opacity-100"
                        >
                            Retour à la liste
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoresEleve;