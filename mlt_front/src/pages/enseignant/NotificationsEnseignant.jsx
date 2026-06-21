import React, { useState, useEffect, useMemo } from 'react';
import { Bell, GraduationCap, Eye, CheckCircle2, Activity, MessageSquare, BookOpen, Loader2, Trash2, Calendar } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import { useCommunication } from '../../contexte/CommunicationContext.jsx';

const NotificationsEnseignant = () => {
    const [notifs, setNotifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setUnreadCount } = useCommunication();

    const fetchNotifs = async () => {
        try {
            const res = await api.get('/communication/notifications/');
            setNotifs(res.data);
            setUnreadCount(res.data.filter(n => !n.est_lu).length);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifs(); }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/communication/notifications/${id}/lire/`);
            setNotifs(prev => prev.map(n => n.id === id ? { ...n, est_lu: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const deleteNotif = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/communication/notifications/${id}/supprimer/`);
            const deleted = notifs.find(n => n.id === id);
            setNotifs(prev => prev.filter(n => n.id !== id));
            if (deleted && !deleted.est_lu) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const deleteAllNotifs = async () => {
        if (!window.confirm("Voulez-vous supprimer tout l'historique de votre journal ?")) return;
        try {
            await api.post('/communication/notifications/tout-supprimer/');
            setNotifs([]);
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/communication/notifications/tout-lire/');
            setNotifs(prev => prev.map(n => ({ ...n, est_lu: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'LECTURE_COURS':  return <Eye className="text-indigo-500" />;
            case 'EXERCICE_FINI':  return <CheckCircle2 className="text-green-500" />;
            case 'QUIZ_FINI':      return <Activity className="text-amber-500" />;
            case 'MESSAGE_RECU':   return <MessageSquare className="text-blue-500" />;
            case 'LECON_PUBLIEE':  return <BookOpen className="text-teal-500" />;
            default:               return <Bell className="text-gray-400" />;
        }
    };

    const groupedNotifs = useMemo(() => {
        return notifs.reduce((groups, notif) => {
            const date = new Date(notif.date_creation);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            let dayLabel = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            if (date.toDateString() === today.toDateString()) dayLabel = "Aujourd'hui";
            else if (date.toDateString() === yesterday.toDateString()) dayLabel = "Hier";
            if (!groups[dayLabel]) groups[dayLabel] = [];
            groups[dayLabel].push(notif);
            return groups;
        }, {});
    }, [notifs]);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            <div className="bg-base-100 border border-base-300 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[85vh]">
                <header className="p-8 md:p-12 border-b border-base-200 bg-base-100/50 backdrop-blur-md sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-3xl text-primary"><GraduationCap size={40} /></div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Journal de Classe</h1>
                            <p className="text-sm font-bold opacity-40 mt-1">Activités de vos élèves et messages en temps réel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {notifs.length > 0 && (
                            <>
                                <button onClick={markAllAsRead} className="btn btn-ghost btn-sm text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">
                                    <CheckCircle2 size={16} className="mr-2" /> Tout lire
                                </button>
                                <button onClick={deleteAllNotifs} className="btn btn-ghost btn-sm text-error/60 hover:text-error hover:bg-error/10 rounded-xl"><Trash2 size={18} /></button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 opacity-20">
                            <Loader2 className="animate-spin mb-4 text-primary" size={48} /><span className="font-black italic text-xl uppercase tracking-widest">Mise à jour du journal...</span>
                        </div>
                    ) : notifs.length === 0 ? (
                        <div className="text-center py-32 flex flex-col items-center opacity-20">
                            <Activity size={100} strokeWidth={1} /><p className="text-2xl font-black italic mt-4 uppercase">Aucune activité récente</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {Object.entries(groupedNotifs).map(([day, items]) => (
                                <section key={day} className="space-y-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-[2px] flex-1 bg-base-200"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 flex items-center gap-2"><Calendar size={12} /> {day}</span>
                                        <div className="h-[2px] flex-1 bg-base-200"></div>
                                    </div>
                                    <div className="grid gap-4">
                                        {items.map((n) => (
                                            <div key={n.id} onClick={() => !n.est_lu && markAsRead(n.id)}
                                                 className={`group relative p-6 md:p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-8 ${n.est_lu ? 'bg-base-200/30 border-transparent opacity-50 grayscale-[0.5]' : 'bg-base-100 border-base-200 shadow-xl shadow-base-300/20 hover:border-primary/30 hover:scale-[1.01]'}`}>
                                                <div className={`p-5 rounded-[1.5rem] transition-transform group-hover:-rotate-6 ${n.est_lu ? 'bg-base-200' : 'bg-primary/5'}`}>{getIcon(n.type_notif)}</div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${n.est_lu ? 'bg-base-300' : 'text-primary bg-primary/10'}`}>{n.type_notif.replace('_', ' ')}</span>
                                                        {!n.est_lu && <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></span>}
                                                    </div>
                                                    <h3 className="font-black text-xl mt-2 leading-tight">{n.titre}</h3>
                                                    <p className="text-base-content/60 font-semibold mt-1">{n.message}</p>
                                                    <div className="mt-4 flex items-center gap-2 opacity-30 text-[10px] font-bold"><Bell size={10} />{new Date(n.date_creation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <button onClick={(e) => deleteNotif(e, n.id)} className="p-4 rounded-full opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsEnseignant;