import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ClipboardList, Loader2, Clock, GraduationCap, PlayCircle } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import ReactMarkdown from 'react-markdown';
// 1. Import du composant lecteur
import LecteurVocal from '../../composants/LecteurVocal';

const DetailLeconEnfant = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [lecon, setLecon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLecon = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/auth/enfant/lecons/${id}/`);
            setLecon(response.data);
        } catch (err) {
            console.error("Erreur récupération leçon:", err);
            setError("Impossible de charger cette leçon.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecon();
        const enregistrerLecture = async () => {
            try {
                await api.post(`/communication/lecture/${id}/`);
            } catch (err) { console.error("Erreur enregistrement lecture"); }
        };
        enregistrerLecture();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-black opacity-50 text-lg">Préparation de ta leçon...</p>
            </div>
        );
    }

    if (error || !lecon) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-4">
                <div className="alert alert-error rounded-3xl shadow-lg font-bold">
                    <p>{error || "Leçon introuvable"}</p>
                </div>
                <button onClick={() => navigate('/enfant/lecons')} className="btn btn-ghost mt-4 w-full font-black">
                    <ArrowLeft size={18} className="mr-2" /> Retour aux leçons
                </button>
            </div>
        );
    }

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="p-8 md:p-12 border-b border-base-200 bg-base-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/enfant/lecons')} className="btn btn-circle btn-ghost">
                                <ArrowLeft />
                            </button>
                            <div>
                                <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">{lecon.titre}</h1>
                                <p className="text-base-content/50 font-medium italic">{lecon.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black opacity-40 uppercase tracking-widest">Classe</p>
                                <p className="text-xl font-black text-primary">{lecon.classe}</p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black opacity-40 uppercase tracking-widest">Temps</p>
                                <p className="text-xl font-black text-secondary">{lecon.duree || '45 min'}</p>
                            </div>
                        </div>

                        <div className="bg-accent/5 p-6 rounded-[2rem] border border-accent/10 flex items-center gap-4">
                            <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black opacity-40 uppercase tracking-widest">Défis</p>
                                <p className="text-xl font-black text-accent">{lecon.nombre_exercices || 0} exercices</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENU DU COURS */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-base-200 rounded-2xl">
                                <BookOpen className="text-primary" size={24} />
                            </div>
                            <h2 className="text-2xl font-black">Lecture du cours</h2>
                        </div>

                        {/* 2. AJOUT DU LECTEUR VOCAL ICI */}
                        {lecon.contenu && (
                            <LecteurVocal texte={lecon.contenu} />
                        )}

                        <div className="prose prose-lg max-w-none font-medium leading-relaxed whitespace-pre-line text-base-content/80 bg-base-200/30 p-8 md:p-12 rounded-[2.5rem] border border-base-content/5">
                            {lecon.contenu ? (
                                <ReactMarkdown>{lecon.contenu}</ReactMarkdown>
                            ) : (
                                <div className="text-center py-10 opacity-40 italic">
                                    Le contenu de cette leçon n'est pas encore disponible.
                                </div>
                            )}
                        </div>

                        {/* SECTION ACTION */}
                        <div className="mt-12 pt-10 border-t border-base-200">
                            {lecon.nombre_exercices > 0 ? (
                                <div className="flex flex-col items-center text-center">
                                    <p className="font-black text-xl mb-6 italic opacity-70">Tu as tout bien compris ?</p>
                                    <button
                                        onClick={() => navigate(`/enfant/lecons/${id}/exercices`)}
                                        className="btn btn-primary btn-lg rounded-[2rem] px-12 h-20 shadow-2xl shadow-primary/30 normal-case font-black text-2xl gap-4 hover:scale-105 transition-transform"
                                    >
                                        <PlayCircle size={32} />
                                        C'est parti pour les exercices !
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center bg-base-200/50 p-8 rounded-3xl border border-dashed border-base-content/10">
                                    <p className="font-bold opacity-40">Pas encore d'exercices disponibles pour cette leçon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailLeconEnfant;