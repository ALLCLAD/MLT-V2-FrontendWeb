import React, { useState, useEffect } from 'react';
import { Plus, Users, ArrowRight, Loader2, UserMinus, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

const MesEleves = () => {
    const navigate = useNavigate();
    const [eleves, setEleves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalSupprimer, setModalSupprimer] = useState(null);
    const [loadingSupprimer, setLoadingSupprimer] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // AJOUT DE L'OPTION

    const fetchEleves = async () => {
        try {
            setLoading(true);
            const response = await api.get('/enseignant/eleves/');
            setEleves(response.data);
        } catch (err) {
            setError("Impossible de charger vos élèves.");
        } finally {
            setLoading(false);
        }
    };

    const handleSupprimerEleve = async (eleveId) => {
        try {
            setLoadingSupprimer(true);
            await api.delete(`/enseignant/eleves/${eleveId}/supprimer/`);
            setEleves(prev => prev.filter(e => e.id !== eleveId));
            setModalSupprimer(null);
        } catch (err) {
            alert("Erreur lors de la suppression.");
        } finally {
            setLoadingSupprimer(false);
        }
    };

    useEffect(() => { fetchEleves(); }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic">Appel en classe...</p>
        </div>
    );

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Mes Élèves</h1>
                        <p className="text-base-content/50 font-medium italic">Suivez l'évolution de votre classe.</p>
                    </div>

                    {/* AJOUT DU SÉLECTEUR DE VUE (L'OPTION SUR L'IMAGE) */}
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

                        <button onClick={() => navigate('/enseignant/ajouter-eleve')} className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/20 normal-case">
                            <Plus size={20} className="mr-1" /> Ajouter un élève
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {eleves.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <Users size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Classe vide</h3>
                            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">Inscrivez vos élèves pour leur assigner des leçons et des exercices.</p>
                        </div>
                    ) : (
                        /* ADAPTATION DE L'AFFICHAGE SELON VIEWMODE */
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4 max-w-4xl mx-auto"}>
                            {eleves.map(eleve => (
                                <div 
                                    key={eleve.id} 
                                    className={`bg-base-100 border border-base-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex items-center ${
                                        viewMode === 'grid' 
                                        ? "card rounded-[2.5rem] p-8 flex-col text-center" 
                                        : "rounded-2xl p-4 flex-row justify-between"
                                    }`}
                                >
                                    <div className={`flex items-center gap-4 ${viewMode === 'grid' ? "flex-col" : "flex-row"}`}>
                                        <div className={`${viewMode === 'grid' ? "w-20 h-20 text-3xl mb-6" : "w-12 h-12 text-xl"} bg-primary text-primary-content rounded-[1.5rem] flex items-center justify-center font-black shadow-inner`}>
                                            {eleve.prenom ? eleve.prenom[0].toUpperCase() : '?'}
                                        </div>
                                        <div className={viewMode === 'grid' ? "" : "text-left"}>
                                            <h3 className="text-xl font-black">{eleve.prenom} {eleve.nom}</h3>
                                            <span className="text-xs font-black uppercase opacity-30 tracking-widest mt-1">@{eleve.username}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={`badge bg-primary/10 border-none text-primary font-black px-4 py-4 rounded-xl ${viewMode === 'grid' ? "my-6" : ""}`}>
                                        {eleve.classe}
                                    </div>

                                    <div className={`flex gap-2 ${viewMode === 'grid' ? "w-full mt-auto" : ""}`}>
                                        <button onClick={() => navigate(`/enseignant/eleves/${eleve.id}/scores`)} className="btn btn-ghost flex-1 font-black normal-case">Scores</button>
                                        <button onClick={() => setModalSupprimer(eleve)} className="btn btn-ghost text-error rounded-xl"><UserMinus size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Suppression */}
            {modalSupprimer && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <UserMinus size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Retirer l'élève ?</h3>
                        <p className="opacity-50 font-medium mb-8">Voulez-vous vraiment retirer <b>{modalSupprimer.prenom}</b> de votre liste ?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setModalSupprimer(null)} className="btn btn-ghost flex-1 rounded-2xl font-black">Annuler</button>
                            <button onClick={() => handleSupprimerEleve(modalSupprimer.id)} className={`btn btn-error flex-1 rounded-2xl font-black ${loadingSupprimer ? 'loading' : ''}`}>Retirer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesEleves;