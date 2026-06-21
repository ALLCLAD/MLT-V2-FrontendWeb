import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, ClipboardList, Loader2, CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../apiDjango/api.jsx';

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
            const [exercicesRes, leconRes] = await Promise.all([
                api.get(`/enseignant/lecons/${id}/exercices/`),
                api.get(`/enseignant/lecons/${id}/`)
            ]);
            setExercices(exercicesRes.data);
            setLecon(leconRes.data);
        } catch (err) {
            setError("Impossible de charger les exercices.");
        } finally {
            setLoading(false);
        }
    };

    const handleSupprimer = async (exerciceId) => {
        try {
            await api.delete(`/enseignant/exercices/${exerciceId}/`);
            setExercices(exercices.filter(e => e.id !== exerciceId));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchExercices(); }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic">Préparation des questions...</p>
        </div>
    );

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* Header interne */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div>
                        <button onClick={() => navigate(`/enseignant/lecons/${id}`)} className="btn btn-ghost btn-xs mb-2 p-0 opacity-50 hover:bg-transparent">
                            <ArrowLeft size={14} className="mr-1"/> Retour
                        </button>
                        <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Exercices</h1>
                        <p className="text-base-content/50 font-medium italic">
                            {lecon ? `Leçon : ${lecon.titre}` : 'Gestion des entraînements'}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/enseignant/lecons/${id}/ajouter-exercice`)}
                        className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/20 normal-case"
                    >
                        <Plus size={20} className="mr-1" /> Ajouter un exercice
                    </button>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error && (
                        <div className="alert alert-error rounded-2xl font-bold mb-8">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {exercices.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <ClipboardList size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Aucun exercice ici</h3>
                            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">
                                Ajoutez des défis pour aider vos élèves à progresser.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {exercices.map((ex, idx) => (
                                <div key={ex.id} className="group bg-base-100 border border-base-200 p-6 rounded-[2rem] hover:shadow-md transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{ex.question}</p>
                                            <div className="flex items-center gap-2 text-success font-black text-xs uppercase mt-1">
                                                <CheckCircle size={14} /> Réponse : {ex.reponse_correcte}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleSupprimer(ex.id)} className="btn btn-circle btn-ghost text-error">
                                        <XCircle size={20} />
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