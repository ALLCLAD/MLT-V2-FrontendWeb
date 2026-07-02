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
    List,
    ChevronLeft,
    ChevronRight,
    Award
} from 'lucide-react';
import api from '../../apiDjango/api.jsx';

// =========================================================
// SKELETON LOADER COMPONENT FOR CHILD CARD GRID
// =========================================================
const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-base-100 border border-base-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-base-300 rounded-2xl" />
                <div className="w-32 h-6 bg-base-300 rounded-lg" />
                <div className="w-48 h-10 bg-base-200 rounded-lg" />
                <div className="flex gap-2 w-full justify-center">
                    <div className="w-16 h-5 bg-base-300 rounded-full" />
                    <div className="w-16 h-5 bg-base-300 rounded-full" />
                </div>
                <div className="w-full h-10 bg-base-300 rounded-xl mt-auto" />
            </div>
        ))}
    </div>
);

const ListSkeleton = () => (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-base-100 border border-base-200 rounded-2xl p-4 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-base-300 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                        <div className="w-40 h-5 bg-base-300 rounded-lg" />
                        <div className="w-2/3 h-4 bg-base-200 rounded-lg" />
                    </div>
                </div>
                <div className="w-24 h-8 bg-base-300 rounded-xl" />
            </div>
        ))}
    </div>
);

