import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Loader2, CheckCircle, AlertCircle, ArrowLeft, User, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

// 🦴 SKELETON LOADER FOR SEARCH RESULTS
const ResultCardSkeleton = () => (
    <div className="flex items-center justify-between p-6 bg-base-100 rounded-[2rem] border border-base-200 shadow-md animate-pulse gap-6">
        <div className="flex items-center gap-5 w-full">
            <div className="w-14 h-14 bg-base-300 rounded-[1.2rem] shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="w-48 h-6 bg-base-300 rounded-lg"></div>
                <div className="flex gap-2">
                    <div className="w-20 h-4 bg-base-300 rounded-lg"></div>
                    <div className="w-16 h-4 bg-base-300 rounded-lg"></div>
                </div>
            </div>
        </div>
        <div className="w-24 h-12 bg-base-300 rounded-2xl shrink-0"></div>
    </div>
);

const AjouterEleve = () => {
    const navigate = useNavigate();

    // --- ÉTATS ---
    const [recherche, setRecherche] = useState('');
    const [resultats, setResultats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAjout, setLoadingAjout] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [classeEnseignant, setClasseEnseignant] = useState('');

    // --- CHARGEMENT INITIAL ---
    useEffect(() => {
        const init = async () => {
            try {
                const profil = await api.get('/auth/user-profile/');
                setClasseEnseignant(profil.data.classe_enseignement);
                await fetchEleves('', profil.data.classe_enseignement);
            } catch (err) {
                console.error("Erreur init:", err);
                setLoading(false);
            }
        };
        init();
    }, []);

    // --- FETCH ÉLÈVES (délai min. 800ms pour skeleton) ---
    const fetchEleves = async (query, classe) => {
        try {
            setLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 800));
            const [response] = await Promise.all([
                api.get(`/enseignant/rechercher-eleve/?q=${query}&classe=${classe || classeEnseignant}`),
                minDelay
            ]);
            setResultats(response.data);
        } catch (err) {
            console.error("Erreur recherche:", err);
            setResultats([]);
        } finally {
            setLoading(false);
        }
    };

    // --- GESTION RECHERCHE ---
    const handleRecherche = (e) => {
        const valeur = e.target.value;
        setRecherche(valeur);
        setSuccess(null);
        setError(null);
        fetchEleves(valeur, classeEnseignant);
    };

    // --- AJOUT ---
    const handleAjouter = async (eleve) => {
        setLoadingAjout(eleve.id);
        setSuccess(null);
        setError(null);

        try {
            await api.post('/enseignant/eleves/', { eleve_id: eleve.id });
            setSuccess(`${eleve.prenom} ${eleve.nom} a été ajouté à votre classe !`);
            setResultats(resultats.filter(r => r.id !== eleve.id));
        } catch (err) {
            setError(err.response?.data?.message || "Cet élève est déjà dans votre classe.");
            setResultats(resultats.filter(r => r.id !== eleve.id));
        } finally {
            setLoadingAjout(null);
        }
    };

    return (
        <div className="bg-base-200/30 min-h-screen py-6 px-2 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl border border-base-200 min-h-[80vh] flex flex-col overflow-hidden animate-in fade-in duration-300">
                
                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/enseignant/eleves')} 
                            className="btn btn-circle btn-outline border-base-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
                                <UserPlus size={14} /> Inscriptions
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-none">
                                Ajouter un Élève
                            </h1>
                            <p className="text-base-content/50 font-semibold italic mt-2">
                                {classeEnseignant
                                    ? `Inscrivez des élèves de la classe ${classeEnseignant}`
                                    : 'Chargement des informations de classe...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-8 md:p-12 bg-base-100">
                    <div className="max-w-3xl mx-auto space-y-8">
                        
                        {/* Barre de recherche */}
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-base-content" size={24} />
                            <input
                                type="text"
                                value={recherche}
                                onChange={handleRecherche}
                                placeholder={`Rechercher un élève de la classe ${classeEnseignant || '...'}...`}
                                className="input w-full pl-16 rounded-2xl bg-base-200/50 border border-base-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold h-16 text-lg transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        {success && (
                            <div className="alert bg-success/10 border-none rounded-2xl text-success font-black p-4 flex gap-3 shadow-sm animate-in fade-in duration-300">
                                <CheckCircle size={22} className="shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert bg-error/10 border-none rounded-2xl text-error font-black p-4 flex gap-3 shadow-sm animate-in fade-in duration-300">
                                <AlertCircle size={22} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Résultats */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <ResultCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : resultats.length > 0 ? (
                                <>
                                    <p className="text-xs font-black uppercase tracking-widest opacity-40 px-2">
                                        {resultats.length} élève(s) disponible(s) en {classeEnseignant}
                                    </p>
                                    <div className="grid gap-4 animate-in fade-in duration-500">
                                        {resultats.map(eleve => (
                                            <div
                                                key={eleve.id}
                                                className="flex flex-col sm:flex-row items-center justify-between p-6 bg-base-100 border border-base-200 rounded-[2rem] hover:shadow-xl hover:border-primary/20 shadow-md gap-6 transition-all duration-300 group"
                                            >
                                                <div className="flex items-center gap-5 w-full">
                                                    <div className="w-14 h-14 bg-gradient-to-tr from-primary/80 to-primary text-primary-content rounded-[1.2rem] flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                                                        {eleve.prenom ? eleve.prenom[0].toUpperCase() : '?'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-black text-xl text-base-content truncate group-hover:text-primary transition-colors">
                                                            {eleve.prenom} {eleve.nom}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <span className="text-[10px] font-black uppercase opacity-40 tracking-wider flex items-center gap-1">
                                                                <User size={12} /> {eleve.username}
                                                            </span>
                                                            <div className="badge badge-sm bg-primary/10 border-none text-primary font-black px-2 py-2 rounded-lg flex items-center gap-1">
                                                                <GraduationCap size={12} /> {eleve.classe}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleAjouter(eleve)}
                                                    disabled={loadingAjout === eleve.id}
                                                    className="btn btn-primary rounded-2xl normal-case font-black shadow-lg shadow-primary/20 px-6 h-12 w-full sm:w-auto hover:scale-105 transition-transform shrink-0"
                                                >
                                                    {loadingAjout === eleve.id ? (
                                                        <Loader2 size={20} className="animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            <UserPlus size={18} /> Ajouter
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-base-100 rounded-[3rem] border border-base-200 shadow-sm animate-in fade-in duration-500">
                                    <div className="bg-gradient-to-tr from-primary/10 to-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <Search size={36} className="text-primary animate-pulse" />
                                    </div>
                                    <p className="text-2xl font-black text-base-content">Aucun élève disponible</p>
                                    <p className="text-base-content/60 max-w-sm mx-auto font-semibold mt-2 text-sm leading-relaxed">
                                        Tous les élèves de la classe <span className="text-primary font-black italic">{classeEnseignant}</span> sont déjà inscrits ou aucun élève ne correspond à votre recherche.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={() => navigate('/enseignant/eleves')}
                                className="btn btn-ghost w-full rounded-2xl font-black opacity-50 hover:opacity-100 h-14"
                            >
                                ← Retour à la liste de mes élèves
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterEleve;