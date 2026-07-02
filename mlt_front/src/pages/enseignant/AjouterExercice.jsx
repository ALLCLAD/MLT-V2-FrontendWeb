import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipboardList, Loader2, Plus, X, Sparkles, CheckCircle, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import { genererReponseExercice } from '../../apiDjango/aiService';

const AjouterExercice = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        question: '',
        reponse_correcte: '',
        mauvaises_reponses: '',
        explication: '',
        ordre: 0,
    });

    const [loading, setLoading] = useState(false);
    const [loadingIA, setLoadingIA] = useState(false);
    const [error, setError] = useState(null);
    const [successIA, setSuccessIA] = useState(false);
    const [mauvaisesList, setMauvaisesList] = useState([]);
    const [mauvaiseTemp, setMauvaiseTemp] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMauvaise = () => {
        if (mauvaiseTemp.trim()) {
            // Éviter les doublons
            if (!mauvaisesList.includes(mauvaiseTemp.trim())) {
                setMauvaisesList([...mauvaisesList, mauvaiseTemp.trim()]);
            }
            setMauvaiseTemp('');
        }
    };

    const handleRemoveMauvaise = (index) => {
        setMauvaisesList(mauvaisesList.filter((_, i) => i !== index));
    };

    const handleGenererIA = async () => {
        if (!formData.question || !formData.reponse_correcte) {
            alert("Veuillez d'abord saisir la question et la réponse correcte.");
            return;
        }
        setLoadingIA(true);
        setSuccessIA(false);
        setError(null);
        try {
            const suggestions = await genererReponseExercice(formData.question, formData.reponse_correcte);
            setMauvaisesList(suggestions.mauvaises_reponses);
            setFormData(prev => ({ ...prev, explication: suggestions.explication }));
            setSuccessIA(true);
            setTimeout(() => setSuccessIA(false), 3000);
        } catch (err) {
            console.error("Erreur IA:", err);
            setError("L'IA n'a pas pu générer les suggestions.");
        } finally {
            setLoadingIA(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mauvaisesList.length === 0) {
            alert("Veuillez ajouter au moins une mauvaise réponse.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const dataToSend = {
                ...formData,
                lecon: id,
                mauvaises_reponses: mauvaisesList.join('|')
            };
            await api.post(`/enseignant/lecons/${id}/exercices/ajouter/`, dataToSend);
            navigate(`/enseignant/lecons/${id}/exercices`);
        } catch (err) {
            console.error("Erreur ajout exercice:", err);
            setError("Une erreur est survenue lors de la création de l'exercice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans animate-in fade-in duration-300">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate(`/enseignant/lecons/${id}/exercices`)} 
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
                                <Plus size={14} /> Nouvel exercice
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-none">
                                Nouveau Défi
                            </h1>
                            <p className="text-base-content/50 font-semibold italic mt-2">
                                Créez une question et laissez l'IA vous proposer des réponses erronées cohérentes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
                        
                        {error && (
                            <div className="alert bg-error/10 border-none rounded-2xl text-error font-black p-4 flex gap-3 shadow-sm animate-in fade-in duration-300">
                                <AlertCircle size={22} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {successIA && (
                            <div className="alert bg-success/10 border-none rounded-2xl text-success font-black p-4 flex gap-3 shadow-sm animate-in fade-in duration-300">
                                <CheckCircle size={22} className="shrink-0" />
                                <span>Suggestions d'erreurs et explications générées avec succès !</span>
                            </div>
                        )}

                        {/* QUESTION */}
                        <div className="space-y-3">
                            <label className="block font-black text-lg text-base-content">Question *</label>
                            <textarea 
                                name="question" 
                                value={formData.question} 
                                onChange={handleChange} 
                                className="textarea w-full rounded-2xl bg-base-200/50 border border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold h-32 p-5 transition-all leading-relaxed" 
                                placeholder="Ex: Si j'ai 4 pommes et que j'en mange 1, quelle fraction de pommes reste-t-il ?" 
                                required 
                            />
                        </div>

                        {/* BONNE REPONSE & SUGGESTION IA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-3">
                                <label className="block font-black text-lg text-base-content">Bonne Réponse *</label>
                                <input 
                                    name="reponse_correcte" 
                                    value={formData.reponse_correcte} 
                                    onChange={handleChange} 
                                    className="input w-full rounded-2xl bg-base-200/50 border border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold h-14 transition-all" 
                                    placeholder="Ex: 3/4" 
                                    required 
                                />
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="button" 
                                    onClick={handleGenererIA} 
                                    disabled={loadingIA} 
                                    className="btn btn-outline btn-primary w-full rounded-2xl font-black gap-2 h-14 border-2 hover:scale-[1.01] active:scale-95 transition-all normal-case shadow-sm"
                                >
                                    {loadingIA ? (
                                        <>
                                            <Loader2 className="animate-spin shrink-0" size={18} />
                                            Génération par Mathy...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} className="text-primary" />
                                            Suggérer les erreurs (IA)
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* MAUVAISES REPONSES */}
                        <div className="space-y-3">
                            <label className="block font-black text-lg text-base-content">Réponses incorrectes (choix multiples) *</label>
                            <div className="flex gap-2">
                                <input 
                                    value={mauvaiseTemp} 
                                    onChange={(e) => setMauvaiseTemp(e.target.value)} 
                                    className="input flex-1 rounded-2xl bg-base-200/50 border border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold h-14 transition-all" 
                                    placeholder="Ajouter une erreur personnalisée..." 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddMauvaise();
                                        }
                                    }}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddMauvaise} 
                                    className="btn btn-primary rounded-2xl h-14 px-6 hover:scale-105 transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {mauvaisesList.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 mt-4 bg-base-200/40 p-4 rounded-2xl border border-base-200 animate-in fade-in duration-300">
                                    {mauvaisesList.map((m, i) => (
                                        <div 
                                            key={i} 
                                            className="badge badge-lg py-5 px-4 gap-2 bg-error/10 border border-error/20 text-error font-bold rounded-xl animate-in zoom-in-95 duration-200"
                                        >
                                            <span>{m}</span> 
                                            <X 
                                                size={14} 
                                                className="cursor-pointer hover:scale-110 transition-transform text-error shrink-0" 
                                                onClick={() => handleRemoveMauvaise(i)} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* EXPLICATION */}
                        <div className="space-y-3">
                            <label className="block font-black text-lg text-base-content flex items-center gap-1.5">
                                <HelpCircle size={18} className="text-primary" />
                                Explication / Aide pédagogique
                            </label>
                            <textarea 
                                name="explication" 
                                value={formData.explication} 
                                onChange={handleChange} 
                                className="textarea w-full rounded-2xl bg-base-200/50 border border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold h-28 p-5 transition-all leading-relaxed" 
                                placeholder="Cette explication sera affichée à l'élève en cas de mauvaise réponse ou pour l'aider à comprendre." 
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn btn-primary w-full rounded-[2rem] h-16 font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all normal-case"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardList className="mr-2" />
                                        Enregistrer le défi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AjouterExercice;