import React from 'react';
import { Link } from 'react-router-dom';
import ImgEnseignant from '../../assets/img_5.png';

const SectionEnseignant = () => {
    return (
        <section id="enseignant" className="py-16 my-10 px-4 bg-base-100">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center p-8 md:p-16 bg-neutral text-neutral-content rounded-[3rem] shadow-2xl overflow-hidden">
                    <div className="w-full md:w-5/12 text-center">
                        <img src={ImgEnseignant} className="w-full max-w-sm mx-auto rounded-3xl object-cover opacity-80" alt="Enseignants" />
                    </div>
                    <div className="w-full md:w-7/12 md:pl-12 mt-10 md:mt-0">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-warning">La technologie au service <br />pédagogique.</h2>
                        <p className="text-lg opacity-70 mb-8 font-medium">Gérez vos classes et identifiez les besoins de vos élèves instantanément.</p>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] mb-8">
                            <h5 className="text-xl font-bold mb-3 flex items-center gap-2 text-warning"><i className="bi bi-mortarboard-fill"></i> Tableau de bord</h5>
                            <p className="text-sm opacity-80">Correction automatique et statistiques par classe.</p>
                        </div>
                        <Link to="/inscription" className="btn btn-warning rounded-full px-8 font-black text-gray-900 border-none">Découvrir les outils</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionEnseignant;