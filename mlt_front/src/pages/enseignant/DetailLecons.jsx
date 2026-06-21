import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ClipboardList, Loader2, Clock, GraduationCap, Globe, EyeOff } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import ReactMarkdown from 'react-markdown';

const DetailLecon = () => {
    const navigate = useNavigate();
    // useParams récupère l'id de la leçon depuis l'URL
    const { id } = useParams();

    // --- ÉTATS ---
    // Stocke les données complètes de la leçon
    const [lecon, setLecon] = useState(null);
    // Indique si la requête de chargement est en cours
    const [loading, setLoading] = useState(true);
    // Indique si la requête de publication est en cours
    const [loadingStatut, setLoadingStatut] = useState(false);
    // Stocke le message d'erreur
    const [error, setError] = useState(null);
    // Message de succès après publication/dépublication
    const [successMsg, setSuccessMsg] = useState(null);

    // --- APPEL API ---
    // Récupère le détail d'une leçon par son id
    const fetchLecon = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/enseignant/lecons/${id}/`);
            setLecon(response.data);
        } catch (err) {
            console.error("Erreur récupération leçon:", err);
            setError("Impossible de charger le détail de la leçon.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecon();
    }, [id]);

    // --- ACTIONS ---
    // Change le statut (publié / brouillon)
    const handleToggleStatut = async () => {
        setLoadingStatut(true);
        try {
            const nouveauStatut = lecon.statut === 'publie' ? 'brouillon' : 'publie';
            const response = await api.patch(`/enseignant/lecons/${id}/`, {
                statut: nouveauStatut
            });
            setLecon(response.data);
            setSuccessMsg(nouveauStatut === 'publie' ? 'Leçon publiée aux élèves !' : 'Leçon remise en brouillon.');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStatut(false);
        }
    };

    // --- RENDU ---
    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER - Adapté de la structure MesExercices */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/enseignant/lecons')}
                            className="btn btn-circle btn-ghost"
                        >
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">
                                {loading ? "Chargement..." : lecon?.titre}
                            </h1>
                            <p className="text-base-content/50 font-medium italic">
                                {lecon?.classe} • {lecon?.theme}
                            </p>
                        </div>
                    </div>

                    {!loading && lecon && (
                        <button
                            onClick={handleToggleStatut}
                            disabled={loadingStatut}
                            className={`btn rounded-2xl font-black gap-2 ${
                                lecon.statut === 'publie' 
                                ? 'btn-ghost text-warning border-warning/20' 
                                : 'btn-primary shadow-lg shadow-primary/20'
                            }`}
                        >
                            {loadingStatut ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : lecon.statut === 'publie' ? (
                                <><EyeOff size={18} /> Retirer de la classe</>
                            ) : (
                                <><Globe size={18} /> Publier la leçon</>
                            )}
                        </button>
                    )}
                </div>

                {/* CONTENU - Garde toutes tes données et styles sans changement */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="font-black italic opacity-30">Chargement de la leçon...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error rounded-3xl text-white font-bold italic shadow-lg">
                            {error}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Alert Succès */}
                            {successMsg && (
                                <div className="alert alert-success rounded-2xl text-white font-bold italic mb-8 shadow-md">
                                    {successMsg}
                                </div>
                            )}

                            {/* Cartes d'infos */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                <div className="bg-base-200/30 p-8 rounded-[2rem] border border-base-content/5">
                                    <p className="text-xs font-black uppercase opacity-30 tracking-widest mb-4">Objectif pédagogique</p>
                                    <p className="font-bold text-lg leading-relaxed">{lecon.description}</p>
                                </div>

                                <div className="bg-base-200/30 p-8 rounded-[2rem] border border-base-content/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-30 tracking-widest mb-1">Durée estimée</p>
                                        <p className="font-black text-3xl">{lecon.duree}</p>
                                    </div>
                                    <Clock size={40} className="opacity-10 text-primary" />
                                </div>

                                <div className="bg-base-200/30 p-8 rounded-[2rem] border border-base-content/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-30 tracking-widest mb-1">Niveau</p>
                                        <p className="font-black text-3xl">{lecon.classe}</p>
                                    </div>
                                    <GraduationCap size={40} className="opacity-10 text-primary" />
                                </div>
                            </div>

                            {/* Zone de texte du contenu */}
                            <div className="bg-base-200/10 p-10 rounded-[2.5rem] border border-base-content/5 shadow-sm mb-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-base-200 rounded-2xl">
                                        <BookOpen className="text-primary" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                                        Contenu de la leçon
                                    </h2>
                                </div>

                                <div className="prose max-w-none opacity-80 font-medium leading-relaxed">

                                    {lecon.contenu ? (
                                        <ReactMarkdown>{lecon.contenu}</ReactMarkdown>
                                    ) : (
                                        <p className="opacity-40 italic text-center py-10">
                                            Le contenu de cette leçon n'a pas encore été généré.
                                        </p>
                                    )}

                                </div>
                            </div>

                            {/* BOUTONS BAS DE PAGE */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate(`/enseignant/lecons/${id}/exercices`)}
                                    className="btn btn-primary btn-lg rounded-2xl px-10 shadow-2xl shadow-primary/20 normal-case font-black gap-3"
                                >
                                    <ClipboardList size={22} />
                                    Voir les exercices
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailLecon;