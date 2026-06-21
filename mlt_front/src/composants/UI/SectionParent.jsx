import React from 'react';
import { Link } from 'react-router-dom';
import ImgParent from '../../assets/img_3.png';

const SectionParent = () => {
    return (
        <section id="parent" className="py-16 my-10 px-4 bg-base-100 text-base-content">
            <div className="container mx-auto">
                <div className="relative flex flex-col md:flex-row-reverse items-center p-8 md:p-16 bg-primary text-primary-content rounded-[3rem] shadow-2xl overflow-hidden">
                    <div className="w-full md:w-7/12 md:pr-12 mt-10 md:mt-0 z-10">
                        <div className="inline-block bg-white/20 text-white text-xs font-black tracking-widest px-4 py-2 rounded-xl mb-6 uppercase">ESPACE PARENT</div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white">Gardez l'esprit tranquille.</h2>
                        <p className="text-lg opacity-90 mb-8 font-medium text-white/80">Suivez les progrès en temps réel et recevez des rapports détaillés.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 font-bold text-white">
                            <div className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-warning"></i> Contrôle parental</div>
                            <div className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-warning"></i> Rapports hebdomadaires</div>
                        </div>
                        <Link to="/inscription" className="btn btn-warning rounded-full px-10 font-black text-gray-900 border-none">Accès Parent</Link>
                    </div>
                    <div className="w-full md:w-5/12 text-center z-10">
                        <img src={ImgParent} className="w-full max-w-sm mx-auto rounded-3xl object-cover shadow-lg border-4 border-white/10" alt="Parents" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionParent;