import React from 'react';
import Navbar from '../composants/UI/Navbar';
import Hero from '../composants/UI/Hero';
import SectionEnfant from '../composants/UI/SectionEnfant';
import SectionParent from '../composants/UI/SectionParent';
import SectionEnseignant from '../composants/UI/SectionEnseignant';
import Footer from '../composants/UI/Footer';

const Accueil = () => {
    return (
        <div className="min-h-screen bg-base-100 text-base-content transition-all">
            <Navbar />
            <main>
                <Hero />
                <SectionEnfant />
                <SectionParent />
                <SectionEnseignant />
            </main>
            <Footer />
        </div>
    );
};

export default Accueil;