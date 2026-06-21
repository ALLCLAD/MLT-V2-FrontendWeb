import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEnseignant from '../UIenseignant/SidebarEnseignant';
import NavbarDash from '../UI/NavDash';

const LayoutEnseignant = () => {
    return (
        <div className="flex h-screen bg-base-100 overflow-hidden font-sans">
            <SidebarEnseignant />

            <div className="flex-grow flex flex-col min-w-0 bg-base-200">
                <NavbarDash />

                <main className="flex-grow overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto min-h-full flex flex-col">

                        <div className="flex-grow">
                            <Outlet />
                        </div>

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

export default LayoutEnseignant;