import React from 'react';
import { Link } from 'react-router-dom';
import ImgEnfant from '../../assets/img.png';

const SectionEnfant = () => {
    return (
        <section id="enfants" className="py-16 my-10 px-4 bg-base-100 text-base-content font-sans">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center p-8 md:p-16 bg-base-100 border border-base-content/10 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-full md:w-5/12 text-center order-2 md:order-1">
                        <img src={ImgEnfant} className="w-full max-w-sm mx-auto rounded-3xl object-cover shadow-lg" alt="Enfants" />
                    </div>
                    <div className="w-full md:w-7/12 md:pl-12 order-1 md:order-2 mb-10 md:mb-0">
                        <div className="inline-block bg-success/10 text-success text-xs font-black tracking-widest px-4 py-2 rounded-xl mb-6 uppercase">ESPACE ÉLÈVE</div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Apprends sans même <br />t'en rendre compte.</h2>
                        <div className="flex items-start gap-4 mb-8">
                            <div className="bg-base-200 p-4 rounded-full text-primary flex-shrink-0"><i className="bi bi-controller text-2xl"></i></div>
                            <p className="opacity-70 font-medium leading-relaxed">Résous des défis épiques, gagne des trophées et personnalise ton avatar.</p>
                        </div>
                        <Link to="/inscription" className="btn btn-neutral rounded-full px-8 py-2 font-bold normal-case">Rejoindre la partie</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionEnfant;