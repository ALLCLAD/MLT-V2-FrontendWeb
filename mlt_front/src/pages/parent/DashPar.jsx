import React from 'react';
import ApercuStats from '../../composants/UIparent/AperçuStats';

const DashPar = () => {
    return (
        <div className="animate-in fade-in duration-500">
            {/* On a supprimé le Header ici car il est déjà inclus
               dans le composant ApercuStats pour éviter les doublons.
            */}
            <ApercuStats />
        </div>
    );
};

export default DashPar;