import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, BrainCircuit, Trophy, ArrowRight, Timer, Lightbulb, Star, ChevronLeft, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../apiDjango/api.jsx';
import { getMathyFeedback } from '../../apiDjango/aiService';
import { speakText, speakTextSafe, stopAllAudio } from '../../apiDjango/ttsService';

const CORRECT_PHRASES = [
    "Super ! C'est ça.",
    "Génial ! Tu as trouvé.",
    "Excellent !",
    "Bravo ! Tu es trop fort.",
    "Magnifique !",
    "Oui, c'est exact !"
];

const INCORRECT_PHRASES = [
    "Tu y es presque, essaie encore !",
    "Ce n'est pas grave, continue !",
    "Ne baisse pas les bras !",
    "Presque ! Tu vas y arriver.",
    "Oups ! Mais tu apprends, c'est super.",
    "Courage, réessaie !"
];

// 🦴 SKELETON LOADERS
const ExerciseHeaderSkeleton = () => (
    <div className="px-6 py-4 flex justify-between items-center border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20 animate-pulse">
        <div className="w-16 h-5 bg-base-300 rounded-lg"></div>
        <div className="flex gap-1">
            <div className="w-5 h-5 bg-base-300 rounded-full"></div>
            <div className="w-5 h-5 bg-base-300 rounded-full"></div>
            <div className="w-5 h-5 bg-base-300 rounded-full"></div>
        </div>
    </div>
);

const ExerciseContentSkeleton = () => (
    <div className="flex-1 p-6 md:p-8 flex flex-col items-center space-y-8 animate-pulse w-full">
        {/* Progression Skeleton */}
        <div className="w-full max-w-2xl space-y-2">
            <div className="flex justify-between">
                <div className="w-28 h-4 bg-base-300 rounded-lg"></div>
                <div className="w-12 h-4 bg-base-300 rounded-lg"></div>
            </div>
            <div className="w-full h-3 bg-base-300 rounded-full"></div>
        </div>

        {/* Question Title Skeleton */}
        <div className="w-full max-w-2xl text-center py-6 space-y-2">
            <div className="w-3/4 h-8 bg-base-300 rounded-xl mx-auto"></div>
            <div className="w-1/2 h-6 bg-base-300 rounded-xl mx-auto"></div>
        </div>

        {/* Grid Options Skeleton */}
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                <div className="h-16 bg-base-300 rounded-2xl w-full"></div>
                <div className="h-16 bg-base-300 rounded-2xl w-full"></div>
                <div className="h-16 bg-base-300 rounded-2xl w-full"></div>
                <div className="h-16 bg-base-300 rounded-2xl w-full"></div>
            </div>
            <div className="w-20 h-20 bg-base-300 rounded-3xl shrink-0"></div>
        </div>

        {/* Bulb Icon Skeleton */}
        <div className="w-16 h-16 bg-base-300 rounded-full mx-auto"></div>
    </div>
);

