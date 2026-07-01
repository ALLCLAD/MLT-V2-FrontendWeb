/**
 * COMPOSANT : AjouterEnfant
 * DESCRIPTION : Interface permettant au parent d'inscrire un nouvel enfant.
 * LOGIQUE : Envoie les données au backend et redirige vers la liste des enfants en cas de succès.
 * API : POST '/auth/ajouterEnfant/'
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Baby, BookOpen, TrendingUp, Award, Shield, AlertCircle } from 'lucide-react';
import FormulaireEnfant from '../../composants/UI/FormulaireEnfant';
import api from '../../apiDjango/api';

const AjouterEnfant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleInscriptionEnfant = async (data) => {
        setLoading(true);
        setErrors(null);
        try {
            const response = await api.post('/auth/ajouterEnfant/', data);
            navigate('/parent/enfants', { state: { message: response.data.message } });
        } catch (err) {
            setErrors(err.response?.data || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    // Helper pour afficher les erreurs globales
    const renderGlobalError = () => {
        if (!errors) return null;

        let errorMsg = null;
        if (typeof errors === 'string') {
            errorMsg = errors;
        } else if (errors.detail) {
            errorMsg = errors.detail;
        } else if (errors.non_field_errors) {
            errorMsg = Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors;
        }

        if (!errorMsg) return null;

        return (
            <div className="alert alert-error rounded-2xl mb-8 font-bold shadow-md border-none flex gap-3 items-center animate-in fade-in">
                <AlertCircle size={20} className="shrink-0" />
                <span>{errorMsg}</span>
            </div>
        );
    };

    return (
        /* 1. L'ESPACE DE FOND (Gris très léger, identique aux autres pages) */
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans">

            {/* 2. LE CONTENANT PRINCIPAL (Cadre Premium identique aux autres pages) */}
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden animate-in fade-in duration-500">

                {/* HEADER INTERNE AVEC BOUTON RETOUR & GRADIENT SUBTIL */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
                            title="Retour à la liste"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight uppercase leading-none">
                                Inscrire un enfant
                            </h1>
                            <p className="text-base-content/50 font-semibold italic mt-2 text-sm">
                                Créez un compte d'accès et suivez l'évolution de votre nouveau petit mathématicien.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. ZONE DU CONTENU (Double colonne : Gauche - Cadre dégradé / Droite - Formulaire) */}
                <div className="flex-grow p-8 md:p-12 lg:p-16 bg-base-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                        
                        {/* Colonne GAUCHE : Cadre d'incitation adaptatif (Thème clair/sombre automatique) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-primary/15 via-secondary/5 to-base-200/50 text-base-content rounded-[2.5rem] p-8 md:p-10 shadow-inner flex flex-col justify-between relative overflow-hidden border border-base-200 min-h-[450px]">
                            {/* Effets lumineux thématiques subtils en arrière-plan */}
                            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-52 h-52 bg-secondary/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-4">
                                        <Baby size={14} className="animate-pulse" /> Espace Famille
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight uppercase">
                                        Rejoignez l'aventure MLT
                                    </h3>
                                    <p className="text-base-content/75 font-medium text-xs mt-3 leading-relaxed">
                                        Offrez à votre enfant un parcours de mathématiques interactif, ludique et adapté à son rythme d'apprentissage.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Item 1 */}
                                    <div className="flex gap-4 items-start p-3 rounded-2xl bg-base-200/40 backdrop-blur-sm border border-base-300/40 hover:bg-base-200/60 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wide">Quiz Interactifs</h4>
                                            <p className="text-[11px] text-base-content/65 mt-1 leading-snug">
                                                Des leçons et exercices du CP1 au CM2 adaptés au programme scolaire officiel.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="flex gap-4 items-start p-3 rounded-2xl bg-base-200/40 backdrop-blur-sm border border-base-300/40 hover:bg-base-200/60 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wide">Suivi de Progression</h4>
                                            <p className="text-[11px] text-base-content/65 mt-1 leading-snug">
                                                Suivez les scores, l'activité récente et la maîtrise par thème en temps réel.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex gap-4 items-start p-3 rounded-2xl bg-base-200/40 backdrop-blur-sm border border-base-300/40 hover:bg-base-200/60 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wide">Motivation Vocale</h4>
                                            <p className="text-[11px] text-base-content/65 mt-1 leading-snug">
                                                Des voix TTS bienveillantes style Duolingo pour motiver votre enfant sans pression.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 pt-6 mt-6 border-t border-base-300/60 flex gap-3 items-center">
                                <Shield className="text-primary shrink-0 animate-bounce" size={16} />
                                <div className="text-[10px] text-base-content/50 leading-relaxed font-bold uppercase tracking-wider">
                                    Données sécurisées • Aucun e-mail obligatoire
                                </div>
                            </div>
                        </div>

                        {/* Colonne DROITE : Formulaire encadré */}
                        <div className="lg:col-span-7 flex flex-col justify-center w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* Affichage des erreurs globales */}
                            {renderGlobalError()}

                            {/* Conteneur de formulaire stylisé */}
                            <div className="relative bg-base-100 border border-base-200 p-6 md:p-8 rounded-[2.5rem] shadow-lg">
                                {loading && (
                                    <div className="absolute inset-0 z-10 bg-base-100/70 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                            <span className="font-black text-xs uppercase tracking-widest text-primary animate-pulse">Inscription en cours...</span>
                                        </div>
                                    </div>
                                )}

                                <FormulaireEnfant
                                    onSubmit={handleInscriptionEnfant}
                                    loading={loading}
                                    backendErrors={errors}
                                />
                            </div>

                            {/* Note de sécurité mobile */}
                            <p className="mt-8 text-center text-[10px] font-black uppercase opacity-20 tracking-tighter lg:hidden">
                                Les données de vos enfants sont sécurisées et privées.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterEnfant;