/**
 * COMPOSANT : AjouterEnfant
 * DESCRIPTION : Interface permettant au parent d'inscrire un nouvel enfant.
 * LOGIQUE : Envoie les données au backend et redirige vers la liste des enfants en cas de succès.
 * API : POST '/auth/ajouterEnfant/'
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2, Info } from 'lucide-react';
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

    return (
        /* 1. L'ESPACE DE FOND (Gris très léger) */
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">

            {/* 2. LE CONTENANT PRINCIPAL (Cadre Professionnel) */}
            <div className="max-w-4xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER INTERNE AVEC BOUTON RETOUR */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                            title="Retour à la liste"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight uppercase">
                                Nouvel Enfant
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <UserPlus size={18} className="text-primary" />
                                <p className="text-primary font-black italic">Création d'un compte élève</p>
                            </div>
                        </div>
                    </div>

                    {/* Badge indicatif */}
                    <div className="hidden md:flex bg-primary/5 p-4 rounded-2xl border border-primary/10 items-center gap-3">
                        <Info className="text-primary" size={24} />
                        <p className="text-[10px] font-black uppercase opacity-40 max-w-[120px] leading-tight">
                            L'enfant pourra se connecter avec son propre identifiant.
                        </p>
                    </div>
                </div>

                {/* 3. ZONE DU FORMULAIRE (Padding interne et centrage) */}
                <div className="flex-grow p-8 md:p-16 flex justify-center bg-base-100">
                    <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Affichage des erreurs globales si nécessaire */}
                        {typeof errors === 'string' && (
                            <div className="alert alert-error rounded-2xl mb-8 font-bold">
                                <span>{errors}</span>
                            </div>
                        )}

                        {/* Le Formulaire (On retire les styles redondants de AjouterEnfant.jsx pour laisser le cadre gérer l'espace) */}
                        <div className="relative">
                            {loading && (
                                <div className="absolute inset-0 z-10 bg-base-100/50 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                        <span className="font-black text-xs uppercase tracking-widest text-primary">Inscription...</span>
                                    </div>
                                </div>
                            )}

                            <FormulaireEnfant
                                onSubmit={handleInscriptionEnfant}
                                loading={loading}
                                backendErrors={errors}
                            />
                        </div>

                        {/* Note de sécurité en bas du formulaire */}
                        <p className="mt-8 text-center text-[10px] font-black uppercase opacity-20 tracking-tighter">
                            Les données de vos enfants sont sécurisées et privées.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterEnfant;