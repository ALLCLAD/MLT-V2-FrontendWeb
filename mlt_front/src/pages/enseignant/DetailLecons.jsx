import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ClipboardList, Loader2, Clock, GraduationCap, Globe, EyeOff, Download, FileText, ChevronDown, Award } from "lucide-react";
import api from "../../apiDjango/api.jsx";
import ReactMarkdown from "react-markdown";

// 🦴 SKELETON LOADERS
const HeaderSkeleton = () => (
    <div className="p-8 md:p-12 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                <div className="space-y-3">
                    <div className="w-64 h-8 bg-base-300 rounded-xl"></div>
                    <div className="w-40 h-4 bg-base-300 rounded-lg"></div>
                </div>
            </div>
            <div className="w-44 h-12 bg-base-300 rounded-2xl hidden md:block"></div>
        </div>
    </div>
);

const DetailLeconSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-base-200/50 h-36 rounded-[2rem]"></div>
            <div className="bg-base-200/50 h-36 rounded-[2rem]"></div>
            <div className="bg-base-200/50 h-36 rounded-[2rem]"></div>
        </div>
        <div className="bg-base-200/30 h-[450px] rounded-[2.5rem]"></div>
    </div>
);

const DetailLecon = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [lecon, setLecon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStatut, setLoadingStatut] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    // --- APPEL API ---
    const fetchLecon = async () => {
        try {
            setLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
            const [response] = await Promise.all([
                api.get(`/enseignant/lecons/${id}/`),
                minDelay
            ]);
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

    // Change le statut (publié / brouillon)
    const handleToggleStatut = async () => {
        setLoadingStatut(true);
        try {
            const nouveauStatut = lecon.statut === "publie" ? "brouillon" : "publie";
            const response = await api.patch(`/enseignant/lecons/${id}/`, { statut: nouveauStatut });
            setLecon(response.data);
            setSuccessMsg(nouveauStatut === "publie" ? "Leçon publiée aux élèves de la classe !" : "Leçon remise en brouillon.");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStatut(false);
        }
    };

    // Télécharger la leçon en PDF ou Word
    const handleDownload = async (format) => {
        setLoadingDownload(true);
        setShowDownloadMenu(false);
        try {
            const response = await api.get(`/enseignant/lecons/${id}/telecharger/?export_format=${format}`, {
                responseType: "blob"
            });
            const mimeType = format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${lecon.titre.replace(/ /g, "_")}_${lecon.classe}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setSuccessMsg(`Téléchargement ${format.toUpperCase()} lancé !`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error("Erreur téléchargement:", err);
        } finally {
            setLoadingDownload(false);
        }
    };

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER */}
                {loading ? (
                    <HeaderSkeleton />
                ) : (
                    <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => navigate('/enseignant/lecons')}
                                className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
                                    <BookOpen size={14} /> Fiche de Cours
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-none">
                                    {lecon?.titre}
                                </h1>
                                <p className="text-base-content/50 font-semibold italic mt-2">
                                    Classe : {lecon?.classe} • Thème : {lecon?.theme}
                                </p>
                            </div>
                        </div>

                        {lecon && (
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                {/* Bouton de téléchargement */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDownloadMenu(prev => !prev)}
                                        disabled={loadingDownload}
                                        className="btn btn-ghost rounded-2xl font-black gap-2 border-2 border-base-200 hover:border-primary/30 normal-case"
                                    >
                                        {loadingDownload ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                                        Télécharger
                                        <ChevronDown size={14} />
                                    </button>
                                    {showDownloadMenu && (
                                        <div className="absolute right-0 top-full mt-2 bg-base-100 border-2 border-base-200 rounded-2xl shadow-2xl shadow-base-300/30 z-50 overflow-hidden min-w-[190px] animate-in zoom-in-95 duration-200">
                                            <button onClick={() => handleDownload("pdf")}
                                                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-base-200/60 font-bold text-sm transition-colors text-left">
                                                <FileText size={16} className="text-error" /> Exporter en PDF
                                            </button>
                                            <button onClick={() => handleDownload("docx")}
                                                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-base-200/60 font-bold text-sm transition-colors border-t border-base-200 text-left">
                                                <FileText size={16} className="text-blue-500" /> Exporter en Word
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Bouton publication */}
                                <button
                                    onClick={handleToggleStatut}
                                    disabled={loadingStatut}
                                    className={`btn rounded-2xl font-black gap-2 normal-case ${
                                        lecon.statut === "publie" 
                                            ? "btn-ghost text-warning border border-warning/20 hover:bg-warning/10" 
                                            : "btn-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                    }`}
                                >
                                    {loadingStatut ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : lecon.statut === "publie" ? (
                                        <><EyeOff size={18} /> Retirer de la classe</>
                                    ) : (
                                        <><Globe size={18} /> Publier la leçon</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ZONE DE CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error && (
                        <div className="alert alert-error rounded-2xl font-bold mb-8 shadow-md border-none">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <DetailLeconSkeleton />
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom duration-500 space-y-12">
                            {/* Alert Succès */}
                            {successMsg && (
                                <div className="alert bg-success/10 border-none rounded-2xl text-success font-black p-4 flex gap-3 shadow-sm animate-in fade-in duration-300">
                                    <Award size={22} className="shrink-0" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            {/* Cartes d'infos */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-wider mb-3">Objectif pédagogique</p>
                                    <p className="font-semibold text-base leading-relaxed text-base-content/85">{lecon.description || "Aucune description de cours."}</p>
                                </div>

                                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-wider mb-2">Durée estimée</p>
                                        <p className="font-black text-3xl text-primary">{lecon.duree || "45 min"}</p>
                                    </div>
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                        <Clock size={28} />
                                    </div>
                                </div>

                                <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase opacity-40 tracking-wider mb-2">Niveau ciblé</p>
                                        <p className="font-black text-3xl text-primary">{lecon.classe}</p>
                                    </div>
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                        <GraduationCap size={28} />
                                    </div>
                                </div>
                            </div>

                            {/* Zone de texte du contenu */}
                            <div className="bg-base-100 p-8 md:p-12 rounded-[2.5rem] border border-base-200 shadow-lg shadow-base-200/50">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                                        <BookOpen size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                                        Contenu de la leçon
                                    </h2>
                                </div>

                                <div className="prose prose-sm max-w-none text-base-content opacity-90 font-medium leading-relaxed prose-headings:font-black prose-p:leading-relaxed">
                                    {lecon.contenu ? (
                                        <ReactMarkdown>{lecon.contenu}</ReactMarkdown>
                                    ) : (
                                        <p className="opacity-40 italic text-center py-12">
                                            Le contenu de cette leçon n'a pas encore été rédigé.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* BOUTONS BAS DE PAGE */}
                            <div className="flex justify-end pt-4 border-t border-base-200">
                                <button
                                    onClick={() => navigate(`/enseignant/lecons/${id}/exercices`)}
                                    className="btn btn-primary rounded-2xl px-10 h-16 shadow-xl shadow-primary/20 normal-case font-black gap-3 hover:scale-105 transition-all text-lg"
                                >
                                    <ClipboardList size={22} />
                                    Voir les exercices associés
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