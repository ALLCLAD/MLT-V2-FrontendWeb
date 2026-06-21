import React from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../../assets/logo.jpeg';

const Hero = () => {
    return (
        <section className="relative py-12 md:py-24 flex items-center overflow-hidden bg-base-100 text-base-content"
                 style={{ minHeight: '80vh', background: 'radial-gradient(circle at top right, var(--p) -40%, transparent 100%)' }}>
            <div className="container mx-auto px-4 md:px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* TEXTE GAUCHE */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Les maths deviennent <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">un jeu d'enfant.</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-10 opacity-70 lg:pr-16 font-medium">
                            Une plateforme interactive complète pour apprendre et enseigner Les Maths.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/inscription" className="btn btn-primary btn-lg rounded-full px-10 shadow-xl border-none text-primary-content">Démarrer l'aventure</Link>
                            <a href="#enfants" className="btn btn-outline btn-lg rounded-full px-10 border-base-content/20">Voir les jeux</a>
                        </div>
                    </div>

                    {/* IMAGE DROITE AVEC HALO BLEU FORCÉ */}
                    <div className="w-full lg:w-1/2 text-center relative">
                        <div className="relative inline-block">
                            {/* LE HALO - Opacité 0.8 pour éviter le gris */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    width: '110%', height: '110%',
                                    background: 'hsl(var(--p))', // Couleur du bouton s'inscrire
                                    filter: 'blur(50px)', opacity: '0.8', zIndex: 0
                                }}
                            ></div>
                            <img src={HeroImage} className="relative z-10 w-full max-w-[450px] rounded-[3rem] shadow-2xl transition-transform hover:rotate-0" style={{ transform: 'rotate(-2deg)' }} alt="MathTool" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;