const FaireExercice = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [exercices, setExercices] = useState([]);
    const [leconTitre, setLeconTitre] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);

    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const [aiFeedback, setAiFeedback] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [hint, setHint] = useState('');
    const [hintsLeft, setHintsLeft] = useState(3);
    const [showHintBox, setShowHintBox] = useState(false);

    // CHANGEMENT : Timer passé à 60 secondes
    const [timeLeft, setTimeLeft] = useState(60);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [isReading, setIsReading] = useState(false);

    const timerRef = useRef(null);
    const scoreRef = useRef(0);

    // --- 1. CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                // Réinitialiser les états pour la nouvelle leçon
                setExercices([]);
                setCurrentIndex(0);
                setScore(0);
                scoreRef.current = 0;
                setShowFeedback(false);
                setSelectedAnswer(null);
                setAiFeedback('');
                setHint('');
                setHintsLeft(3);
                setShowHintBox(false);
                setQuizFinished(false);
                stopAllAudio(); // Arrêter toute lecture en cours

                const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
                const [resEx, resLecon] = await Promise.all([
                    api.get(`/enseignant/enfant/lecons/${id}/exercices/`),
                    api.get(`/enseignant/enfant/lecons/${id}/`),
                    minDelay
                ]);
                setExercices(resEx.data);
                setLeconTitre(resLecon.data.titre || 'une leçon');
            } catch (err) {
                console.error("Erreur chargement:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // Arrêter la lecture quand l'enfant quitte l'exercice (unmount)
    useEffect(() => {
        return () => {
            stopAllAudio();
        };
    }, []);

    // --- LECTURE VOCALE DE LA QUESTION ---
    useEffect(() => {
        if (loading || quizFinished || !exercices || exercices.length === 0 || !exercices[currentIndex]) return;

        const readQuestion = async () => {
            setIsReading(true);
            try {
                await speakText(exercices[currentIndex].question);
            } catch (err) {
                console.error('TTS error:', err);
            } finally {
                setIsReading(false);
            }
        };

        readQuestion();
    }, [currentIndex, loading, quizFinished, exercices]);

    // --- 2. MÉLANGE DES OPTIONS ---
    const optionsStyleQuiz = useMemo(() => {
        if (!exercices[currentIndex]) return [];
        const exo = exercices[currentIndex];
        const bonne = String(exo.reponse_correcte).trim();
        let mauvaises = Array.isArray(exo.mauvaises_reponses)
            ? exo.mauvaises_reponses
            : (exo.mauvaises_reponses?.split(',') || []);

        const toutes = [bonne, ...mauvaises].map(r => String(r).trim()).filter(r => r && r !== ",");
        return [...new Set(toutes)].sort(() => Math.random() - 0.5);
    }, [currentIndex, exercices]);

    // --- 3. LOGIQUE DU TIMER ---
    useEffect(() => {
        if (loading || quizFinished || showFeedback || isReading) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        // CHANGEMENT : Réinitialisation à 60 secondes à chaque question
        setTimeLeft(60);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleOptionClick('TEMPS_ECOULE');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, loading, quizFinished, showFeedback, isReading]);

    // --- 4. ACTIONS ---
    const handleOptionClick = async (option) => {
        if (showFeedback || isAiLoading) return;

        // Arrêter immédiatement toute lecture audio en cours
        stopAllAudio();

        if (timerRef.current) clearInterval(timerRef.current);
        setShowHintBox(false);

        const currentExo = exercices[currentIndex];
        const check = option === currentExo.reponse_correcte;

        setSelectedAnswer(option);
        setIsCorrect(check);

        if (check) {
            setScore(s => {
                const newScore = s + 1;
                scoreRef.current = newScore;
                return newScore;
            });
        }

        setShowFeedback(true);
        setIsAiLoading(true);

        try {
            const feedback = await getMathyFeedback(currentExo.question, option, check, currentExo.explication);
            setAiFeedback(feedback);
            
            // Sélectionner et lire une phrase d'encouragement au lieu de l'explication écrite
            const phrases = check ? CORRECT_PHRASES : INCORRECT_PHRASES;
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            speakTextSafe(randomPhrase);
        } catch (error) {
            const defaultFeedback = check ? "Bien joué ! C'est la bonne réponse." : "Oups, ce n'est pas tout à fait ça.";
            setAiFeedback(defaultFeedback);
            speakTextSafe(defaultFeedback);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleNext = () => {
        stopAllAudio(); // Arrête la lecture audio en cours
        if (currentIndex < exercices.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowFeedback(false);
            setSelectedAnswer(null);
            setAiFeedback('');
            setHint('');
        } else {
            handleFinExercices();
        }
    };

    const handleFinExercices = async () => {
        setIsSaving(true);
        try {
            await api.post('/communication/fin-exercices/', {
                score: scoreRef.current,
                total: exercices.length,
                lecon_titre: leconTitre,
                lecon_id: id,
            });
        } catch (err) {
            console.error("Erreur sauvegarde finale:", err);
        } finally {
            setIsSaving(false);
            setQuizFinished(true);
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        }
    };

    const handleUseHint = async () => {
        if (hintsLeft <= 0 || showHintBox || showFeedback || isAiLoading) return;

        stopAllAudio(); // Arrête toute lecture vocale en cours avant d'annoncer l'aide
        setIsAiLoading(true);
        setShowHintBox(true);
        setHintsLeft(prev => prev - 1);

        const currentExo = exercices[currentIndex];
        try {
            const hintMsg = await getMathyFeedback(currentExo.question, "DEMANDE_INDICE", false, currentExo.explication);
            setHint(hintMsg);
            speakTextSafe(hintMsg); // Lecture directe de l'aide pour l'enfant
        } catch (err) {
            const fallbackHint = "Réfléchis bien à la consigne ! ✨";
            setHint(fallbackHint);
            speakTextSafe("Réfléchis bien à la consigne !");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-base-200/30 p-4 font-sans flex items-center justify-center">
            <div className="w-full max-w-4xl bg-base-100 rounded-[2.5rem] shadow-2xl border border-base-200 overflow-hidden min-h-[85vh] flex flex-col justify-between">
                <div>
                    <ExerciseHeaderSkeleton />
                    <ExerciseContentSkeleton />
                </div>
                <div className="p-6 bg-base-200/30 border-t border-base-200 text-center animate-pulse">
                    <div className="w-32 h-3 bg-base-300 rounded-full mx-auto"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200/30 p-4 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto bg-base-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[85vh] border border-base-200 relative animate-in fade-in duration-500">

                {/* HEADER */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-base-200 bg-gradient-to-r from-base-100 to-base-200/20">
                    <button onClick={() => { stopAllAudio(); navigate(-1); }} className="text-base-content/40 hover:text-error font-black text-xs flex items-center gap-1 transition-colors">
                        <ChevronLeft size={16} /> QUITTER
                    </button>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Star key={i} size={18} className={i < hintsLeft ? 'text-amber-400 fill-amber-400' : 'text-base-300'} />
                        ))}
                    </div>
                </div>

                {/* PROGRESSION */}
                <div className="px-8 pt-4 pb-2">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Leçon : {leconTitre}</span>
                        <span className="text-[10px] font-black opacity-30 italic">{currentIndex + 1} / {exercices.length}</span>
                    </div>
                    <div className="w-full h-3 bg-base-200 rounded-full overflow-hidden p-[2px] border border-base-300 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${((currentIndex + 1) / exercices.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center">
                    {!quizFinished ? (
                        <div className="w-full max-w-2xl flex-1 flex flex-col">
                            {/* INDICATEUR DE LECTURE VOCALE */}
                            {isReading && (
                                <div className="flex items-center justify-center gap-2 text-primary animate-pulse py-3">
                                    <span className="text-2xl">🔊</span>
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        Mathy lit la question...
                                    </span>
                                </div>
                            )}

                            {/* QUESTION */}
                            <div className="text-center py-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-base-content leading-tight">
                                    {exercices[currentIndex]?.question}
                                </h1>
                            </div>

                            {/* OPTIONS & TIMER */}
                            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 w-full">
                                    {optionsStyleQuiz.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={showFeedback}
                                            className={`flex items-center p-4 rounded-2xl border-2 transition-all font-bold text-lg
                                            ${showFeedback
                                                ? option === exercices[currentIndex].reponse_correcte
                                                    ? 'bg-success/10 border-success text-success'
                                                    : option === selectedAnswer ? 'bg-error/10 border-error text-error opacity-70' : 'bg-base-100 border-base-200 opacity-40'
                                                : 'bg-base-100 border-base-200 hover:border-primary hover:bg-primary/5 text-base-content shadow-sm'}`}
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center text-[10px] mr-3 text-base-content/50 shadow-inner shrink-0">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span className="flex-1 text-center">{option}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20 flex md:flex-col items-center gap-2 min-w-[80px]">
                                    <Timer size={18} className="text-primary" />
                                    <span className="font-black text-2xl tabular-nums text-primary">{timeLeft}s</span>
                                </div>
                            </div>

                            {/* ZONE INDICE */}
                            <div className="flex flex-col items-center justify-center py-4 mt-auto">
                                {showHintBox && (
                                    <div className="mb-4 bg-base-100 border border-primary/20 p-4 rounded-2xl shadow-xl animate-in zoom-in-95 max-w-sm text-center">
                                        <p className="text-base-content/80 font-bold text-sm italic">
                                            {isAiLoading ? "Mathy réfléchit..." : hint}
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={handleUseHint}
                                    disabled={hintsLeft <= 0 || showFeedback || isAiLoading || showHintBox}
                                    className={`relative group transition-all duration-300 ${hintsLeft > 0 && !showFeedback ? 'hover:scale-110 active:scale-90' : 'opacity-40 grayscale'}`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg relative z-10 ${showHintBox ? 'bg-amber-400 border-white text-white' : 'bg-base-100 border-amber-100 text-amber-500'}`}>
                                        <Lightbulb size={32} fill={showHintBox ? "white" : "none"} />
                                        <div className="absolute -top-1 -right-1 bg-base-content text-base-100 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-base-100">
                                            {hintsLeft}
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* ZONE FEEDBACK */}
                            {showFeedback && (
                                <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="bg-neutral text-neutral-content p-5 rounded-[2rem] shadow-xl">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 text-primary-content">
                                                <BrainCircuit size={20} />
                                            </div>
                                            <p className="text-sm md:text-base font-bold italic flex-1">
                                                {isAiLoading ? "Mathy écrit..." : aiFeedback}
                                            </p>
                                        </div>
                                        <button onClick={handleNext} className="btn btn-primary btn-block rounded-2xl h-12 font-black shadow-lg">
                                            {currentIndex < exercices.length - 1 ? 'CONTINUER' : 'VOIR MON RÉSULTAT'} <ArrowRight size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ÉCRAN DE FIN */
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
                            <div className="relative">
                                <Trophy size={100} className="text-amber-400" />
                                <Sparkles size={40} className="absolute -top-4 -right-4 text-primary animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-black text-base-content uppercase">Bravo !</h2>
                            <div className="bg-primary text-primary-content p-10 rounded-[3rem] shadow-2xl">
                                <span className="text-7xl font-black italic">
                                    {exercices.length > 0 ? Math.round((scoreRef.current / exercices.length) * 20) : 0}
                                </span>
                                <span className="text-2xl opacity-50">/20</span>
                            </div>
                            <p className="text-base-content/40 font-bold italic">Leçon : {leconTitre}</p>
                            {isSaving && <p className="text-[10px] font-black uppercase opacity-50 animate-pulse tracking-widest">Enregistrement...</p>}
                            <button onClick={() => navigate('/enfant/lecons')} className="btn btn-outline btn-primary rounded-2xl px-12 font-black border-4">
                                RETOUR AUX LEÇONS
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FaireExercice;