import React, { useState, useEffect } from 'react';
import { Bell, Sun, Moon, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoutAction } from '../../apiDjango/authService.jsx';
import api from '../../apiDjango/api.jsx';
import { useCommunication } from '../../contexte/CommunicationContext.jsx';

/**
 * NAVBAR DASHBOARD ENSEIGNANT
 * Gère le thème, les notifications en temps réel et le profil enseignant.
 */
const NavbarDash = () => {
    const navigate = useNavigate();
    const { unreadCount } = useCommunication();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [user, setUser] = useState({ first_name: '', username: '' });

    // 1. Récupération des infos de l'utilisateur connecté
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/user-profile/');
                setUser(response.data);
            } catch (err) {
                console.error("Erreur chargement profil nav enseignant:", err);
            }
        };
        fetchUserData();
        
        // Application du thème
        document.querySelector('html').setAttribute('data-theme', theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleLogout = () => {
        LogoutAction();
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 border-b border-base-300 px-6 py-2 sticky top-0 z-30 shadow-sm">
            <div className="flex-1"></div>

            <div className="flex-none flex items-center gap-2">
                {/* Sélecteur de Thème */}
                <button 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")} 
                    className="btn btn-ghost btn-circle"
                    title="Changer de thème"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* CLOCHE DE NOTIFICATION (Lien direct vers /parent/notifications) */}
                                <button 
                                    id="notif-bell-enseignant"
                                    onClick={() => navigate('/enseignant/notifications')} 
                                    className="btn btn-ghost btn-circle relative transition-colors"
                                >
                                    <Bell size={22} className="text-base-content/70" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-500  text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-base-100 font-black animate-bounce">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                {/* Menu Profil Dropdown */}
                <div className="dropdown dropdown-end ml-2">
                    <div tabIndex={0} role="button" className="flex items-center gap-3 bg-base-200 hover:bg-base-300 transition-all p-1.5 pr-4 rounded-2xl border border-base-300 cursor-pointer">
                        <div className="avatar">
                            <div className="w-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-md uppercase">
                                {user.first_name ? user.first_name[0] : (user.username ? user.username[0] : 'E')}
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-tight">
                            <span className="text-sm font-black text-base-content">{user.first_name || user.username || 'Enseignant'}</span>
                            <span className="text-[10px] opacity-40 font-bold uppercase tracking-tight">Enseignant</span>
                        </div>
                        <ChevronDown size={14} className="opacity-30" />
                    </div>

                    <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-56 mt-4 border border-base-300 animate-in fade-in zoom-in-95 duration-200">
                        <li className="menu-title opacity-40 text-[10px] font-black uppercase tracking-widest px-4 py-2">Mon Compte</li>
                        <li>
                            <button 
                                onClick={() => navigate('/enseignant/profil')}
                                className="flex items-center gap-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary font-bold w-full text-left"
                            >
                                <UserCircle size={18} /> Mon Profil
                            </button>
                        </li>
                        <div className="divider my-1 opacity-5"></div>
                        <li>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 py-3 rounded-xl text-error hover:bg-error/5 font-bold w-full text-left"
                            >
                                <LogOut size={18} /> Se déconnecter
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavbarDash;