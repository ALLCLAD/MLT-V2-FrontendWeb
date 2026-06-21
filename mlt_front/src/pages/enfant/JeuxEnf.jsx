import React from 'react';
import { Gamepad2, Timer, Sparkles, Rocket } from 'lucide-react';

const JeuxEnf = () => {
    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans transition-colors duration-300">
            {/* GRAND CONTENEUR : bg-white -> bg-base-100 | border-slate-200 -> border-base-300 */}
            <div className="max-w-4xl mx-auto bg-base-100 rounded-[2.5rem] shadow-xl border border-base-300 overflow-hidden min-h-[70vh] flex flex-col items-center justify-center p-8 text-center relative">

                {/* DÉCORATIONS : Utilisation de l'opacité sur base-content pour rester discret */}
                <Sparkles className="absolute top-10 left-10 text-primary/10" size={40} />
                <Rocket className="absolute bottom-10 right-10 text-base-content/5 rotate-12" size={60} />

                {/* CONTENU CENTRAL */}
                <div className="max-w-md space-y-6 animate-in zoom-in duration-700">

                    {/* ICÔNE ANIMÉE */}
                    <div className="relative inline-block">
                        {/* bg-indigo-50 -> bg-primary/10 | text-indigo-500 -> text-primary */}
                        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
                            <Gamepad2 size={48} />
                        </div>
                        {/* BADGE SABLIER : On garde l'ambre pour le côté "alerte/attente" sympa */}
                        <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-xl shadow-lg border-4 border-base-100">
                            <Timer size={20} className="animate-spin-slow" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* TITRE : text-slate-800 -> text-base-content */}
                        <h2 className="text-3xl font-black text-base-content italic uppercase tracking-tighter">
                            Jeux bientôt disponibles !
                        </h2>
                        {/* PARAGRAPHE : text-slate-400 -> text-base-content/60 */}
                        <p className="text-base-content/60 font-bold text-lg leading-relaxed">
                            Mathy prépare des aventures incroyables pour toi. <br />
                            <span className="text-primary font-black">Encore un peu de patience !</span>
                        </p>
                    </div>

                    {/* BARRE DE CHARGEMENT DÉCORATIVE */}
                    <div className="pt-4">
                        {/* bg-slate-100 -> bg-base-200 */}
                        <div className="w-48 h-2 bg-base-200 rounded-full mx-auto overflow-hidden">
                            {/* bg-indigo-400 -> bg-primary */}
                            <div className="bg-primary h-full w-1/3 rounded-full animate-progress-loop"></div>
                        </div>
                        {/* text-slate-300 -> text-base-content/30 */}
                        <p className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.3em] mt-4">
                            Préparation du terrain de jeu
                        </p>
                    </div>

                </div>

                {/* PETITE TOUCHE FINALE : Bordure de déco en bas */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-primary/10"></div>
            </div>
        </div>
    );
};

export default JeuxEnf;