// Theme map for badges/icons decoration
const themeStyles = {
    CALCUL:        { label: 'Calcul', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    GEOMETRIE:     { label: 'Géométrie', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    DENOMBREMENT:  { label: 'Nombres', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    GRANDEURS:     { label: 'Grandeurs', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
};

const LeconsEnfant = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [lecons, setLecons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('ALL');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- API CALL ---
    const fetchLecons = async () => {
        try {
            setLoading(true);
            // Simulate minimal delay for smooth experience
            const minDelay = new Promise(resolve => setTimeout(resolve, 800));
            const [response] = await Promise.all([
                api.get('/enseignant/enfant/lecons/'),
                minDelay
            ]);
            setLecons(response.data);
        } catch (err) {
            console.error("Erreur récupération leçons:", err);
            setError("Impossible de charger les leçons pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecons();
    }, []);

    // Filter reset on change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedTheme, viewMode]);

    // --- FILTER LOGIC ---
    const filteredLecons = lecons.filter(lecon => {
        const matchesSearch = lecon.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lecon.description && lecon.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTheme = selectedTheme === 'ALL' || lecon.theme === selectedTheme;
        return matchesSearch && matchesTheme;
    });

    // --- PAGINATION LOGIC ---
    const totalPages = Math.max(1, Math.ceil(filteredLecons.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLecons = filteredLecons.slice(startIndex, startIndex + itemsPerPage);

    // Helpers
    const getThemeStyle = (themeKey) => {
        return themeStyles[themeKey] || { label: themeKey, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
    };

    return (
        <div className="bg-base-200/30 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3.5rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* 1. HEADER SECTION */}
                <div className="p-8 md:p-12 border-b border-base-200 bg-gradient-to-r from-base-100 via-base-200/10 to-base-200/20 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Award size={20} className="text-primary" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-primary">Mon Espace Apprentissage</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mt-1">
                                Mes Leçons
                            </h1>
                            <p className="text-base-content/50 font-medium italic mt-0.5">
                                Apprends en t'amusant et progresse à ton rythme !
                            </p>
                        </div>

                        {/* View Switcher */}
                        <div className="join bg-base-200 p-1 rounded-2xl">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                className={`btn btn-sm join-item border-none ${viewMode === 'grid' ? 'btn-primary text-white shadow-md' : 'btn-ghost opacity-60'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')} 
                                className={`btn btn-sm join-item border-none ${viewMode === 'list' ? 'btn-primary text-white shadow-md' : 'btn-ghost opacity-60'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-base-content" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une leçon..."
                                className="input input-bordered w-full rounded-2xl pl-12 bg-base-200/50 border-none focus:ring-2 ring-primary font-medium"
                            />
                        </div>

                        {/* Theme Filter Dropdown */}
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                            <button
                                onClick={() => setSelectedTheme('ALL')}
                                className={`btn btn-sm rounded-2xl font-black normal-case border-none px-4 ${
                                    selectedTheme === 'ALL'
                                        ? 'btn-primary text-white'
                                        : 'bg-base-200 text-base-content/75 hover:bg-base-200/80'
                                }`}
                            >
                                Tous les thèmes
                            </button>
                            {Object.keys(themeStyles).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTheme(key)}
                                    className={`btn btn-sm rounded-2xl font-black normal-case border-none px-4 ${
                                        selectedTheme === key
                                            ? 'btn-primary text-white'
                                            : 'bg-base-200 text-base-content/75 hover:bg-base-200/80'
                                    }`}
                                >
                                    {themeStyles[key].label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. BODY CONTENT SECTION */}
                <div className="flex-grow p-8 md:p-12 bg-base-100 flex flex-col">
                    {error ? (
                        <div className="alert alert-error rounded-[2rem] font-bold shadow-lg max-w-2xl mx-auto flex items-center gap-3">
                            <AlertTriangle />
                            <p>{error}</p>
                        </div>
                    ) : loading ? (
                        viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />
                    ) : filteredLecons.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center flex-grow">
                            <div className="bg-base-200 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6">
                                <Search size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Aucune leçon trouvée</h3>
                            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">
                                Essaie de modifier tes critères de recherche ou de filtre.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col justify-between">
                            {/* Render Container */}
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4 max-w-4xl mx-auto w-full"}>
                                {paginatedLecons.map((lecon) => {
                                    const themeStyle = getThemeStyle(lecon.theme);
                                    return (
                                        <div 
                                            key={lecon.id}
                                            onClick={() => navigate(`/enfant/lecons/${lecon.id}`)}
                                            className={`bg-base-100 border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center group ${
                                                viewMode === 'grid' 
                                                ? "card rounded-[2.5rem] p-8 flex-col text-center min-h-[320px] justify-between" 
                                                : "rounded-2xl p-4 flex-row justify-between"
                                            }`}
                                        >
                                            {/* Top info and Title */}
                                            <div className={`flex items-center gap-4 ${viewMode === 'grid' ? "flex-col w-full" : "flex-row flex-1 min-w-0"}`}>
                                                <div className={`${viewMode === 'grid' ? "w-16 h-16 mb-2" : "w-12 h-12 flex-shrink-0"} bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content`}>
                                                    <BookOpen size={viewMode === 'grid' ? 28 : 20} />
                                                </div>
                                                <div className={viewMode === 'grid' ? "w-full" : "text-left min-w-0 pr-4"}>
                                                    <h3 className="text-xl font-black group-hover:text-primary transition-colors truncate text-base-content">
                                                        {lecon.titre}
                                                    </h3>
                                                    <p className={`text-xs opacity-50 font-medium italic mt-1 ${viewMode === 'grid' ? "line-clamp-2 px-2" : "truncate"}`}>
                                                        {lecon.description || "Découvre cette nouvelle leçon passionnante !"}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Details Badges */}
                                            <div className={`flex flex-wrap gap-2 ${viewMode === 'grid' ? "justify-center my-4" : "mx-4 flex-shrink-0"}`}>
                                                <div className="badge bg-primary/10 border-none text-primary font-black px-3 py-3 rounded-lg text-[10px] uppercase">
                                                    <GraduationCap size={12} className="mr-1" /> {lecon.classe}
                                                </div>
                                                <div className={`badge border-none font-black px-3 py-3 rounded-lg text-[10px] uppercase ${themeStyle.color}`}>
                                                    {themeStyle.label}
                                                </div>
                                                {viewMode === 'grid' && (
                                                    <div className="badge bg-slate-500/10 border-none text-slate-600 font-black px-3 py-3 rounded-lg text-[10px] uppercase">
                                                        <Clock size={12} className="mr-1" /> {lecon.duree || '45 min'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Trigger Action */}
                                            <div className={`flex gap-2 ${viewMode === 'grid' ? "w-full" : "flex-shrink-0"}`}>
                                                <button className="btn btn-primary flex-grow rounded-xl font-black normal-case shadow-lg shadow-primary/20 text-white group-hover:scale-[1.02] transition-transform">
                                                    Commencer
                                                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-base-200">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="btn btn-circle btn-outline btn-sm border-base-300 hover:bg-primary hover:text-white"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`btn btn-sm btn-circle border-none ${
                                                    currentPage === page
                                                        ? 'btn-primary text-white shadow-md'
                                                        : 'bg-base-200 text-base-content hover:bg-base-300'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="btn btn-circle btn-outline btn-sm border-base-300 hover:bg-primary hover:text-white"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeconsEnfant;