import React from 'react';
import { Rocket } from 'lucide-react';
import ApercuEnfant from '../../composants/UIenfant/AperçuEnfant';

const DashEnf = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-10">
            {/* Header minimal : Juste l'identité visuelle */}
            <div className="flex justify-end mb-6 px-4">
                <div className="flex bg-primary/10 p-3 px-6 rounded-[2rem] border border-primary/20 items-center gap-3">
                    <Rocket className="text-primary animate-bounce-slow" size={24} />
                    <span className="font-black text-primary uppercase tracking-widest text-[10px]">
                        Mathy
                    </span>
                </div>
            </div>

            {/* Ton grand conteneur pro */}
            <ApercuEnfant />
        </div>
    );
};

export default DashEnf;