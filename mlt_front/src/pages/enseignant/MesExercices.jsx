import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, ClipboardList, Loader2, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import api from '../../apiDjango/api.jsx';

// 🦴 SKELETON LOADER FOR EXERCISES
const ExerciseCardSkeleton = () => (
    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-base-300 shadow-md bg-base-100 animate-pulse gap-6 w-full">
        <div className="flex items-center gap-6 w-full">
            <div className="w-12 h-12 bg-base-300 rounded-2xl shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="w-2/3 h-5 bg-base-300 rounded-lg"></div>
                <div className="w-1/3 h-4 bg-base-300 rounded-lg"></div>
            </div>
        </div>
        <div className="w-10 h-10 bg-base-300 rounded-full shrink-0"></div>
    </div>
);

const MesExercices = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [exercices, setExercices] = useState([]);
    const [lecon, setLecon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExercices = async () => {
        try {
            setLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
            const [exercicesRes, leconRes] = await Promise.all([
                api.get(`/enseignant/lecons/${id}/exercices/`),
                api.get(`/enseignant/lecons/${id}/`),
                minDelay
            ]);
            setExercices(exercicesRes.data);
            setLecon(leconRes.data);
        } catch (err) {
            console.error("Erreur chargement exercices:", err);
            setError("Impossible de charger les exercices.");
        } finally {
            setLoading(false);
        }
    };

    const handleSupprimer = async (exerciceId) => {
        const confirmDelete = window.confirm("⚠️ Attention : Voulez-vous vraiment supprimer cet exercice ?");
        if (confirmDelete) {
            try {
                await api.delete(`/enseignant/exercices/${exerciceId}/`);
                setExercices(prev => prev.filter(e => e.id !== exerciceId));
            } catch (err) {
                console.error("Erreur suppression exercice:", err);
                alert("Erreur lors de la suppression de l'exercice.");
            }
        }
    };

    useEffect(() => { fetchExercices(); }, [id]);

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans animate-in fade-in duration-300">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* Header interne */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate(`/enseignant/lecons/${id}`)}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
                                <ClipboardList size={14} /> Évaluations
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-none">
                                Exercices d'évaluation
                            </h1>
                            <p className="text-base-content/50 font-semibold italic mt-2">
                                {lecon ? `Cours : ${lecon.titre}` : 'Gestion des exercices du cours'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/enseignant/lecons/${id}/ajouter-exercice`)}
                        className="btn btn-primary rounded-2xl px-6 font-black shadow-lg shadow-primary/20 normal-case hover:scale-105 transition-transform"
                    >
                        <Plus size={20} className="mr-1" /> Ajouter un exercice
                    </button>
                </div>

                {/* ZONE DE CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error && (
                        <div className="alert alert-error rounded-2xl font-bold mb-8 shadow-md border-none">
                            <AlertCircle className="shrink-0" size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {[...Array(3)].map((_, i) => (
                                <ExerciseCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : exercices.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                            <div className="bg-gradient-to-tr from-primary/10 to-primary/5 w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <ClipboardList size={54} className="text-primary animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-base-content">Aucun exercice disponible</h3>
                            <p className="text-base-content/60 max-w-sm mx-auto mb-8 font-semibold mt-2">
                                Aucun exercice n'a encore été créé pour cette leçon. Cliquez ci-dessous pour ajouter un défi pédagogique !
                            </p>
                            <button
                                onClick={() => navigate(`/enseignant/lecons/${id}/ajouter-exercice`)}
                                className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/25 normal-case"
                            >
                                <Plus size={20} className="mr-1" /> Ajouter mon premier exercice
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-500">
                            {exercices.map((ex, idx) => (
                                <div 
                                    key={ex.id} 
                                    className="group bg-base-100 border border-base-200 p-6 rounded-[2rem] hover:shadow-xl hover:border-primary/20 shadow-md transition-all duration-300 flex items-center justify-between gap-6 w-full"
                                >
                                    <div className="flex items-center gap-6 min-w-0 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-primary/80 to-primary text-primary-content rounded-2xl flex items-center justify-center text-lg font-black shadow-lg shadow-primary/20 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-black text-lg text-base-content truncate group-hover:text-primary transition-colors">{ex.question}</p>
                                            <div className="flex items-center gap-1.5 text-success font-black text-xs uppercase mt-2">
                                                <CheckCircle size={14} /> Bonne réponse : {ex.reponse_correcte}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleSupprimer(ex.id)} 
                                        className="btn btn-circle btn-ghost text-error hover:bg-error/10 hover:text-error transition-all shrink-0"
                                        title="Supprimer l'exercice"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MesExercices;