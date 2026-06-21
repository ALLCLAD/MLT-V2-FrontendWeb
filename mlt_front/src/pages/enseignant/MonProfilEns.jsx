import React, { useState, useEffect } from 'react';
import { Mail, GraduationCap, Loader2, UserCircle, School, BookOpen, ShieldCheck } from 'lucide-react';
import api from '../../apiDjango/api.jsx';

const ProfilEnseignant = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/user-profile/');
                setProfile(response.data);
            } catch (err) {
                console.error("Erreur profil enseignant:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans">
            <div className="max-w-3xl mx-auto bg-base-100 rounded-[2.5rem] shadow-xl border border-base-300 overflow-hidden flex flex-col">

                {/* BANNIÈRE HAUTE */}
                <div className="h-28 bg-primary/10 relative border-b border-base-200">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 flex flex-col md:flex-row items-center gap-4">
                        <div className="w-20 h-20 bg-primary text-primary-content rounded-3xl shadow-lg border-4 border-base-100 flex items-center justify-center text-3xl font-black">
                            {profile.first_name ? profile.first_name[0] : profile.username[0]}
                        </div>
                        <div className="text-center md:text-left md:pb-1">
                            <h2 className="text-xl font-black text-base-content tracking-tight">
                                {profile.first_name} {profile.last_name}
                            </h2>
                            <p className="text-base-content/40 text-xs font-bold uppercase tracking-widest">Compte Enseignant</p>
                        </div>
                    </div>
                </div>

                {/* CONTENU */}
                <div className="mt-14 p-6 md:p-10 flex-1">
                    <div className="max-w-md mx-auto space-y-8">

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-base-200 pb-2 mb-4">
                                <ShieldCheck size={16} className="text-primary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Informations Professionnelles</h3>
                            </div>

                            <div className="space-y-3">
                                {/* EMAIL */}
                                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200 transition-all hover:border-primary/30">
                                    <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-primary shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[9px] font-black text-base-content/40 uppercase tracking-tighter">Adresse Email</p>
                                        <p className="text-base-content font-bold truncate">{profile.email}</p>
                                    </div>
                                </div>

                                {/* ÉTABLISSEMENT */}
                                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200 transition-all hover:border-blue-400/30">
                                    <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-blue-500 shadow-sm">
                                        <School size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-base-content/40 uppercase tracking-tighter">Établissement</p>
                                        <p className="text-base-content font-bold">{profile.etablissement || "Non renseigné"}</p>
                                    </div>
                                </div>

                                {/* CLASSE ENSEIGNÉE */}
                                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200 transition-all hover:border-success/30">
                                    <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-success shadow-sm">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-base-content/40 uppercase tracking-tighter">Classe en charge</p>
                                        <p className="text-base-content font-bold">{profile.classe_enseignement || "Non assignée"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-base-content/20 font-bold uppercase tracking-widest">
                            Espace Pédagogique • M L T
                        </p>
                    </div>
                </div>
                <div className="h-2 bg-primary/20"></div>
            </div>
        </div>
    );
};

export default ProfilEnseignant;