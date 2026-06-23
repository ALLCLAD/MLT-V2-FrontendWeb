import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, 
    ArrowRight, 
    Loader2, 
    GraduationCap, 
    Clock, 
    ClipboardList, 
    Search, 
    LayoutGrid, 
    List 
} from 'lucide-react';
import api from '../../apiDjango/api.jsx';

const LeconsEnfant = () => {
    const navigate = useNavigate();

    // --- ÉTATS ---
    const [lecons, setLecons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // Structure calquée sur MesEleves

    // --- APPEL API ---
    const fetchLecons = async () => {
        try {
            setLoading(true);
            const response = await api.get('/enseignant/enfant/lecons/');
            setLecons(response.data);
        } catch (err) {
            console.error("Erreur récupération leçons:", err);
            setError("Impossible de charger les leçons.");
        } finally {
            setLoading(false);
        }
    };

    // --- EFFECT ---
    useEffect(() => {
        fetchLecons();
    }, []);

    // --- RENDU : Chargement (Style MesEleves) ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic">Mathy prépare tes leçons...</p>
        </div>
    );

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER (Structure MesEleves) */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Mes Leçons</h1>
                        <p className="text-base-content/50 font-medium italic">Apprends et progresse à ton rythme !</p>
                    </div>

                    {/* SÉLECTEUR DE VUE (Identique à MesEleves) */}
                    <div className="flex items-center gap-4">
                        <div className="join bg-base-200 p-1 rounded-2xl hidden sm:flex">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                className={`btn btn-sm join-item border-none ${viewMode === 'grid' ? 'btn-primary shadow-lg' : 'btn-ghost opacity-50'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')} 
                                className={`btn btn-sm join-item border-none ${viewMode === 'list' ? 'btn-primary shadow-lg' : 'btn-ghost opacity-50'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* GRILLE / LISTE DES LEÇONS */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error ? (
                        <div className="alert alert-error rounded-3xl font-bold shadow-lg max-w-2xl mx-auto">
                            <p>{error}</p>
                        </div>
                    ) : lecons.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <Search size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Aucune leçon</h3>
                            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">Reviens plus tard pour découvrir de nouveaux cours.</p>
                        </div>
                    ) : (
                        /* ADAPTATION DE L'AFFICHAGE SELON VIEWMODE */
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
                            {lecons.map((lecon) => (
                                <div 
                                    key={lecon.id}
                                    onClick={() => navigate(`/enfant/lecons/${lecon.id}`)}
                                    className={`bg-base-100 border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 cursor-pointer flex items-center group ${
                                        viewMode === 'grid' 
                                        ? "card rounded-[2.5rem] p-8 flex-col text-center" 
                                        : "rounded-2xl p-4 flex-row justify-between"
                                    }`}
                                >
                                    {/* Icône & Titre */}
                                    <div className={`flex items-center gap-4 ${viewMode === 'grid' ? "flex-col" : "flex-row"}`}>
                                        <div className={`${viewMode === 'grid' ? "w-16 h-16 mb-4" : "w-12 h-12"} bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content`}>
                                            <BookOpen size={viewMode === 'grid' ? 28 : 20} />
                                        </div>
                                        <div className={viewMode === 'grid' ? "" : "text-left"}>
                                            <h3 className="text-xl font-black group-hover:text-primary transition-colors">{lecon.titre}</h3>
                                            {viewMode === 'list' && (
                                                <p className="text-xs opacity-50 font-medium italic truncate max-w-xs">
                                                    {lecon.description || "Découvre cette leçon !"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description (uniquement en grille) */}
                                    {viewMode === 'grid' && (
                                        <p className="text-sm text-base-content/60 font-medium line-clamp-2 my-4 italic">
                                            {lecon.description || "Découvre cette nouvelle leçon passionnante !"}
                                        </p>
                                    )}
                                    
                                    {/* Badges / Infos */}
                                    <div className={`flex flex-wrap gap-2 ${viewMode === 'grid' ? "justify-center mb-6" : ""}`}>
                                        <div className="badge bg-primary/10 border-none text-primary font-black px-3 py-3 rounded-lg text-[10px] uppercase">
                                            <GraduationCap size={12} className="mr-1" /> {lecon.classe}
                                        </div>
                                        {viewMode === 'grid' && (
                                            <div className="badge bg-secondary/10 border-none text-secondary font-black px-3 py-3 rounded-lg text-[10px] uppercase">
                                                <Clock size={12} className="mr-1" /> {lecon.duree || '45 min'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bouton d'action (Style MesEleves) */}
                                    <div className={`flex gap-2 ${viewMode === 'grid' ? "w-full mt-auto" : ""}`}>
                                        <button className="btn btn-primary flex-1 rounded-xl font-black normal-case shadow-lg shadow-primary/20">
                                            Commencer
                                            <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeconsEnfant;