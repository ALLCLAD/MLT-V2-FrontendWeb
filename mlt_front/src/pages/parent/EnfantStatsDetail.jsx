/**
 * COMPOSANT : EnfantStatsDetail
 * DESCRIPTION : Affiche les scores par thème, le temps moyen et la progression d'un enfant précis.
 * API : GET '/quiz/stats-par-enfant/{enfantId}/'
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    Star,
    TrendingUp,
    Award
} from 'lucide-react';
import api from '../../apiDjango/api';
import PerformanceDetails from '../../composants/Shared/PerformanceDetails';

const EnfantStatsDetail = () => {
    const { enfantId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/quiz/stats-par-enfant/${enfantId}/`);
                setData(response.data);
            } catch (err) {
                console.error("Erreur récupération stats enfant:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [enfantId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic">Analyse des progrès en cours...</p>
        </div>
    );

    return (
        /* 1. L'ESPACE DE FOND */
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">

            {/* 2. LE CONTENANT PRINCIPAL */}
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER INTERNE */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight uppercase">
                                {data?.enfant || 'Profil Enfant'}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <TrendingUp size={18} className="text-primary" />
                                <p className="text-primary font-black italic">Classe : {data?.classe || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Badge de réussite */}
                        <div className="hidden md:flex bg-primary/5 p-4 rounded-2xl border border-primary/10 items-center gap-3">
                            <Award className="text-primary" size={32} />
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-40 leading-none">Statut Global</p>
                                <p className="font-black text-lg text-primary uppercase italic">Petit Génie</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ZONE DE CONTENU DYNAMIQUE (Utilisant PerformanceDetails) */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">

                    {!data || !data.historique || data.historique.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <Star size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Aucune donnée disponible</h3>
                            <p className="opacity-50 max-w-sm mx-auto font-medium">
                                {data?.enfant} n'a pas encore terminé d'exercices. Les statistiques apparaîtront bientôt !
                            </p>
                        </div>
                    ) : (
                        <PerformanceDetails data={data} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnfantStatsDetail;
EnfantStatsDetail;