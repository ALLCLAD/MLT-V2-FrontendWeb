import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen, Loader2, Sparkles, CheckCircle, ArrowLeft, ClipboardList,
    FileText, MessageSquare, CloudUpload, X, Eye, Edit3, ChevronRight,
    Lightbulb, AlertCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../../apiDjango/api.jsx";
import { genererContenuLecon, genererContenuLeconDepuisDocument, genererExercices } from "../../apiDjango/aiService";

// ─────────────────────────────────────────────
// ÉTAPE 1 : Formulaire de configuration
// ─────────────────────────────────────────────
const EtapeConfig = ({ formData, setFormData, sourceMode, setSourceMode, fichier, setFichier, consignes, setConsignes, onNext, loading }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFile = (file) => {
        if (!file) return;
        const ext = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "docx", "doc"].includes(ext)) {
            alert("Format non supporté. Veuillez utiliser un fichier PDF ou Word (.docx, .doc)");
            return;
        }
        setFichier(file);
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    }, []);

    const isFormValid = formData.titre && formData.classe && formData.theme &&
        (sourceMode === "description" ? formData.description.trim() : fichier !== null);

    return (
        <div className="flex-grow p-8 md:p-12 bg-base-100">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* SÉLECTEUR DE MODE SOURCE */}
                <div className="space-y-4">
                    <label className="block font-black text-lg">Source du contenu *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button type="button" onClick={() => setSourceMode("description")}
                            className={"flex items-start gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left " + (sourceMode === "description" ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-base-200 hover:border-primary/40 bg-base-200/30")}>
                            <div className={"p-2.5 rounded-xl shrink-0 " + (sourceMode === "description" ? "bg-primary/15 text-primary" : "bg-base-300/50 text-base-content/50")}>
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <p className="font-black text-base">Description libre</p>
                                <p className="text-xs text-base-content/50 mt-1">Décrivez votre idée et Mathy génère tout le cours</p>
                            </div>
                            {sourceMode === "description" && <CheckCircle size={18} className="text-primary ml-auto shrink-0 mt-0.5" />}
                        </button>

                        <button type="button" onClick={() => setSourceMode("fichier")}
                            className={"flex items-start gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left " + (sourceMode === "fichier" ? "border-secondary bg-secondary/5 shadow-sm shadow-secondary/10" : "border-base-200 hover:border-secondary/40 bg-base-200/30")}>
                            <div className={"p-2.5 rounded-xl shrink-0 " + (sourceMode === "fichier" ? "bg-secondary/15 text-secondary" : "bg-base-300/50 text-base-content/50")}>
                                <CloudUpload size={22} />
                            </div>
                            <div>
                                <p className="font-black text-base">Importer un document</p>
                                <p className="text-xs text-base-content/50 mt-1">PDF ou Word existant — Mathy améliore et reformate</p>
                            </div>
                            {sourceMode === "fichier" && <CheckCircle size={18} className="text-secondary ml-auto shrink-0 mt-0.5" />}
                        </button>
                    </div>
                </div>

                {/* TITRE */}
                <div className="space-y-3">
                    <label className="block font-black text-lg">Titre de la leçon *</label>
                    <input type="text" name="titre" value={formData.titre} onChange={handleChange} required disabled={loading}
                        className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-14"
                        placeholder="Ex: Les fractions simples" />
                </div>

                {/* ZONE CONDITIONNELLE */}
                {sourceMode === "description" ? (
                    <div className="space-y-3">
                        <label className="block font-black text-lg">Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required disabled={loading}
                            className="textarea textarea-bordered w-full rounded-2xl h-32 bg-base-200/50 border-none focus:ring-2 ring-primary font-medium"
                            placeholder="Décrivez le contenu de la leçon... Mathy utilisera cette description pour générer le cours complet." />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <label className="block font-black text-lg">Document à importer *</label>
                        {!fichier ? (
                            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}
                                onClick={() => fileRef.current?.click()}
                                className={"w-full border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all " + (dragOver ? "border-secondary bg-secondary/10" : "border-base-300 hover:border-secondary/50 bg-base-200/30 hover:bg-secondary/5")}>
                                <div className={"p-4 rounded-2xl transition-colors " + (dragOver ? "bg-secondary/20 text-secondary" : "bg-base-300/50 text-base-content/30")}>
                                    <CloudUpload size={40} />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-base-content/70">Glissez votre fichier ici</p>
                                    <p className="text-sm text-base-content/40 mt-1">ou cliquez pour sélectionner</p>
                                    <p className="text-xs text-base-content/30 mt-3 font-bold uppercase tracking-widest">PDF • DOCX • DOC</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-5 bg-secondary/5 border-2 border-secondary/30 rounded-[1.5rem]">
                                <div className="p-3 bg-secondary/15 rounded-xl text-secondary shrink-0"><FileText size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-base truncate">{fichier.name}</p>
                                    <p className="text-xs text-base-content/40 mt-0.5">{(fichier.size / 1024).toFixed(1)} Ko</p>
                                </div>
                                <button type="button" onClick={() => setFichier(null)} className="btn btn-circle btn-ghost btn-sm text-error/60 hover:text-error"><X size={16} /></button>
                            </div>
                        )}
                        <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

                        <div className="space-y-2 mt-4">
                            <label className="block font-bold text-sm text-base-content/60">
                                <Lightbulb size={14} className="inline mr-1 text-amber-400" />
                                Consignes optionnelles pour Mathy
                            </label>
                            <input type="text" value={consignes} onChange={(e) => setConsignes(e.target.value)}
                                className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-secondary font-medium h-12 text-sm"
                                placeholder="Ex: Simplifie le vocabulaire, ajoute des exemples sur les marchés..." />
                        </div>
                    </div>
                )}

                {/* CLASSE & DUREE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="block font-black text-lg">Classe</label>
                        <div className="w-full h-14 px-6 rounded-2xl font-bold bg-base-200/50 text-primary flex items-center border-none">
                            {formData.classe || "Chargement..."}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="block font-black text-lg">Durée estimée</label>
                        <input type="text" name="duree" value={formData.duree} onChange={handleChange} disabled={loading}
                            className="input input-bordered w-full rounded-2xl bg-base-200/50 border-none focus:ring-2 ring-primary font-medium h-14" placeholder="Ex: 45 min" />
                    </div>
                </div>

                {/* THEME */}
                <div className="space-y-3">
                    <label className="block font-black text-lg">Thème *</label>
                    <select name="theme" value={formData.theme} onChange={handleChange} required disabled={loading}
                        className="select select-bordered w-full h-14 px-6 rounded-2xl font-bold bg-base-100 border-2 border-base-200 focus:border-primary focus:ring-0 text-primary transition-all cursor-pointer">
                        <option value="" disabled className="bg-base-100 text-base-content/50">Choisir un thème...</option>
                        <option value="CALCUL" className="bg-base-100 text-base-content py-4">Calcul et Opérations</option>
                        <option value="GEOMETRIE" className="bg-base-100 text-base-content py-4">Géométrie et Formes</option>
                        <option value="DENOMBREMENT" className="bg-base-100 text-base-content py-4">Dénombrement et Nombres</option>
                        <option value="GRANDEURS" className="bg-base-100 text-base-content py-4">Grandeurs et Mesures</option>
                    </select>
                </div>

                {/* INFO IA */}
                <div className={"flex items-start gap-4 border rounded-2xl p-6 " + (sourceMode === "fichier" ? "bg-secondary/5 border-secondary/10" : "bg-primary/5 border-primary/10")}>
                    <div className={"p-2 rounded-xl flex-shrink-0 " + (sourceMode === "fichier" ? "bg-secondary/10" : "bg-primary/10")}>
                        <Sparkles className={sourceMode === "fichier" ? "text-secondary" : "text-primary"} size={24} />
                    </div>
                    <div>
                        <p className={"font-black " + (sourceMode === "fichier" ? "text-secondary" : "text-primary")}>
                            {sourceMode === "fichier" ? "Mathy améliore votre document" : "Mathy génère tout automatiquement"}
                        </p>
                        <p className="text-sm opacity-60 font-medium mt-1">
                            {sourceMode === "fichier"
                                ? "Votre document sera extrait, enrichi et reformaté en leçon pédagogique. Vous pourrez réviser le résultat avant de publier."
                                : "Le contenu complet + les exercices seront générés selon le niveau de la classe à partir de votre titre et description."}
                        </p>
                    </div>
                </div>

                {/* BOUTON SUIVANT */}
                <div className="pt-6">
                    <button type="button" onClick={onNext} disabled={!isFormValid || loading}
                        className={"btn w-full rounded-[2rem] h-16 font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all " + (sourceMode === "fichier" ? "btn-secondary shadow-secondary/20" : "btn-primary shadow-primary/20")}>
                        {loading ? (<><Loader2 size={24} className="animate-spin mr-2" /> Génération en cours...</>) : (<><Sparkles size={24} className="mr-2" /> Générer avec Mathy <ChevronRight size={20} className="ml-1" /></>)}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// ÉTAPE 2 : Preview & Édition du contenu généré
// ─────────────────────────────────────────────
const EtapePreview = ({ contenu, setContenu, formData, etape, loading, onConfirm, onBack }) => {
    const [viewMode, setViewMode] = useState("split");

    return (
        <div className="flex-grow flex flex-col p-8 md:p-12 bg-base-100 gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-base-content">Leçon générée par Mathy ✨</h2>
                    <p className="text-sm text-base-content/50 font-medium mt-1">Vérifiez et modifiez si nécessaire avant de valider</p>
                </div>
                <div className="flex items-center gap-1 bg-base-200 p-1 rounded-2xl">
                    {[["edit", "Éditer"], ["split", "Split"], ["preview", "Aperçu"]].map(([mode, label]) => (
                        <button key={mode} type="button" onClick={() => setViewMode(mode)}
                            className={"px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all " + (viewMode === mode ? "bg-base-100 shadow text-primary" : "text-base-content/40 hover:text-base-content/70")}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && etape && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                    <div className="flex items-center gap-4">
                        <Loader2 className="text-primary animate-spin flex-shrink-0" size={20} />
                        <p className="font-black text-primary text-sm">{etape}</p>
                    </div>
                </div>
            )}

            <div className={"flex-1 grid gap-4 " + (viewMode === "split" ? "grid-cols-2" : "grid-cols-1")}>
                {(viewMode === "edit" || viewMode === "split") && (
                    <div className="flex flex-col gap-2">
                        {viewMode === "split" && <p className="text-xs font-black uppercase tracking-widest text-base-content/30">Éditeur</p>}
                        <textarea value={contenu} onChange={(e) => setContenu(e.target.value)}
                            className="flex-1 w-full h-full min-h-[400px] p-6 rounded-[1.5rem] bg-base-200/50 border-none focus:ring-2 ring-primary font-mono text-sm leading-relaxed resize-none"
                            placeholder="Le contenu Markdown apparaîtra ici..." />
                    </div>
                )}
                {(viewMode === "preview" || viewMode === "split") && (
                    <div className="flex flex-col gap-2">
                        {viewMode === "split" && <p className="text-xs font-black uppercase tracking-widest text-base-content/30">Aperçu</p>}
                        <div className="flex-1 p-6 rounded-[1.5rem] bg-base-100 border-2 border-base-200 overflow-y-auto min-h-[400px]">
                            <div className="prose prose-sm max-w-none text-base-content">
                                <ReactMarkdown>{contenu || "*Aucun contenu à prévisualiser...*"}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button type="button" onClick={onBack} disabled={loading}
                    className="btn btn-ghost rounded-[1.5rem] h-14 font-black gap-2 border-2 border-base-200">
                    <ArrowLeft size={18} /> Modifier les infos
                </button>
                {loading && etape ? (
                    <div className="flex-1 flex items-center justify-center gap-3 bg-primary/5 border border-primary/10 rounded-[1.5rem] h-14 px-6">
                        <Loader2 className="text-primary animate-spin" size={20} />
                        <span className="font-black text-primary text-sm">{etape}</span>
                    </div>
                ) : (
                    <button type="button" onClick={onConfirm} disabled={!contenu.trim() || loading}
                        className="flex-1 btn btn-primary rounded-[1.5rem] h-14 font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all gap-2">
                        <CheckCircle size={20} /> Valider et créer les exercices
                    </button>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
const CreerLecon = () => {
    const navigate = useNavigate();
    const [etapeUI, setEtapeUI] = useState(1);
    const [formData, setFormData] = useState({ titre: "", description: "", classe: "", duree: "45 min", theme: "" });
    const [sourceMode, setSourceMode] = useState("description");
    const [fichier, setFichier] = useState(null);
    const [consignes, setConsignes] = useState("");
    const [contenuGenere, setContenuGenere] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [etape, setEtape] = useState("");

    useEffect(() => {
        const fetchClasse = async () => {
            try {
                const response = await api.get("/auth/user-profile/");
                setFormData(prev => ({ ...prev, classe: response.data.classe_enseignement }));
            } catch (err) { console.error("Erreur profil:", err); }
        };
        fetchClasse();
    }, []);

    const handleGenerer = async () => {
        setLoading(true);
        setError(null);
        setContenuGenere("");
        try {
            let contenu = null;
            if (sourceMode === "fichier") {
                setEtape("Mathy extrait le texte de votre document...");
                const formFile = new FormData();
                formFile.append("fichier", fichier);
                const extractResponse = await api.post("/enseignant/extraire-texte/", formFile, { headers: { "Content-Type": "multipart/form-data" } });
                const texteExtrait = extractResponse.data.texte;
                setEtape("Mathy améliore et reformate votre document...");
                contenu = await genererContenuLeconDepuisDocument(formData.titre, formData.classe, texteExtrait, consignes);
            } else {
                setEtape("Mathy génère le contenu de votre leçon...");
                contenu = await genererContenuLecon(formData.titre, formData.description, formData.classe);
            }
            if (!contenu) throw new Error("Impossible de générer le contenu de la leçon.");
            setContenuGenere(contenu);
            setEtape("");
            setEtapeUI(2);
        } catch (err) {
            console.error("Erreur génération:", err);
            setError(err.response?.data?.error || err.message || "Une erreur est survenue. Veuillez réessayer.");
        } finally { setLoading(false); }
    };

    const handleConfirmer = async () => {
        setLoading(true);
        setError(null);
        try {
            setEtape("Sauvegarde de la leçon...");
            const leconResponse = await api.post("/enseignant/lecons/", { ...formData, contenu: contenuGenere });
            const leconId = leconResponse.data.id;
            setEtape("Mathy génère les exercices...");
            const exercices = await genererExercices(formData.titre, formData.classe, contenuGenere);
            if (exercices && exercices.length > 0) {
                setEtape("Sauvegarde des exercices...");
                for (const exercice of exercices) {
                    await api.post(`/enseignant/lecons/${leconId}/exercices/`, exercice);
                }
            }
            setEtape("Leçon créée avec succès !");
            setTimeout(() => navigate(`/enseignant/lecons/${leconId}`), 1000);
        } catch (err) {
            console.error("Erreur création leçon:", err);
            setError("Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.");
            setEtape("");
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-base-200/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-base-100 rounded-[3rem] shadow-xl shadow-base-300/50 border border-base-content/5 min-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => etapeUI === 2 ? setEtapeUI(1) : navigate("/enseignant/lecons")} className="btn btn-circle btn-ghost">
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">
                                {etapeUI === 2 ? "Prévisualisation" : "Nouvelle Leçon"}
                            </h1>
                            <p className="text-base-content/50 font-medium italic">
                                {etapeUI === 2 ? "Vérifiez, modifiez et validez le contenu généré par Mathy" : "Remplissez le formulaire et Mathy génèrera tout automatiquement !"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black">
                        {[["1", "Configuration"], ["2", "Validation"]].map(([num, label], i) => (
                            <React.Fragment key={num}>
                                <div className={"flex items-center gap-2 px-3 py-1.5 rounded-full transition-all " + (etapeUI === i + 1 ? "bg-primary text-primary-content" : etapeUI > i + 1 ? "bg-success/20 text-success" : "bg-base-200 text-base-content/30")}>
                                    {etapeUI > i + 1 ? <CheckCircle size={12} /> : <span>{num}</span>}
                                    <span>{label}</span>
                                </div>
                                {i === 0 && <ChevronRight size={14} className="text-base-content/20" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mx-8 md:mx-12 mt-6 flex items-center gap-3 bg-error/10 border border-error/20 rounded-2xl p-4">
                        <AlertCircle size={20} className="text-error shrink-0" />
                        <span className="font-bold text-error text-sm">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-error/50 hover:text-error"><X size={16} /></button>
                    </div>
                )}

                {etapeUI === 1 ? (
                    <EtapeConfig formData={formData} setFormData={setFormData} sourceMode={sourceMode} setSourceMode={setSourceMode}
                        fichier={fichier} setFichier={setFichier} consignes={consignes} setConsignes={setConsignes}
                        onNext={handleGenerer} loading={loading} />
                ) : (
                    <EtapePreview contenu={contenuGenere} setContenu={setContenuGenere} formData={formData} etape={etape}
                        loading={loading} onConfirm={handleConfirmer} onBack={() => setEtapeUI(1)} />
                )}
            </div>
        </div>
    );
};

export default CreerLecon;
