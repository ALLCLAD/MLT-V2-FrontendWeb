import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, TrendingUp } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import PerformanceDetails from '../../composants/Shared/PerformanceDetails';

const ScoresEleve = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/enseignant/eleves/${id}/scores/`);
            setData(response.data);
        } catch (err) {
            console.error("Erreur chargement scores:", err);
            setError("Impossible de charger les scores de l'élève.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const calculerMoyenne = (historique) => {
        if (!historique || historique.length === 0) return 0;
        const total = historique.reduce((acc, curr) => acc + curr.note, 0);
        return (total / historique.length).toFixed(1);
    };

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/enseignant/eleves')}
                            className="btn btn-circle btn-ghost"
                        >
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2 uppercase">
                                {loading ? "..." : data?.enfant}
                            </h1>
                            <p className="text-base-content/50 font-medium italic">
                                {data?.classe} • Tableau des performances
                            </p>
                        </div>
                    </div>

                    {!loading && data?.historique?.length > 0 && (
                        <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                            <TrendingUp className="text-primary" size={24} />
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-50 leading-none mb-1">Moyenne Générale</p>
                                <p className="text-2xl font-black text-primary leading-none">{calculerMoyenne(data.historique)}/20</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CONTENU UNIFIÉ */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="font-black italic opacity-30">Analyse des performances...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error rounded-3xl text-white font-bold italic shadow-lg">
                            {error}
                        </div>
                    )  : !data || !data.historique || data.historique.length === 0 ? (
                        <div className="text-center py-20 opacity-30">
                            <Star size={64} className="mx-auto mb-4" />
                            <p className="text-2xl font-black italic">Aucun score enregistré</p>
                            <p className="font-bold">L'élève n'a pas encore complété d'exercices.</p>
                        </div>
                    ) : ( 
                        <PerformanceDetails data={data} />
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