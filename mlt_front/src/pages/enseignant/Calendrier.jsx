import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Loader2, BookOpen, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../apiDjango/api.jsx';

const Calendrier = () => {
    const navigate = useNavigate();

    // --- ÉTATS ---
    // Date actuelle pour naviguer dans le calendrier
    const [dateActuelle, setDateActuelle] = useState(new Date());

    // Liste des événements du calendrier
    const [evenements, setEvenements] = useState([]);

    // Liste des leçons de l'enseignant pour planifier
    const [lecons, setLecons] = useState([]);

    // Indique si la requête est en cours
    const [loading, setLoading] = useState(true);

    // Contrôle l'affichage du modal d'ajout d'événement
    const [showModal, setShowModal] = useState(false);

    // Jour sélectionné pour ajouter un événement
    const [jourSelectionne, setJourSelectionne] = useState(null);

    // Données du nouvel événement
    const [nouvelEvenement, setNouvelEvenement] = useState({
        titre: '',
        lecon_id: '',
        type: '', // cours, reunion, autre
        heure: '',
    });

    // Noms des mois en français
    const mois = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Noms des jours en français
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // --- APPEL API ---
    // Récupère les événements et les leçons en même temps
   const fetchData = async () => {
    try {
        const [evenementsRes, leconsRes] = await Promise.all([
            api.get('/enseignant/calendrier/'),
            api.get('/enseignant/lecons/')
        ]);
        setEvenements(evenementsRes.data.map(e => ({
            ...e,
            date: new Date(e.date), // Convertit la date en objet Date
            type: e.type_evenement, // Assure que le type est bien défini
        })));
        setLecons(leconsRes.data);
    } catch (err) {
        console.error("Erreur chargement calendrier:", err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchData();
    }, []);
    // --- NAVIGATION ---
    // Mois précédent
    const moisPrecedent = () => {
        setDateActuelle(new Date(
            dateActuelle.getFullYear(),
            dateActuelle.getMonth() - 1,
            1
        ));
    };

    // Mois suivant
    const moisSuivant = () => {
        setDateActuelle(new Date(
            dateActuelle.getFullYear(),
            dateActuelle.getMonth() + 1,
            1
        ));
    };

    // --- GÉNÉRATION DU CALENDRIER ---
    // Calcule tous les jours à afficher dans le calendrier
    const genererJours = () => {
        const annee = dateActuelle.getFullYear();
        const moisIndex = dateActuelle.getMonth();

        // Premier jour du mois
        const premierJour = new Date(annee, moisIndex, 1);

        // Dernier jour du mois
        const dernierJour = new Date(annee, moisIndex + 1, 0);

        // Jour de la semaine du premier jour (0=Dim, 1=Lun...)
        // On ajuste pour commencer par Lundi
        let debutSemaine = premierJour.getDay() - 1;
        if (debutSemaine < 0) debutSemaine = 6;

        const jours = [];

        // Jours du mois précédent pour remplir le début
        for (let i = debutSemaine; i > 0; i--) {
            const date = new Date(annee, moisIndex, 1 - i);
            jours.push({ date, moisActuel: false });
        }

        // Jours du mois actuel
        for (let i = 1; i <= dernierJour.getDate(); i++) {
            const date = new Date(annee, moisIndex, i);
            jours.push({ date, moisActuel: true });
        }

        // Jours du mois suivant pour remplir la fin
        const reste = 42 - jours.length;
        for (let i = 1; i <= reste; i++) {
            const date = new Date(annee, moisIndex + 1, i);
            jours.push({ date, moisActuel: false });
        }

        return jours;
    };

    // --- ÉVÉNEMENTS PAR JOUR ---
    // Retourne les événements d'un jour spécifique
    const getEvenementsJour = (date) => {
        return evenements.filter(e => {
            const dateEvenement = new Date(e.date);
            return (
                dateEvenement.getDate() === date.getDate() &&
                dateEvenement.getMonth() === date.getMonth() &&
                dateEvenement.getFullYear() === date.getFullYear()
            );
        });
    };

    // --- VÉRIFICATION AUJOURD'HUI ---
    const estAujourdhui = (date) => {
        const aujourd = new Date();
        return (
            date.getDate() === aujourd.getDate() &&
            date.getMonth() === aujourd.getMonth() &&
            date.getFullYear() === aujourd.getFullYear()
        );
    };

    // --- AJOUT D'ÉVÉNEMENT ---
    // Ouvre le modal pour ajouter un événement sur un jour
    const handleClickJour = (date) => {
        setJourSelectionne(date);
        setNouvelEvenement({
            titre: '',
            lecon_id: '',
            type: '',
            heure: '',
        });
        setShowModal(true);
    };

    // Sauvegarde l'événement localement
    // (sera connecté au backend plus tard)
    const handleAjouterEvenement = async (e) => {
        e.preventDefault();
        if (!nouvelEvenement.type) {
            alert("Veuillez sélectionner un type d'événement.");
            return;
        }
        if (nouvelEvenement.type === 'cours' && !nouvelEvenement.lecon_id) {
            alert("Veuillez sélectionner une leçon pour un événement de type 'Cours'.");
            return;
        }
        if (nouvelEvenement.type !== 'cours' && !nouvelEvenement.titre.trim()) {
            alert("Veuillez entrer un titre pour l'événement.");
            return;
        }
        try {
            const payload = {
                date: jourSelectionne.toISOString().split('T')[0],
                type_evenement: nouvelEvenement.type,
                heure: nouvelEvenement.heure || "",
                titre: nouvelEvenement.titre || "Événement",
                lecon_id: nouvelEvenement.lecon_id || null,
                enseignant: 1
            };
                        if (nouvelEvenement.type === 'cours') {
                payload.lecon_id = nouvelEvenement.lecon_id;
            } else {
                payload.titre = nouvelEvenement.titre;
            }
            const res = await api.post('/enseignant/calendrier/', payload);
            setEvenements([...evenements, {
                id: res.data.id,
                date: new Date(res.data.date),
                type: res.data.type_evenement,
                titre: res.data.titre || (lecons.find(l => l.id === res.data.lecon_id)?.titre || 'Cours'),
                heure: res.data.heure,
            }]);
            setShowModal(false);
        } catch (err) {
            console.error("Erreur ajout événement:", err.response?.data);
            alert(JSON.stringify(err.response?.data));
        }
    };
    // Supprime un événement
    const handleSupprimerEvenement = async (id) => {
    try {
        await api.delete(`/enseignant/calendrier/${id}/`);
        setEvenements(evenements.filter(e => e.id !== id));
    } catch (err) {
        console.error("Erreur suppression événement:", err);
    }
};

    // Couleur selon le type d'événement
    const getCouleurType = (type) => {
        switch (type) {
            case 'cours': return 'bg-primary/20 text-primary border-primary/30';
            case 'reunion': return 'bg-warning/20 text-warning border-warning/30';
            default: return 'bg-base-300 text-base-content border-base-300';
        }
    };

    // --- RENDU CONDITIONNEL : Chargement ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-bold opacity-50">Chargement du calendrier...</p>
            </div>
        );
    }

    const joursCalendrier = genererJours();

    return (
        <div className="animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Calendrier</h1>
                    <p className="opacity-50 font-medium italic">
                        Planifiez vos cours et événements.
                    </p>
                </div>

                {/* Bouton ajouter événement */}
                <button
                    onClick={() => {
                        setJourSelectionne(new Date());
                        setShowModal(true);
                    }}
                    className="btn btn-primary rounded-2xl px-6 shadow-xl shadow-primary/20 normal-case font-black group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Ajouter un événement
                </button>
            </div>

            {/* CALENDRIER PRINCIPAL */}
            <div className="bg-base-100 rounded-[3rem] border border-base-content/5 shadow-sm overflow-hidden">

                {/* NAVIGATION MOIS */}
                <div className="flex items-center justify-between p-6 border-b border-base-content/5">

                    {/* Bouton mois précédent */}
                    <button
                        onClick={moisPrecedent}
                        className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Titre mois + année */}
                    <h2 className="text-2xl font-black">
                        {mois[dateActuelle.getMonth()]} {dateActuelle.getFullYear()}
                    </h2>

                    {/* Bouton mois suivant */}
                    <button
                        onClick={moisSuivant}
                        className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* EN-TÊTES DES JOURS */}
                <div className="grid grid-cols-7 border-b border-base-content/5">
                    {jours.map(jour => (
                        <div
                            key={jour}
                            className="p-3 text-center text-xs font-black uppercase tracking-widest opacity-40"
                        >
                            {jour}
                        </div>
                    ))}
                </div>

                {/* GRILLE DES JOURS */}
                <div className="grid grid-cols-7">
                    {joursCalendrier.map((item, index) => {
                        const evenementsJour = getEvenementsJour(item.date);
                        const aujourd = estAujourdhui(item.date);

                        return (
                            <div
                                key={index}
                                onClick={() => item.moisActuel && handleClickJour(item.date)}
                                className={`min-h-[100px] p-2 border-b border-r border-base-content/5 transition-all
                                    ${item.moisActuel
                                        ? 'cursor-pointer hover:bg-primary/5'
                                        : 'opacity-30 cursor-default'
                                    }
                                    ${aujourd ? 'bg-primary/5' : ''}
                                `}
                            >
                                {/* Numéro du jour */}
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-black mb-1
                                    ${aujourd
                                        ? 'bg-primary text-primary-content shadow-lg shadow-primary/30'
                                        : 'hover:bg-base-200'
                                    }
                                `}>
                                    {item.date.getDate()}
                                </div>

                                {/* Événements du jour */}
                                <div className="flex flex-col gap-1">
                                    {evenementsJour.slice(0, 2).map(evenement => (
                                        <div
                                            key={evenement.id}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border truncate flex items-center justify-between gap-1 ${getCouleurType(evenement.type)}`}
                                        >
                                            <span className="truncate">{evenement.heure} {evenement.titre}</span>
                                            {/* Bouton supprimer */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSupprimerEvenement(evenement.id);
                                                }}
                                                className="hover:opacity-70 flex-shrink-0"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Affiche +N si plus de 2 événements */}
                                    {evenementsJour.length > 2 && (
                                        <div className="text-[10px] font-black opacity-50 px-2">
                                            +{evenementsJour.length - 2} autres
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* LÉGENDE */}
            <div className="flex items-center gap-6 mt-6 px-2">
                <p className="text-xs font-black opacity-40 uppercase tracking-widest">Légende :</p>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-xs font-bold opacity-60">Cours</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="text-xs font-bold opacity-60">Réunion</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-base-300"></div>
                    <span className="text-xs font-bold opacity-60">Autre</span>
                </div>
            </div>

            {/* ================================================
                MODAL : Ajouter un événement
                ================================================ */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-[3rem] p-8 md:p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Header modal */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black">Nouvel événement</h3>
                                {jourSelectionne && (
                                    <p className="text-sm opacity-50 font-bold mt-1">
                                        {jourSelectionne.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </p>
                                )}
                            </div>
                            {/* Bouton fermer */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAjouterEvenement} className="flex flex-col gap-5">

                            {/* TYPE D'ÉVÉNEMENT */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest opacity-40">
                                    Type d'événement
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 'cours', label: 'Cours', icon: <BookOpen size={16} /> },
                                        { value: 'reunion', label: 'Réunion', icon: <Users size={16} /> },
                                        { value: 'autre', label: 'Autre', icon: <Calendar size={16} /> },
                                    ].map(type => (
                                        <label
                                            key={type.value}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                                                nouvelEvenement.type === type.value
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-base-200 hover:border-primary/30'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type.value}
                                                checked={nouvelEvenement.type === type.value}
                                                onChange={(e) => setNouvelEvenement({
                                                    ...nouvelEvenement,
                                                    type: e.target.value
                                                })}
                                                className="hidden"
                                            />
                                            {type.icon}
                                            <span className="text-xs font-black">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* SI TYPE = COURS : Choisir une leçon existante */}
                            {nouvelEvenement.type === 'cours' && lecons.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40">
                                        Leçon à planifier
                                    </label>
                                    <select
                                        name="lecon_id"
                                        value={nouvelEvenement.lecon_id}
                                        onChange={(e) => setNouvelEvenement({
                                            ...nouvelEvenement,
                                            lecon_id: e.target.value
                                        })}
                                        className="select select-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-bold"
                                    >
                                        <option value="">Choisir une leçon...</option>
                                        {lecons.map(lecon => (
                                            <option key={lecon.id} value={lecon.id}>
                                                {lecon.titre} - {lecon.classe}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                /* SINON : Titre libre */
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40">
                                        Titre de l'événement *
                                    </label>
                                    <input
                                        type="text"
                                        name="titre"
                                        value={nouvelEvenement.titre}
                                        onChange={(e) => setNouvelEvenement({
                                            ...nouvelEvenement,
                                            titre: e.target.value
                                        })}
                                        required
                                        placeholder="Ex: Réunion parents-professeurs"
                                        className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-12"
                                    />
                                </div>
                            )}

                            {/* HEURE */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest opacity-40">
                                    Heure
                                </label>
                                <input
                                    type="time"
                                    name="heure"
                                    value={nouvelEvenement.heure}
                                    onChange={(e) => setNouvelEvenement({
                                        ...nouvelEvenement,
                                        heure: e.target.value
                                    })}
                                    className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-12"
                                />
                            </div>

                            {/* BOUTONS */}
                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-ghost flex-1 rounded-2xl normal-case font-black opacity-50 hover:opacity-100"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1 rounded-2xl normal-case font-black shadow-lg shadow-primary/20"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendrier;