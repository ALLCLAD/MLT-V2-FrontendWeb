import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipboardList, Loader2, Plus, X, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
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
    const [iaGenere, setIaGenere] = useState(false);
    const [mauvaisesList, setMauvaisesList] = useState([]);
    const [mauvaiseTemp, setMauvaiseTemp] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMauvaise = () => {
        if (mauvaiseTemp.trim()) {
            setMauvaisesList([...mauvaisesList, mauvaiseTemp.trim()]);
            setMauvaiseTemp('');
        }
    };

    const handleRemoveMauvaise = (index) => {
        setMauvaisesList(mauvaisesList.filter((_, i) => i !== index));
    };

    const handleGenererIA = async () => {
        if (!formData.question || !formData.reponse_correcte) {
            alert("Veuillez saisir une question et la bonne réponse.");
            return;
        }
        setLoadingIA(true);
        try {
            const suggestions = await genererReponseExercice(formData.question, formData.reponse_correcte);
            setMauvaisesList(suggestions.mauvaises_reponses);
            setFormData(prev => ({ ...prev, explication: suggestions.explication }));
            setIaGenere(true);
        } catch (err) {
            setError("L'IA n'a pas pu générer de réponses.");
        } finally {
            setLoadingIA(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                lecon: id,
                mauvaises_reponses: mauvaisesList.join('|')
            };
            await api.post(`/enseignant/lecons/${id}/exercices/ajouter/`, dataToSend);
            navigate(`/enseignant/lecons/${id}/exercices`);
        } catch (err) {
            setError("Erreur lors de la création.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(`/enseignant/lecons/${id}/exercices`)} className="btn btn-circle btn-ghost">
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Nouvel Exercice</h1>
                            <p className="text-base-content/50 font-medium italic">Ajoutez un défi pour vos élèves.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
                        {/* Contenu du formulaire inchangé */}
                        <div className="space-y-4">
                            <label className="block font-black text-lg">Question</label>
                            <textarea name="question" value={formData.question} onChange={handleChange} className="textarea textarea-bordered w-full rounded-2xl h-32 bg-base-200/50 border-none focus:ring-2 ring-primary font-medium" placeholder="Ex: Quelle est la capitale de la France ?" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block font-black text-lg">Bonne Réponse</label>
                                <input name="reponse_correcte" value={formData.reponse_correcte} onChange={handleChange} className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-14" placeholder="Ex: Paris" required />
                            </div>
                            <div className="space-y-4 pt-10">
                                <button type="button" onClick={handleGenererIA} disabled={loadingIA} className="btn btn-outline btn-primary w-full rounded-2xl font-black gap-2 h-14 border-2">
                                    {loadingIA ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Générer les erreurs avec l'IA
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block font-black text-lg">Mauvaises Réponses</label>
                            <div className="flex gap-2">
                                <input value={mauvaiseTemp} onChange={(e) => setMauvaiseTemp(e.target.value)} className="input input-bordered flex-1 rounded-2xl bg-base-200/50 border-none h-14" placeholder="Ajouter une erreur..." />
                                <button type="button" onClick={handleAddMauvaise} className="btn btn-primary rounded-2xl h-14 px-6"><Plus /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {mauvaisesList.map((m, i) => (
                                    <div key={i} className="badge badge-lg py-6 px-4 gap-2 bg-base-200 border-none font-bold rounded-xl">
                                        {m} <X size={16} className="cursor-pointer text-error" onClick={() => handleRemoveMauvaise(i)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-10">
                            <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-[2rem] h-16 font-black text-xl shadow-xl shadow-primary/20">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <ClipboardList className="mr-2" />} Enregistrer l'exercice
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AjouterExercice;