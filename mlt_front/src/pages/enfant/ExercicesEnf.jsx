import React, { useState } from 'react';
import {
    PlusCircle, Shapes, XCircle, DivideCircle,
    ChevronRight, Rocket, Pencil, Zap, BookOpen,
    ChevronLeft, Calculator, Brain, FlaskConical
} from 'lucide-react';
import QuizEngine from './QuizEngine';
import CalculEcritEngine from './CalculEcritEngine';
import ProblemeEngine from './ProblemeEngine';

// ─── DONNÉES ────────────────────────────────────────────────────────────────

const domaines = [
    {
        id: 'CALCUL',
        name: 'Calcul',
        icon: <PlusCircle />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        ringColor: 'ring-blue-400',
        desc: 'Additions, soustractions...',
    },
    {
        id: 'GEOMETRIE',
        name: 'Géométrie',
        icon: <Shapes />,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        ringColor: 'ring-emerald-400',
        desc: 'Formes et figures.',
    },
    {
        id: 'DENOMBREMENT',
        name: 'Dénombrement',
        icon: <XCircle />,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        ringColor: 'ring-amber-400',
        desc: 'Compter et ordonner.',
    },
    {
        id: 'GRANDEURS',
        name: 'Grandeurs',
        icon: <DivideCircle />,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        ringColor: 'ring-indigo-400',
        desc: 'Mesures et unités.',
    },
];

const exerciceTypes = [
    {
        id: 'CALCUL_ECRIT',
        name: 'Calcul Écrit',
        icon: <Pencil />,
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10',
        ringColor: 'ring-rose-400',
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        id: 'CALCUL_MENTAL',
        name: 'Calcul Mental',
        icon: <Zap />,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        ringColor: 'ring-violet-400',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        id: 'PROBLEME',
        name: 'Problèmes',
        icon: <FlaskConical />,
        color: 'text-teal-500',
        bgColor: 'bg-teal-500/10',
        ringColor: 'ring-teal-400',
        gradient: 'from-teal-500 to-cyan-600',
    },
];

// ─── COMPOSANTS INTERNES ─────────────────────────────────────────────────────

// Carte pour les domaines de révision QCM
const DomaineCard = ({ domaine, onClick }) => (
    <div
        onClick={onClick}
        className="group cursor-pointer relative bg-base-100 rounded-[2.5rem] p-7 transition-all duration-300 border-2 border-base-200 dark:border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
    >
        <div className={`absolute -bottom-10 -right-10 w-44 h-44 ${domaine.bgColor} rounded-full transition-transform group-hover:scale-125 duration-700 ease-out opacity-60`} />

        <div className="flex flex-col h-full relative z-10">
            <div className={`w-14 h-14 bg-base-100 ${domaine.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-base-200`}>
                {React.cloneElement(domaine.icon, { size: 28, strokeWidth: 2.5 })}
            </div>
            <h3 className="text-xl font-black text-base-content uppercase italic mb-1">{domaine.name}</h3>
            <p className="text-sm text-base-content/50 font-bold mb-6 leading-tight">{domaine.desc}</p>
            <div className="flex items-center justify-between mt-auto">
                <div className={`flex items-center gap-1 ${domaine.color} font-black text-xs uppercase tracking-widest`}>
                    <span className="group-hover:mr-2 transition-all">Lancer</span>
                    <ChevronRight size={16} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-base-100 dark:bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-all shadow-xl flex items-center justify-center border border-base-200">
                    <ChevronRight size={22} strokeWidth={3} />
                </div>
            </div>
        </div>
    </div>
);

// Carte pour les types d'exercices avancés (Calcul Écrit, Calcul Mental, Problèmes)
const TypeExerciceCard = ({ type, onClick }) => (
    <div
        onClick={onClick}
        className="group cursor-pointer relative bg-base-100 rounded-[2.5rem] p-7 transition-all duration-300 border-2 border-base-200 dark:border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
    >
        <div className={`absolute -bottom-10 -right-10 w-44 h-44 ${type.bgColor} rounded-full transition-transform group-hover:scale-125 duration-700 ease-out opacity-60`} />

        <div className="relative z-10 flex flex-col h-full">
            <div className={`w-14 h-14 bg-base-100 ${type.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-base-200`}>
                {React.cloneElement(type.icon, { size: 28, strokeWidth: 2.5 })}
            </div>

            <h3 className="text-xl font-black text-base-content uppercase italic mb-6">{type.name}</h3>

            <div className="flex items-center justify-between mt-auto">
                <div className={`flex items-center gap-1 ${type.color} font-black text-xs uppercase tracking-widest`}>
                    <span className="group-hover:mr-2 transition-all">Commencer</span>
                    <ChevronRight size={16} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-base-100 dark:bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-all shadow-xl flex items-center justify-center border border-base-200">
                    <ChevronRight size={22} strokeWidth={3} />
                </div>
            </div>
        </div>
    </div>
);

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────────────────

