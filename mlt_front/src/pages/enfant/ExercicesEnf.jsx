import React, { useState } from 'react';
import { PlusCircle, Shapes, XCircle, DivideCircle, ChevronRight, Rocket } from 'lucide-react';
import QuizEngine from './QuizEngine';

const ExercicesEnf = () => {
    const [selectedTheme, setSelectedTheme] = useState(null);

    const domaines = [
        { id: 'CALCUL', name: 'Calcul', icon: <PlusCircle />, color: 'text-blue-500', bgColor: 'bg-blue-500/10', border: 'border-blue-100', desc: 'Deviens un as de l\'addition !' },
        { id: 'GEOMETRIE', name: 'Géométrie', icon: <Shapes />, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', border: 'border-emerald-100', desc: 'Explore les formes et l\'espace.' },
        { id: 'DENOMBREMENT', name: 'Dénombrement', icon: <XCircle />, color: 'text-amber-500', bgColor: 'bg-amber-500/10', border: 'border-amber-100', desc: 'Apprends à compter super vite.' },
        { id: 'GRANDEURS', name: 'Grandeurs', icon: <DivideCircle />, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', border: 'border-indigo-100', desc: 'Mesure le monde qui t\'entoure.' },
    ];

    if (selectedTheme) {
        return <QuizEngine theme={selectedTheme} onBack={() => setSelectedTheme(null)} />;
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto bg-base-100 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-base-100 min-h-[85vh] flex flex-col relative">

                {/* HEADER */}
                <div className="p-8 md:p-12 border-b border-base-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center animate-bounce">
                            <Rocket size={28} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary opacity-70">Mission du jour</h2>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-base-content italic uppercase tracking-tighter">
                        Choisis ton <span className="text-primary">Défi !</span>
                    </h1>
                </div>

                {/* GRILLE */}
                <div className="flex-1 p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {domaines.map((domaine) => (
                            <div
                                key={domaine.id}
                                onClick={() => setSelectedTheme(domaine.id)}
                                className="group cursor-pointer relative bg-base-100 rounded-[3rem] p-8 transition-all duration-300 border-2 border-base-200 dark:border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                            >
                                {/* LE DEMI-CERCLE À DROITE */}
                                <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${domaine.bgColor} rounded-full transition-transform group-hover:scale-125 duration-700 ease-out opacity-60`}></div>

                                <div className="flex flex-col h-full relative z-10">
                                    {/* ICÔNE À GAUCHE */}
                                    <div className={`w-16 h-16 bg-base-100 ${domaine.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-base-200`}>
                                        {React.cloneElement(domaine.icon, { size: 32, strokeWidth: 2.5 })}
                                    </div>

                                    <h3 className="text-2xl font-black text-base-content uppercase italic mb-2">
                                        {domaine.name}
                                    </h3>

                                    <p className="text-lg text-base-content/60 font-bold mb-8 leading-tight max-w-[70%]">
                                        {domaine.desc}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className={`flex items-center gap-2 ${domaine.color} font-black text-xs uppercase tracking-widest`}>
                                            <span className="group-hover:mr-2 transition-all">Lancer</span>
                                            <ChevronRight size={18} />
                                        </div>

                                        {/* BOUTON ROND STYLISÉ QUI SURVOLE LE DEMI-CERCLE */}
                                        <div className="w-14 h-14 rounded-2xl bg-base-100 dark:bg-base-200 text-base-content group-hover:bg-primary group-hover:text-primary-content transition-all shadow-xl flex items-center justify-center border border-base-200">
                                            <ChevronRight size={28} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-base-200/30 border-t border-base-200 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 text-base-content">Mathy Lab • M L T</p>
                </div>
            </div>
        </div>
    );
};

export default ExercicesEnf;