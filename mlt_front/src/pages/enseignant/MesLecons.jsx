import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, ArrowRight, Loader2, Eye, Trash2, AlertCircle, LayoutGrid, List, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

// 🦴 SKELETON LOADER COMPONENT (Premium experience)
const LessonCardSkeleton = ({ viewMode }) => {
    if (viewMode === 'grid') {
        return (
            <div className="card rounded-[2.5rem] border border-base-300 p-8 shadow-md bg-base-100 animate-pulse">
                <div className="w-20 h-6 bg-base-300 rounded-lg mb-4"></div>
                <div className="w-3/4 h-7 bg-base-300 rounded-xl mb-2"></div>
                <div className="w-1/4 h-4 bg-base-300 rounded-lg mb-6"></div>
                <div className="space-y-2 mb-6">
                    <div className="w-full h-4 bg-base-300 rounded-lg"></div>
                    <div className="w-5/6 h-4 bg-base-300 rounded-lg"></div>
                </div>
                <div className="divider opacity-50 my-4"></div>
                <div className="flex gap-2 w-full">
                    <div className="flex-1 h-12 bg-base-300 rounded-2xl"></div>
                    <div className="w-12 h-12 bg-base-300 rounded-2xl"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] border border-base-300 shadow-md bg-base-100 animate-pulse gap-6 w-full">
            <div className="flex items-center gap-6 w-full">
                <div className="w-20 h-6 bg-base-300 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="w-48 h-6 bg-base-300 rounded-lg"></div>
                    <div className="w-24 h-4 bg-base-300 rounded-lg"></div>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <div className="w-24 h-10 bg-base-300 rounded-xl"></div>
                <div className="w-10 h-10 bg-base-300 rounded-xl"></div>
            </div>
        </div>
    );
};

