import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarParent from '../UIparent/SidebarParent';
import NavbarDash from '../UI/NavDash.jsx';

const LayoutParent = () => {
    return (
        <div className="flex h-screen bg-base-100 overflow-hidden font-sans">
            <SidebarParent />

            <div className="flex-grow flex flex-col min-w-0 bg-base-200">
                <NavbarDash />

                {/* Le secret est ici : flex flex-col et min-h-full */}
                <main className="flex-grow overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto min-h-full flex flex-col">

                        {/* Le contenu prend tout l'espace disponible grâce à flex-grow */}
                        <div className="flex-grow">
                            <Outlet />
                        </div>

                        {/* Le footer restera donc naturellement poussé tout en bas */}
                        <footer className="mt-auto py-8 border-t border-base-300 text-center opacity-50">
                            <p className="text-xs font-bold uppercase tracking-widest">
                                Math Learning Tool — Plateforme Éducative
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LayoutParent;