const ExercicesEnf = () => {
    // null = accueil | { theme, typeFilter? } = quiz lancé
    const [quizConfig, setQuizConfig] = useState(null);
    const [activeTab, setActiveTab] = useState('reviser'); // 'reviser' | 'exercer'

    const lancerRevision = (domaineId) => {
        setQuizConfig({ theme: domaineId, typeFilter: 'QCM', moteur: 'quiz' });
    };

    const lancerExercice = (typeId) => {
        if (typeId === 'CALCUL_ECRIT') {
            setQuizConfig({ moteur: 'calcul_ecrit' });
        } else if (typeId === 'PROBLEME') {
            setQuizConfig({ moteur: 'probleme' });
        } else {
            // CALCUL_MENTAL : QuizEngine avec les questions CALCUL et timer 30s
            setQuizConfig({ theme: 'CALCUL', typeFilter: 'CALCUL_MENTAL', moteur: 'quiz' });
        }
    };

    if (quizConfig) {
        if (quizConfig.moteur === 'calcul_ecrit') {
            return <CalculEcritEngine onBack={() => setQuizConfig(null)} />;
        }
        if (quizConfig.moteur === 'probleme') {
            return <ProblemeEngine onBack={() => setQuizConfig(null)} />;
        }
        return (
            <QuizEngine
                theme={quizConfig.theme}
                typeFilter={quizConfig.typeFilter}
                onBack={() => setQuizConfig(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-base-100 min-h-[85vh] flex flex-col relative">

                {/* ── HEADER ── */}
                <div className="p-8 md:p-10 border-b border-base-200">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center animate-bounce">
                            <Rocket size={26} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary opacity-70">Mission du jour</h2>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-base-content italic uppercase tracking-tighter">
                        Choisis ton <span className="text-primary">Défi !</span>
                    </h1>

                    {/* ── ONGLETS ── */}
                    <div className="flex justify-between items-center w-full mt-6">
                        <button
                            onClick={() => setActiveTab('reviser')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wide transition-all duration-200 ${
                                activeTab === 'reviser'
                                    ? 'bg-primary text-primary-content shadow-lg scale-105'
                                    : 'bg-base-200 text-base-content/60 hover:bg-base-300'
                            }`}
                        >
                            <BookOpen size={16} />
                            Réviser
                        </button>
                        <button
                            onClick={() => setActiveTab('exercer')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wide transition-all duration-200 ${
                                activeTab === 'exercer'
                                    ? 'bg-primary text-primary-content shadow-lg scale-105'
                                    : 'bg-base-200 text-base-content/60 hover:bg-base-300'
                            }`}
                        >
                            <Calculator size={16} />
                            S'Exercer
                        </button>
                    </div>
                </div>

                {/* ── CONTENU ── */}
                <div className="flex-1 p-8 md:p-10">

                    {activeTab === 'reviser' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <p className="text-sm font-bold text-base-content/50 uppercase tracking-widest">
                                    Questions à choix multiples thématiques
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {domaines.map((domaine) => (
                                    <DomaineCard
                                        key={domaine.id}
                                        domaine={domaine}
                                        onClick={() => lancerRevision(domaine.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'exercer' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TypeExerciceCard
                                    type={exerciceTypes.find(t => t.id === 'CALCUL_MENTAL')}
                                    onClick={() => lancerExercice('CALCUL_MENTAL')}
                                />
                                <TypeExerciceCard
                                    type={exerciceTypes.find(t => t.id === 'CALCUL_ECRIT')}
                                    onClick={() => lancerExercice('CALCUL_ECRIT')}
                                />
                            </div>
                            <div className="flex justify-center">
                                <div className="w-full md:w-1/2">
                                    <TypeExerciceCard
                                        type={exerciceTypes.find(t => t.id === 'PROBLEME')}
                                        onClick={() => lancerExercice('PROBLEME')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-base-200/30 border-t border-base-200 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 text-base-content">Mathy Lab • M L T</p>
                </div>
            </div>
        </div>
    );
};

export default ExercicesEnf;