const MesLecons = () => {
    const navigate = useNavigate();
    const [lecons, setLecons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // PAGINATION STATES
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchLecons = async () => {
        try {
            setLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
            const [response] = await Promise.all([
                api.get('/enseignant/lecons/'),
                minDelay
            ]);
            setLecons(response.data);
        } catch (err) {
            console.error("Erreur chargement leçons:", err);
            setError("Impossible de charger vos leçons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLecons(); }, []);

    // Réinitialiser la page si on change de mode d'affichage ou si la liste change
    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode, lecons.length]);

    const handleSupprimer = async (id) => {
        const confirmDelete = window.confirm("⚠️ Attention : Voulez-vous vraiment supprimer cette leçon et tous ses exercices ?");
        if (confirmDelete) {
            try {
                await api.delete(`/enseignant/lecons/${id}/`);
                setLecons(prev => prev.filter(l => l.id !== id));
            } catch (err) {
                console.error("Erreur lors de la suppression de la leçon:", err);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    // LOGIQUE DE CALCUL DE LA PAGINATION
    const totalPages = Math.ceil(lecons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLecons = lecons.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-3">
                            <BookOpen size={14} /> Espace Cours
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-none">
                            Gestion de mes Leçons
                        </h1>
                        <p className="text-base-content/50 font-semibold italic mt-2">
                            Gérez vos supports de cours et concevez des contenus pédagogiques.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {lecons.length > 0 && (
                            <div className="join bg-base-200 p-1 rounded-2xl flex border border-base-300">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`btn btn-sm join-item border-none rounded-xl ${viewMode === 'grid' ? 'btn-primary shadow-sm' : 'btn-ghost opacity-60'}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn btn-sm join-item border-none rounded-xl ${viewMode === 'list' ? 'btn-primary shadow-sm' : 'btn-ghost opacity-60'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/enseignant/creer-lecon')}
                            className="btn btn-primary rounded-2xl px-6 font-black shadow-lg shadow-primary/20 normal-case hover:scale-105 transition-transform"
                        >
                            <Plus size={20} className="mr-1" /> Créer une leçon
                        </button>
                    </div>
                </div>

                {/* ZONE DE CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error && (
                        <div className="alert alert-error rounded-2xl font-bold mb-8 shadow-md border-none">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            : "space-y-4 max-w-4xl mx-auto"
                        }>
                            {[...Array(3)].map((_, i) => (
                                <LessonCardSkeleton key={i} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : lecons.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                            <div className="bg-gradient-to-tr from-primary/10 to-primary/5 w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <BookOpen size={54} className="text-primary animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-base-content">Aucune leçon disponible</h3>
                            <p className="text-base-content/60 max-w-sm mx-auto mb-8 font-semibold mt-2">
                                Vous n'avez pas encore créé de leçons. Utilisez Mathy pour concevoir votre premier cours interactif en quelques secondes !
                            </p>
                            <button
                                onClick={() => navigate('/enseignant/creer-lecon')}
                                className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/25 normal-case"
                            >
                                <Plus size={20} className="mr-1" /> Créer ma première leçon
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500"
                                : "space-y-4 max-w-4xl mx-auto animate-in fade-in duration-500"
                            }>
                                {paginatedLecons.map((lecon) => (
                                    <div
                                        key={lecon.id}
                                        className={`group relative bg-base-100 border border-base-200 transition-all duration-300 ${
                                            viewMode === 'grid'
                                                ? "card rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 p-8 shadow-lg shadow-base-200/50 flex flex-col"
                                                : "flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] hover:shadow-xl hover:border-primary/20 border shadow-md gap-6 w-full"
                                        }`}
                                    >
                                        {/* BOUTON SUPPRIMER */}
                                        <button
                                            onClick={() => handleSupprimer(lecon.id)}
                                            className={`absolute top-4 right-4 p-2 rounded-xl text-error opacity-60 md:opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition-all`}
                                            title="Supprimer la leçon"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        {/* CORPS PRINCIPAL */}
                                        <div className={`flex flex-col ${viewMode === 'grid' ? '' : 'sm:flex-row sm:items-center sm:gap-6'} w-full`}>
                                            <div className={`badge font-black text-[10px] uppercase tracking-widest px-3 py-3 rounded-lg border-none shrink-0 ${
                                                lecon.statut === 'publie' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                            } ${viewMode === 'grid' ? "mb-4 w-fit" : ""}`}>
                                                {lecon.statut === 'publie' ? '✓ Publiée' : '✎ Brouillon'}
                                            </div>
                                            
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xl font-black text-base-content truncate group-hover:text-primary transition-colors">
                                                    {lecon.titre}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="badge badge-sm bg-primary/10 border-none text-primary font-black px-2.5 py-2.5 rounded-lg flex items-center gap-1 w-fit">
                                                        <GraduationCap size={12} /> {lecon.classe}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {viewMode === 'grid' && (
                                            <>
                                                <p className="text-sm opacity-60 font-semibold line-clamp-2 my-5 leading-relaxed">
                                                    {lecon.description || "Aucune description de cours fournie."}
                                                </p>
                                                <div className="divider opacity-50 my-4 mt-auto"></div>
                                            </>
                                        )}

                                        {/* BOUTON D'ACTION PRINCIPAL */}
                                        <div className={viewMode === 'grid' ? "w-full" : "shrink-0 w-full sm:w-auto"}>
                                            <button
                                                onClick={() => navigate(`/enseignant/lecons/${lecon.id}`)}
                                                className={`btn ${viewMode === 'grid' ? 'btn-block btn-primary rounded-2xl shadow-md shadow-primary/15' : 'btn-primary px-6 rounded-xl'} font-black text-sm uppercase tracking-wide transition-all`}
                                            >
                                                {viewMode === 'grid' ? 'Détails' : (
                                                    <span className="flex items-center gap-1">
                                                        Détails <ArrowRight size={16} />
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION COMPONENT */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 border-t border-base-200 pt-8 animate-in fade-in duration-500">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="btn btn-ghost btn-sm rounded-xl font-black uppercase tracking-wider disabled:opacity-40"
                                    >
                                        Précédent
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`btn btn-sm rounded-xl w-10 h-10 p-0 font-black ${currentPage === pageNum ? 'btn-primary shadow-md' : 'btn-ghost'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-ghost btn-sm rounded-xl font-black uppercase tracking-wider disabled:opacity-40"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MesLecons;