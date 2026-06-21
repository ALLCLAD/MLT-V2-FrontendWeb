import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ClipboardList, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../../apiDjango/api';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-base-100 p-6 rounded-[2.5rem] border border-base-content/5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl text-white ${color} shadow-lg`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div className="flex items-center gap-1 text-success font-black text-xs bg-success/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {trend}
            </div>
        </div>
        <div>
            <p className="text-sm font-bold opacity-40 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-black mt-1">{value}</h3>
        </div>
    </div>
);

const ApercuStatsEns = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/enseignant/stats/');
                setStats(response.data);
            } catch (err) {
                console.error("Erreur stats enseignant:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-primary" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Élèves inscrits"
                value={stats?.totalEleves || 0}
                icon={<Users />}
                color="bg-blue-500"
                trend="+1"
            />
            <StatCard
                title="Leçons créées"
                value={stats?.totalLecons || 0}
                icon={<BookOpen />}
                color="bg-violet-500"
                trend="+2"
            />
            <StatCard
                title="Exercices donnés"
                value={stats?.totalExercices || 0}
                icon={<ClipboardList />}
                color="bg-emerald-500"
                trend="+5"
            />
            
        </div>
    );
};

export default ApercuStatsEns;