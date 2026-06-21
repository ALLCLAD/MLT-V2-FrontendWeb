/**
 * COMPOSANT : EnfantsPage
 * DESCRIPTION : Affiche la liste des enfants et permet la gestion (vue/suppression).
 * LOGIQUE :
 * - GET /auth/ajouterEnfant/ -> Liste des enfants liés au parent
 * - DELETE /auth/ajouterEnfant/${id}/ -> Suppression définitive du compte enfant
 */

import React, { useState, useEffect } from 'react';
import { Plus, Baby, ArrowRight, Loader2, AlertCircle, LayoutGrid, List, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

const EnfantsPage = () => {
    const navigate = useNavigate();
    const [enfants, setEnfants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [deletingId, setDeletingId] = useState(null);

    // 1. RÉCUPÉRATION DE LA LISTE
    const fetchEnfants = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/ajouterEnfant/');
            setEnfants(response.data);
        } catch (err) {
            console.error("Erreur chargement enfants:", err);
            setError("Impossible de charger la liste de vos enfants.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEnfants(); }, []);

    // 2. LOGIQUE DE SUPPRESSION
    const handleDeleteEnfant = async (e, id, prenom) => {
        // Empêche le clic de déclencher la navigation vers le profil
        e.stopPropagation();

        const confirmDelete = window.confirm(
            `⚠️ Attention : Voulez-vous vraiment supprimer le compte de ${prenom} ? \n\nCette action supprimera définitivement ses progrès et ses accès.`
        );

        if (confirmDelete) {
            try {
                setDeletingId(id);
                // Appel DELETE vers ajouterEnfant/<int:pk>/
                await api.delete(`/auth/ajouterEnfant/${id}/`);

                // Mise à jour de l'interface sans recharger
                setEnfants(prev => prev.filter(enfant => enfant.id !== id));
            } catch (err) {
                console.error("Erreur suppression:", err);
                alert("Erreur lors de la suppression du compte.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="font-bold text-base-content/60 italic font-sans">Synchronisation de la famille...</p>
        </div>
    );

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div>
                        <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">
                            Mes Enfants
                        </h1>
                        <p className="text-base-content/50 font-medium italic">
                            Gérez les comptes et suivez les progrès de vos petits génies.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {enfants.length > 0 && (
                            <div className="join bg-base-200 p-1 rounded-2xl hidden sm:flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`btn btn-sm join-item border-none ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn btn-sm join-item border-none ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/parent/ajouter-enfant')}
                            className="btn btn-primary rounded-2xl px-8 font-black shadow-lg shadow-primary/20 normal-case"
                        >
                            <Plus size={20} className="mr-1" /> Inscrire un enfant
                        </button>
                    </div>
                </div>

                {/* ZONE DE CONTENU */}
                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    {error && (
                        <div className="alert alert-error rounded-2xl font-bold mb-8">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {enfants.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                <Baby size={48} className="opacity-20 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Votre famille est vide</h3>
                            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">
                                Aucun enfant n'est lié à votre compte. Ajoutez-en un pour commencer !
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            : "space-y-4 max-w-4xl mx-auto"
                        }>
                            {enfants.map((enfant) => (
                                <div
                                    key={enfant.id}
                                    className={`group relative bg-base-100 border border-base-200 transition-all duration-300 ${
                                        viewMode === 'grid'
                                            ? "card rounded-[2.5rem] hover:shadow-2xl hover:border-primary/20 p-8 shadow-sm"
                                            : "flex items-center justify-between p-6 rounded-[1.5rem] hover:bg-primary/5 hover:border-primary/20 shadow-sm"
                                    }`}
                                >
                                    {/* BOUTON SUPPRIMER (Apparaît au survol) */}
                                    <button
                                        onClick={(e) => handleDeleteEnfant(e, enfant.id, enfant.prenom)}
                                        disabled={deletingId === enfant.id}
                                        className={`absolute top-4 right-4 p-2 rounded-xl text-error opacity-0 group-hover:opacity-100 hover:bg-error/10 transition-all ${deletingId === enfant.id ? 'opacity-100' : ''}`}
                                    >
                                        {deletingId === enfant.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>

                                    <div className={`flex items-center ${viewMode === 'grid' ? 'flex-col text-center' : 'flex-row text-left'} gap-6`}>
                                        <div className="w-16 h-16 bg-primary text-primary-content rounded-[1.25rem] flex items-center justify-center text-2xl font-black shadow-inner">
                                            {enfant.prenom ? enfant.prenom[0].toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">{enfant.prenom} {enfant.nom}</h3>
                                            <div className={`flex items-center gap-2 mt-2 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                                                <span className="text-xs font-black uppercase opacity-30 tracking-widest">@{enfant.username}</span>
                                                <div className="badge badge-sm bg-primary/10 border-none text-primary font-black px-3 py-3 rounded-lg">{enfant.classe}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {viewMode === 'grid' && <div className="divider my-6 opacity-30"></div>}

                                    <div className={viewMode === 'grid' ? "w-full" : ""}>
                                        <button
                                            onClick={() => navigate(`/parent/enfants/${enfant.id}`)}
                                            className={`btn ${viewMode === 'grid' ? 'btn-block btn-primary rounded-2xl' : 'btn-circle btn-ghost text-primary'} font-black group-hover:scale-105 transition-transform`}
                                        >
                                            {viewMode === 'grid' ? 'Voir le Profil' : <ArrowRight size={24} />}
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

export default EnfantsPage;