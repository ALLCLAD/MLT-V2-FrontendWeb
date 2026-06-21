import React, { useState, useEffect, useRef } from 'react';
import { Loader2, BrainCircuit, Trophy, ArrowRight, Timer, Lightbulb, Star, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../apiDjango/api.jsx';
import { getMathyFeedback } from '../../apiDjango/aiService';

const QuizEngine = ({ theme, onBack }) => {
    const [questions, setQuestions] = useState([]);
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

    const [timeLeft, setTimeLeft] = useState(60);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const timerRef = useRef(null);

    // --- 1. RÉCUPÉRATION DES QUESTIONS ---
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/quiz/${theme.toUpperCase()}/`);
                const data = response.data.question;
                if (Array.isArray(data)) {
                    setQuestions(data);
                }
            } catch (err) {
                console.error("Erreur chargement questions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [theme]);

    // --- 2. LOGIQUE DU TIMER ---
    useEffect(() => {
        if (loading || quizFinished || showFeedback) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

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
    }, [currentIndex, loading, quizFinished, showFeedback]);

    // --- 3. ACTIONS ---
    const handleOptionClick = async (option) => {
        if (showFeedback || isAiLoading) return;

        if (timerRef.current) clearInterval(timerRef.current);
        setShowHintBox(false);

        const currentQ = questions[currentIndex];
        const check = option === currentQ.reponse_correcte;

        setSelectedAnswer(option);
        setIsCorrect(check);

        if (check) setScore(s => s + 1);

        setShowFeedback(true);
        setIsAiLoading(true);

        try {
            const feedback = await getMathyFeedback(currentQ.texte, option, check, currentQ.explication);
            setAiFeedback(feedback);
        } catch (err) {
            setAiFeedback(check ? "Bravo ! C'est la bonne réponse." : "Dommage, regarde l'explication !");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowFeedback(false);
            setSelectedAnswer(null);
            setAiFeedback('');
            setHint('');
        } else {
            setQuizFinished(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            saveScore(score);
        }
    };

    const saveScore = async (finalScore) => {
        setIsSaving(true);
        try {
            const noteSur20 = Math.round((finalScore / questions.length) * 20);
            await api.post('/quiz/save-score/', {
                points: noteSur20,
                total_questions: questions.length,
                temps: 60 - timeLeft,
                theme: theme
            });
        } catch (e) {
            console.error("Erreur save score:", e.response?.data);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUseHint = async () => {
        if (hintsLeft <= 0 || showHintBox || showFeedback || isAiLoading) return;

        setIsAiLoading(true);
        setShowHintBox(true);
        setHintsLeft(prev => prev - 1);

        const currentQ = questions[currentIndex];
        try {
            const hintMsg = await getMathyFeedback(currentQ.texte, "DEMANDE_INDICE", false, currentQ.explication);
            setHint(hintMsg);
        } catch (err) {
            setHint("Réfléchis bien au lien entre les nombres ! ✨");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 p-4 font-sans">
            <div className="max-w-4xl mx-auto bg-base-100 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-[85vh] border border-base-300 relative">

                {/* HEADER */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-base-200">
                    <button onClick={onBack} className="text-base-content/40 hover:text-error font-black text-xs flex items-center gap-1 transition-colors">
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
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Progression</span>
                        <span className="text-[10px] font-black opacity-30 italic">{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="w-full h-3 bg-base-200 rounded-full overflow-hidden p-[2px] border border-base-300 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center">
                    {!quizFinished ? (
                        <div className="w-full max-w-2xl flex-1 flex flex-col">
                            {/* QUESTION */}
                            <div className="text-center py-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-base-content leading-tight">
                                    {questions[currentIndex]?.texte}
                                </h1>
                            </div>

                            {/* OPTIONS & TIMER */}
                            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 w-full">
                                    {questions[currentIndex]?.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={showFeedback}
                                            className={`flex items-center p-4 rounded-2xl border-2 transition-all font-bold text-lg
                                            ${showFeedback
                                                ? option === questions[currentIndex].reponse_correcte
                                                    ? 'bg-success/10 border-success text-success'
                                                    : option === selectedAnswer ? 'bg-error/10 border-error text-error' : 'bg-base-100 border-base-200 opacity-40'
                                                : 'bg-base-100 border-base-200 hover:border-primary hover:bg-primary/5 text-base-content shadow-sm'}`}
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center text-[10px] mr-3 text-base-content/50 shadow-inner shrink-0">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span className="flex-1 text-center">{option}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20 flex md:flex-col items-center gap-2 min-w-[100px] animate-pulse">
                                    <Timer size={18} className="text-primary" />
                                    <span className="font-black text-2xl tabular-nums text-primary">{timeLeft}s</span>
                                </div>
                            </div>

                            {/* ZONE INDICE */}
                            <div className="flex flex-col items-center justify-center py-4 mt-auto">
                                {showHintBox && (
                                    <div className="mb-4 bg-base-100 border border-primary/20 p-4 rounded-2xl shadow-xl max-w-sm text-center animate-in zoom-in-95">
                                        <p className="text-base-content/80 font-bold text-sm italic">
                                            {isAiLoading ? "Mathy réfléchit..." : hint}
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={handleUseHint}
                                    disabled={hintsLeft <= 0 || showFeedback || isAiLoading || showHintBox}
                                    className={`relative transition-all duration-300 ${hintsLeft > 0 && !showFeedback ? 'hover:scale-110 active:scale-90' : 'opacity-40 grayscale'}`}
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
                                                {isAiLoading ? "Mathy écrit son explication..." : aiFeedback}
                                            </p>
                                        </div>
                                        <button onClick={handleNext} className="btn btn-primary btn-block rounded-2xl h-12 font-black shadow-lg">
                                            CONTINUER <ArrowRight size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ÉCRAN DE FIN */
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
                            <Trophy size={100} className="text-amber-400" />
                            <h2 className="text-4xl font-black text-base-content uppercase">Incroyable !</h2>
                            <div className="bg-primary text-primary-content p-10 rounded-[3rem] shadow-2xl">
                                <span className="text-7xl font-black italic">
                                    {questions.length > 0 ? Math.round((score / questions.length) * 20) : 0}
                                </span>
                                <span className="text-2xl opacity-50">/20</span>
                            </div>
                            {isSaving && <p className="text-[10px] font-black uppercase opacity-50 animate-pulse">Sauvegarde du score...</p>}
                            <button onClick={onBack} className="btn btn-outline btn-primary rounded-2xl px-12 font-black border-4">
                                RETOUR À L'ACCUEIL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizEngine;