import React, { useState } from 'react';
import { 
  Users, Star, Trophy, Clock, MessageCircle, Bell, 
  ArrowRight, ShieldCheck, Mail, Calendar, HelpCircle, 
  TrendingUp, Sparkles, UserCheck 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

const TemplateParent = () => {
  const [selectedChild, setSelectedChild] = useState('Leo');

  // Sample children data
  const childrenStats = {
    Leo: {
      prenom: "Léo",
      level: 4,
      xp: 72,
      average: "15.4/20",
      completed: 18,
      timeSpent: "2h 45m",
      radarData: [
        { subject: 'Calcul', A: 85, fullMark: 100 },
        { subject: 'Géométrie', A: 60, fullMark: 100 },
        { subject: 'Mesures', A: 90, fullMark: 100 },
        { subject: 'Problèmes', A: 75, fullMark: 100 },
        { subject: 'Logique', A: 80, fullMark: 100 },
      ],
      recentScores: [
        { id: 1, topic: "L'addition magique", category: "Calcul", date: "Aujourd'hui", score: 18 },
        { id: 2, topic: "Polygones réguliers", category: "Géométrie", date: "Hier", score: 12 },
        { id: 3, topic: "Problèmes de vitesse", category: "Problèmes", date: "21 Juin", score: 16 },
      ]
    },
    Emma: {
      prenom: "Emma",
      level: 6,
      xp: 45,
      average: "17.8/20",
      completed: 29,
      timeSpent: "4h 10m",
      radarData: [
        { subject: 'Calcul', A: 95, fullMark: 100 },
        { subject: 'Géométrie', A: 85, fullMark: 100 },
        { subject: 'Mesures', A: 70, fullMark: 100 },
        { subject: 'Problèmes', A: 90, fullMark: 100 },
        { subject: 'Logique', A: 95, fullMark: 100 },
      ],
      recentScores: [
        { id: 1, topic: "Divisions complexes", category: "Calcul", date: "Aujourd'hui", score: 19 },
        { id: 2, topic: "Aires et Périmètres", category: "Géométrie", date: "20 Juin", score: 18 },
        { id: 3, topic: "Logique pure", category: "Logique", date: "18 Juin", score: 17 },
      ]
    }
  };

  const activeData = childrenStats[selectedChild];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Background soft ambient lights */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navbar Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-slate-900/30 border border-slate-800/80 rounded-3.5xl backdrop-blur-md gap-6">
          <div>
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <ShieldCheck size={14} /> Espace Parent Sécurisé
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Espace Famille</h1>
            <p className="text-slate-400 text-sm mt-1">Suivez les activités d'apprentissage et encouragez vos enfants.</p>
          </div>

          {/* Children Selector */}
          <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800/60">
            {Object.keys(childrenStats).map((name) => (
              <button
                key={name}
                onClick={() => setSelectedChild(name)}
                className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedChild === name 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                  {name === 'Leo' ? '👦' : '👧'}
                </div>
                {childrenStats[name].prenom}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/15 p-6 rounded-2.5xl flex items-center gap-4">
            <div className="p-3.5 bg-slate-900 rounded-xl text-purple-400">
              <Star size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Moyenne</span>
              <h4 className="text-2xl font-black text-slate-200 mt-0.5">{activeData.average}</h4>
              <p className="text-[10px] text-purple-400/80 font-medium mt-1">Excellent niveau global</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/15 p-6 rounded-2.5xl flex items-center gap-4">
            <div className="p-3.5 bg-slate-900 rounded-xl text-emerald-400">
              <Trophy size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Exercices Résolus</span>
              <h4 className="text-2xl font-black text-slate-200 mt-0.5">{activeData.completed}</h4>
              <p className="text-[10px] text-emerald-400/80 font-medium mt-1">Programme à jour</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/15 p-6 rounded-2.5xl flex items-center gap-4">
            <div className="p-3.5 bg-slate-900 rounded-xl text-blue-400">
              <Clock size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Temps Passé</span>
              <h4 className="text-2xl font-black text-slate-200 mt-0.5">{activeData.timeSpent}</h4>
              <p className="text-[10px] text-blue-400/80 font-medium mt-1">Régularité optimale</p>
            </div>
          </div>

        </div>

        {/* Analytics Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Radar Chart (Left/Middle) */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-200">Compétences de {activeData.prenom}</h3>
                <p className="text-xs text-slate-500">Aperçu par matière du programme scolaire.</p>
              </div>
              <TrendingUp className="text-purple-400" />
            </div>

            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeData.radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                  <Radar name={activeData.prenom} dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity (Right) */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-200 mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" /> Activité Récente
              </h3>
              
              <div className="space-y-4">
                {activeData.recentScores.map((score) => (
                  <div key={score.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {score.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-200 mt-2">{score.topic}</h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{score.date}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xl font-black italic ${
                        score.score >= 16 ? 'text-emerald-400' :
                        score.score >= 12 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {score.score}<span className="text-xs opacity-40 not-italic">/20</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/20 text-xs font-bold text-purple-400 rounded-2xl transition cursor-pointer">
              Contacter l'enseignant <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TemplateParent;
