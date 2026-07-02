import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ClipboardList, Loader2, Clock, GraduationCap, PlayCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import ReactMarkdown from 'react-markdown';
import LecteurVocal from '../../composants/LecteurVocal';

// =========================================================
// SKELETON LOADER FOR LESSON DETAIL
// =========================================================
const DetailSkeleton = () => (
    <div className="animate-pulse space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-base-300 rounded-full" />
                <div className="space-y-2">
                    <div className="w-64 h-8 bg-base-300 rounded-lg" />
                    <div className="w-96 h-4 bg-base-200 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-base-200 rounded-3xl" />
                ))}
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
            <div className="w-48 h-8 bg-base-300 rounded-lg" />
            <div className="w-full h-12 bg-base-200 rounded-2xl" />
            <div className="h-64 bg-base-200/50 rounded-[2.5rem] p-8 space-y-4">
                <div className="w-full h-4 bg-base-300 rounded-lg" />
                <div className="w-5/6 h-4 bg-base-300 rounded-lg" />
                <div className="w-4/5 h-4 bg-base-300 rounded-lg" />
                <div className="w-full h-4 bg-base-300 rounded-lg" />
            </div>
        </div>
    </div>
);

const DetailLeconEnfant = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [lecon, setLecon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLecon = async () => {
        try {
            setLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 800));
            const [response] = await Promise.all([
                api.get(`/enseignant/enfant/lecons/${id}/`),
                minDelay
            ]);
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

    return (
        <div className="bg-base-200/30 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto bg-base-100 rounded-[3.5rem] shadow-2xl border border-base-200 min-h-[85vh] flex flex-col overflow-hidden">
                
                {/* BACK NAVIGATION BAR */}
                <div className="px-8 pt-8 md:pt-10 flex items-center justify-between border-b border-base-200/10 pb-4">
                    <button 
                        onClick={() => navigate('/enfant/lecons')} 
                        className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        title="Retour aux leçons"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest opacity-40">Mon Cours de Mathématiques</span>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-grow p-8 md:p-12">
                    {error ? (
                        <div className="max-w-md mx-auto py-12 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-1">Mince !</h3>
                                <p className="opacity-50 font-bold">{error || "Leçon introuvable."}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/enfant/lecons')} 
                                className="btn btn-ghost w-full rounded-2xl font-black border border-base-300 hover:bg-base-200"
                            >
                                <ArrowLeft size={16} className="mr-2" /> Retour aux leçons
                            </button>
                        </div>
                    ) : loading ? (
                        <DetailSkeleton />
                    ) : !lecon ? (
                        <div className="text-center py-12 opacity-50 italic">Leçon vide</div>
                    ) : (
                        <div className="space-y-10 animate-in fade-in duration-300">
                            
                            {/* HEADER CARD */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
                                        {lecon.titre}
                                    </h1>
                                    <p className="text-base-content/50 font-medium italic mt-2">
                                        {lecon.description || "Pas de description fournie."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-indigo-500/[0.03] p-5 rounded-3xl border border-indigo-500/10 flex items-center gap-4 shadow-sm">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                                            <GraduationCap size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-45 uppercase tracking-widest">Classe</p>
                                            <p className="text-lg font-black text-indigo-600">{lecon.classe}</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/[0.03] p-5 rounded-3xl border border-emerald-500/10 flex items-center gap-4 shadow-sm">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                                            <Clock size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-45 uppercase tracking-widest">Temps</p>
                                            <p className="text-lg font-black text-emerald-600">{lecon.duree || '45 min'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-500/[0.03] p-5 rounded-3xl border border-amber-500/10 flex items-center gap-4 shadow-sm">
                                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                                            <ClipboardList size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-45 uppercase tracking-widest">Défis</p>
                                            <p className="text-lg font-black text-amber-600">{lecon.nombre_exercices || 0} exercices</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COURSE BODY */}
                            <div className="space-y-6 pt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200/40 p-4 rounded-3xl border border-base-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-base-content">Lecture du cours</h2>
                                            <p className="text-xs opacity-50 font-bold">Écoute ou lis la leçon attentivement.</p>
                                        </div>
                                    </div>

                                    {/* VOICE READER */}
                                    {lecon.contenu && (
                                        <div className="w-full sm:w-auto">
                                            <LecteurVocal texte={lecon.contenu} />
                                        </div>
                                    )}
                                </div>

                                <div className="prose prose-indigo max-w-none font-medium leading-relaxed text-base-content/85 bg-base-200/20 p-8 md:p-12 rounded-[2.5rem] border border-base-200">
                                    {lecon.contenu ? (
                                        <ReactMarkdown>{lecon.contenu}</ReactMarkdown>
                                    ) : (
                                        <div className="text-center py-12 opacity-40 italic">
                                            Le contenu de cette leçon n'est pas encore disponible.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ACTION BUTTON */}
                            <div className="pt-8 border-t border-base-200 mt-8">
                                {lecon.nombre_exercices > 0 ? (
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="flex items-center gap-2 text-success">
                                            <CheckCircle size={18} />
                                            <span className="font-extrabold text-sm text-success-content/80">Leçon terminée !</span>
                                        </div>
                                        <p className="font-black text-lg italic opacity-70">
                                            Tu as tout bien compris ? Testons tes connaissances !
                                        </p>
                                        <button
                                            onClick={() => navigate(`/enfant/lecons/${id}/exercices`)}
                                            className="btn btn-primary btn-lg rounded-[2rem] px-10 h-16 shadow-xl shadow-primary/20 normal-case font-black text-lg gap-3 hover:scale-105 transition-all text-white"
                                        >
                                            <PlayCircle size={24} />
                                            C'est parti pour les exercices !
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center bg-base-200/30 p-6 rounded-3xl border border-dashed border-base-200">
                                        <p className="font-bold opacity-40 text-sm">
                                            Pas encore d'exercices disponibles pour cette leçon.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DetailLeconEnfant;