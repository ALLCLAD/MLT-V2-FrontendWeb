import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEnfant from '../UIenfant/SidebarEnfant';
import NavEnfant from '../UIenfant/NavEnfant';

const LayoutEnfant = () => {
    return (
        <div className="flex h-screen bg-base-100 overflow-hidden font-sans">
            <SidebarEnfant />
            <div className="flex-grow flex flex-col min-w-0 bg-base-200">
                <NavEnfant />
                <main className="flex-grow overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto min-h-full flex flex-col">
                        <div className="flex-grow">
                            <Outlet />
                        </div>
                        <footer className="mt-auto py-8 opacity-30 text-center text-xs font-bold uppercase tracking-widest">
                            Math Learning Tool — Ton aventure mathématique
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LayoutEnfant;