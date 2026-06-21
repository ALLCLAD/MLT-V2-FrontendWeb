import React, { useState, useEffect } from 'react';
import { Bell, LogOut, UserCircle, ChevronDown, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoutAction } from '../../apiDjango/authService';
import api from '../../apiDjango/api.jsx';
import { useCommunication } from '../../contexte/CommunicationContext.jsx';

const NavEnfant = () => {
    const navigate = useNavigate();
    const { unreadCount } = useCommunication(); // Connecté au WebSocket global
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [prenom, setPrenom] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/user-profile/');
                setPrenom(response.data.first_name);
            } catch (err) {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) setPrenom(user.first_name);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleLogout = () => {
        LogoutAction();
        navigate('/login');
    };

    return (
        <header className="h-20 bg-base-100 border-b border-base-300 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-end">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2.5 rounded-xl bg-base-200 text-base-content hover:bg-base-300 transition-all"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button
                    onClick={() => navigate('/enfant/notifications')}
                    className="btn btn-ghost btn-circle relative"
                >
                    <Bell size={22} className="text-base-content/70" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-base-100 font-black animate-bounce text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                <div className="h-8 w-[1px] bg-base-300 mx-2"></div>

                {/* Dropdown Profil */}
                <div className="dropdown dropdown-end ml-2">
                    <div tabIndex={0} role="button" className="flex items-center gap-3 bg-base-200 hover:bg-base-300 p-1.5 pr-4 rounded-2xl border border-base-300 cursor-pointer">
                        <div className="avatar">
                            <div className="w-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-md uppercase">
                                {prenom ? prenom[0].toUpperCase() : 'E'}
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-tight">
                            <span className="text-sm font-black text-base-content">{prenom || 'Enfant'}</span>
                            <span className="text-[10px] opacity-40 font-bold uppercase">Enfant</span>
                        </div>
                        <ChevronDown size={14} className="opacity-30" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 mt-4 border border-base-300 animate-in fade-in zoom-in-95 duration-200">
                        <li>
                            <button onClick={() => navigate('/enfant/profil')} className="flex items-center gap-3 py-3 rounded-xl font-bold">
                                <UserCircle size={18} /> Mon Profil
                            </button>
                        </li>
                        <div className="divider my-1 opacity-5"></div>
                        <li>
                            <button onClick={handleLogout} className="flex items-center gap-3 py-3 rounded-xl text-error font-bold">
                                <LogOut size={18} /> Quitter
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default NavEnfant;