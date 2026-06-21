import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, ArrowRight, Loader2, Eye, Trash2, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

const MesLecons = () => {
    const navigate = useNavigate();
    const [lecons, setLecons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // AJOUT DE L'OPTION

    const fetchLecons = async () => {
        try {
            setLoading(true);
            const response = await api.get('/enseignant/lecons/');
            setLecons(response.data);
        } catch (err) {
            setError("Impossible de charger vos leçons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLecons(); }, []);

    const handleSupprimer = async (id) => {
        try {
            await api.delete(`/enseignant/lecons/${id}/`);
            setLecons(lecons.filter(l => l.id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic">Ouverture du grimoire...</p>
        </div>
    );

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Mes Leçons</h1>
                        <p className="text-base-content/50 font-medium italic">Partagez votre savoir avec vos élèves.</p>
                    </div>

                    {/* AJOUT DU SÉLECTEUR DE VUE */}
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

                        <button onClick={() => navigate('/enseignant/creer-lecon')} className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/20 normal-case">
                            <Plus size={20} className="mr-1" /> Créer une leçon
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {lecons.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <BookOpen size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Aucune leçon</h3>
                            <p className="opacity-50 max-sm mx-auto mb-8 font-medium">Utilisez notre IA pour créer votre premier support de cours en quelques secondes.</p>
                        </div>
                    ) : (
                        /* ADAPTATION DE L'AFFICHAGE SELON VIEWMODE */
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
                            {lecons.map(lecon => (
                                <div 
                                    key={lecon.id} 
                                    className={`group bg-base-100 border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex ${
                                        viewMode === 'grid' 
                                        ? "card rounded-[2.5rem] p-8 flex-col" 
                                        : "rounded-2xl p-4 flex-row items-center justify-between"
                                    }`}
                                >
                                    <div className={`flex ${viewMode === 'grid' ? "flex-col" : "flex-row items-center gap-6"}`}>
                                        <div className={`badge font-black text-[10px] uppercase tracking-widest px-3 py-3 rounded-lg border-none ${
                                            lecon.statut === 'publie' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                        } ${viewMode === 'grid' ? "mb-4 w-fit" : ""}`}>
                                            {lecon.statut === 'publie' ? '✓ Publiée' : '✎ Brouillon'}
                                        </div>
                                        
                                        <div className={viewMode === 'grid' ? "" : "flex flex-col"}>
                                            <h3 className="text-xl font-black mb-1 line-clamp-1">{lecon.titre}</h3>
                                            <p className="text-xs font-black uppercase opacity-30 tracking-widest">{lecon.classe}</p>
                                        </div>
                                    </div>

                                    {viewMode === 'grid' && (
                                        <>
                                            <p className="text-sm opacity-60 font-medium line-clamp-2 my-6">{lecon.description}</p>
                                            <div className="divider opacity-5 mb-6"></div>
                                        </>
                                    )}

                                    <div className={`flex gap-2 ${viewMode === 'grid' ? "w-full mt-auto" : ""}`}>
                                        <button 
                                            onClick={() => navigate(`/enseignant/lecons/${lecon.id}`)} 
                                            className={`btn btn-primary font-black normal-case ${viewMode === 'grid' ? "flex-1 rounded-2xl" : "rounded-xl btn-sm"}`}
                                        >
                                            {viewMode === 'grid' ? "Détails" : <Eye size={18}/>}
                                        </button>
                                        <button 
                                            onClick={() => handleSupprimer(lecon.id)} 
                                            className={`btn btn-ghost text-error ${viewMode === 'grid' ? "rounded-2xl" : "rounded-xl btn-sm"}`}
                                        >
                                            <Trash2 size={20}/>
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

export default MesLecons;