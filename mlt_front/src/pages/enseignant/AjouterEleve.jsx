import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

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

    // --- FETCH ÉLÈVES ---
    const fetchEleves = async (query, classe) => {
        try {
            setLoading(true);
            const response = await api.get(
                `/enseignant/rechercher-eleve/?q=${query}&classe=${classe || classeEnseignant}`
            );
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
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                
                {/* HEADER */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/enseignant/eleves')} className="btn btn-circle btn-ghost">
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">Ajouter un Élève</h1>
                            <p className="text-base-content/50 font-medium italic">
                                {classeEnseignant
                                    ? `Élèves disponibles en ${classeEnseignant}`
                                    : 'Chargement...'}
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
                                placeholder={`Filtrer les élèves de ${classeEnseignant || '...'}...`}
                                className="input input-bordered w-full pl-16 rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-16 text-lg"
                            />
                            {loading && (
                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        {success && (
                            <div className="alert bg-success/10 border-none rounded-2xl text-success font-bold p-4">
                                <CheckCircle size={22} />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert bg-error/10 border-none rounded-2xl text-error font-bold p-4">
                                <AlertCircle size={22} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Résultats */}
                        <div className="space-y-4">
                            {!loading && resultats.length > 0 ? (
                                <>
                                    <p className="text-sm font-black uppercase tracking-widest opacity-40 px-2">
                                        {resultats.length} élève(s) disponible(s) en {classeEnseignant}
                                    </p>
                                    <div className="grid gap-4">
                                        {resultats.map(eleve => (
                                            <div
                                                key={eleve.id}
                                                className="flex items-center justify-between p-6 bg-base-200/50 rounded-3xl border border-transparent hover:border-primary/30 hover:bg-base-200 transition-all group"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-primary text-primary-content rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                                        {eleve.prenom ? eleve.prenom[0] : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-xl text-base-content">
                                                            {eleve.prenom} {eleve.nom}
                                                        </p>
                                                        <p className="text-sm opacity-50 font-bold uppercase tracking-wider">
                                                            {eleve.username} • {eleve.classe}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleAjouter(eleve)}
                                                    disabled={loadingAjout === eleve.id}
                                                    className="btn btn-primary rounded-2xl normal-case font-black shadow-xl shadow-primary/10 px-6 h-12"
                                                >
                                                    {loadingAjout === eleve.id
                                                        ? <Loader2 size={20} className="animate-spin" />
                                                        : <><UserPlus size={20} className="mr-2" /> Ajouter</>
                                                    }
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : !loading && (
                                <div className="text-center py-20 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-content/5">
                                    <div className="bg-base-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Search size={32} className="opacity-20" />
                                    </div>
                                    <p className="text-xl font-black opacity-60">Aucun élève disponible</p>
                                    <p className="text-sm opacity-40 mt-2 font-medium max-w-xs mx-auto">
                                        Tous les élèves de {classeEnseignant} sont déjà inscrits ou aucun élève ne correspond à votre recherche.
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