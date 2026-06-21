import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Sparkles, CheckCircle, ArrowLeft, ClipboardList } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import { genererContenuLecon, genererExercices } from '../../apiDjango/aiService';

const CreerLecon = () => {
    const navigate = useNavigate();

    // --- ÉTATS ---
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        classe: '',
        duree: '45 min',
        theme: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [etape, setEtape] = useState('');

    // --- CHARGEMENT CLASSE ---
    useEffect(() => {
        const fetchClasse = async () => {
            try {
                const response = await api.get('/auth/user-profile/');
                setFormData(prev => ({
                    ...prev,
                    classe: response.data.classe_enseignement
                }));
            } catch (err) {
                console.error("Erreur profil:", err);
            }
        };
        fetchClasse();
    }, []);

    // --- GESTION DU FORMULAIRE ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- SOUMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            setEtape('Mathy génère le contenu de votre leçon...');
            const contenu = await genererContenuLecon(
                formData.titre,
                formData.description,
                formData.classe
            );

            if (!contenu) {
                throw new Error("Impossible de générer le contenu de la leçon.");
            }

            setEtape('Sauvegarde de la leçon...');
            const leconResponse = await api.post('/enseignant/lecons/', {
                ...formData,
                contenu: contenu,
            });

            const leconId = leconResponse.data.id;

            setEtape('Mathy génère les exercices...');
            const exercices = await genererExercices(
                formData.titre,
                formData.classe,
                contenu
            );

            if (exercices && exercices.length > 0) {
                setEtape('Sauvegarde des exercices...');
                for (const exercice of exercices) {
                    await api.post(`/enseignant/lecons/${leconId}/exercices/`, exercice);
                }
            }

            setEtape('Leçon créée avec succès !');

            setTimeout(() => {
                navigate(`/enseignant/lecons/${leconId}`);
            }, 1000);

        } catch (err) {
            console.error("Erreur création leçon:", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
            setEtape('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/enseignant/lecons')} className="btn btn-circle btn-ghost">
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Nouvelle Leçon</h1>
                            <p className="text-base-content/50 font-medium italic">Remplissez le formulaire et Mathy génèrera tout automatiquement !</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">

                        {/* Message erreur */}
                        {error && (
                            <div className="alert alert-error rounded-2xl font-bold mb-4">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* AFFICHAGE DE LA PROGRESSION */}
                        {loading && etape && (
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-4">
                                    {etape === 'Leçon créée avec succès !' ? (
                                        <CheckCircle className="text-success flex-shrink-0" size={24} />
                                    ) : (
                                        <Loader2 className="text-primary animate-spin flex-shrink-0" size={24} />
                                    )}
                                    <div>
                                        <p className="font-black text-primary">{etape}</p>
                                        <p className="text-xs opacity-50 font-bold mt-1">Mathy travaille pour vous, patientez...</p>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-primary/10 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
                                </div>
                            </div>
                        )}

                        {/* TITRE */}
                        <div className="space-y-4">
                            <label className="block font-black text-lg">Titre de la leçon *</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-14"
                                placeholder="Ex: Les fractions simples"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-4">
                            <label className="block font-black text-lg">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="textarea textarea-bordered w-full rounded-2xl h-32 bg-base-200/50 border-none focus:ring-2 ring-primary font-medium"
                                placeholder="Décrivez le contenu de la leçon... Mathy utilisera cette description pour générer le cours complet."
                            />
                        </div>

                        {/* CLASSE & DUREE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block font-black text-lg">Classe</label>
                                <div className="w-full h-14 px-6 rounded-2xl font-bold bg-base-200/50 text-primary flex items-center border-none">
                                    {formData.classe || 'Chargement...'}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block font-black text-lg">Durée estimée</label>
                                <input
                                    type="text"
                                    name="duree"
                                    value={formData.duree}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-14"
                                    placeholder="Ex: 45 min"
                                />
                            </div>
                        </div>

                        {/* THEME (CORRIGÉ POUR LA TRANSPARENCE) */}
                        <div className="space-y-4">
                            <label className="block font-black text-lg">Thème *</label>
                            <select
                                name="theme"
                                value={formData.theme}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                // Ajout de bg-base-100 pour forcer un fond opaque sur le select et ses options
                                className="select select-bordered w-full h-14 px-6 rounded-2xl font-bold bg-base-100 border-2 border-base-200 focus:border-primary focus:ring-0 text-primary transition-all cursor-pointer"
                            >
                                <option value="" disabled className="bg-base-100 text-base-content/50">Choisir un thème...</option>
                                <option value="CALCUL" className="bg-base-100 text-base-content py-4">Calcul et Opérations</option>
                                <option value="GEOMETRIE" className="bg-base-100 text-base-content py-4">Géométrie et Formes</option>
                                <option value="DENOMBREMENT" className="bg-base-100 text-base-content py-4">Dénombrement et Nombres</option>
                                <option value="GRANDEURS" className="bg-base-100 text-base-content py-4">Grandeurs et Mesures</option>
                            </select>
                        </div>

                        {/* INFO SUR L'IA */}
                        <div className="flex items-start gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-6">
                            <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                                <Sparkles className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="font-black text-primary">Mathy génère tout automatiquement</p>
                                <p className="text-sm opacity-60 font-medium mt-1">
                                    Le contenu complet + les exercices seront générés automatiquement selon le niveau de la classe à partir de votre titre et description.
                                </p>
                            </div>
                        </div>

                        {/* BUTTON */}
                        <div className="pt-10">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full rounded-[2rem] h-16 font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin mr-2" />
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={24} className="mr-2" />
                                        Générer avec Mathy
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

export default CreerLecon;