import React, { useState } from 'react';
import { 
  Trophy, Flame, Star, Target, Sparkles, BookOpen, 
  Play, MessageSquare, Bell, User, ChevronRight, Award, 
  Map, Lightbulb, Compass, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TemplateEnfant = () => {
  const [xp, setXp] = useState(72);
  const [stars, setStars] = useState(140);
  const [streak, setStreak] = useState(5);
  const [activeTab, setActiveTab] = useState('quests');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const dailyQuests = [
    { id: 1, title: "L'addition magique", reward: "+15 XP", category: "Calcul", done: true },
    { id: 2, title: "Le mystère des fractions", reward: "+25 XP", category: "Géométrie", done: false },
    { id: 3, title: "Défi de rapidité : Multiplier", reward: "+30 XP", category: "Jeu", done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4f46e5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#db2777]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto backdrop-blur-md bg-slate-900/60 border border-slate-800/80 rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Top Header Card */}
        <div className="relative p-8 sm:p-10 border-b border-slate-850 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* User Bio */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800">
                  <span className="text-4xl">🚀</span>
                </div>
                <span className="absolute -bottom-2 -right-2 bg-indigo-500 text-white font-black text-xs px-2 py-0.5 rounded-full border-2 border-slate-950">
                  Niv.4
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-indigo-500/25">
                  <Sparkles size={12} className="animate-spin-slow text-indigo-400" /> Explorateur des Nombres
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-pink-100 bg-clip-text text-transparent">
                  Salut, <span className="italic font-black text-white">Léo</span> !
                </h1>
                <p className="text-slate-400 text-sm mt-1">Prêt pour ton aventure mathématique du jour ?</p>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-slate-950/80 p-3 rounded-2.5xl border border-slate-800/80">
              {/* Streak */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-orange-500/20">
                <Flame className="text-orange-500 animate-bounce" size={20} />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Série</div>
                  <div className="font-extrabold text-orange-400 text-lg leading-tight">{streak} jours</div>
                </div>
              </div>
              {/* Stars */}
              <button 
                onClick={triggerConfetti}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Étoiles</div>
                  <div className="font-extrabold text-yellow-400 text-lg leading-tight">{stars}</div>
                </div>
              </button>
            </div>
            
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          
          {/* Left / Middle: Learning Path & Tab Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Level Progress Bar */}
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                    <Zap size={18} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Énergie d'Apprentissage (XP)</span>
                </div>
                <span className="font-black text-indigo-400 tracking-tighter text-xl">{xp} / 100 XP</span>
              </div>
              
              <div className="h-6 w-full bg-slate-900 rounded-full p-1 border border-slate-800 shadow-inner overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                  style={{ width: `${xp}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-bar-stripe" />
                </div>
              </div>
              <p className="text-xs text-slate-500 italic mt-3">Encore {100 - xp} XP pour atteindre le Niveau 5 et débloquer le badge "Mage des Nombres" !</p>
            </div>

            {/* Quests / Exercises Toggle Cards */}
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-slate-850 pb-2">
                <button 
                  onClick={() => setActiveTab('quests')}
                  className={`px-4 py-2 text-sm font-extrabold rounded-xl transition-all duration-350 cursor-pointer ${
                    activeTab === 'quests' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                  }`}
                >
                  🎯 Quêtes du jour
                </button>
                <button 
                  onClick={() => setActiveTab('badges')}
                  className={`px-4 py-2 text-sm font-extrabold rounded-xl transition-all duration-350 cursor-pointer ${
                    activeTab === 'badges' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                  }`}
                >
                  🏆 Mes Trophées ({stars > 100 ? '4' : '2'})
                </button>
              </div>

              {activeTab === 'quests' ? (
                <div className="space-y-3">
                  {dailyQuests.map((quest) => (
                    <div 
                      key={quest.id} 
                      className={`flex justify-between items-center p-5 rounded-2.5xl border transition-all duration-300 ${
                        quest.done 
                          ? 'bg-emerald-950/20 border-emerald-500/20 opacity-75' 
                          : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold ${
                          quest.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {quest.done ? '✓' : '✏️'}
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            quest.done ? 'bg-emerald-500/10 text-emerald-300' : 'bg-indigo-500/10 text-indigo-300'
                          }`}>
                            {quest.category}
                          </span>
                          <p className={`font-bold text-base mt-1 ${quest.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {quest.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-indigo-300 bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                          {quest.reward}
                        </span>
                        {!quest.done && (
                          <button 
                            onClick={() => {
                              setXp(Math.min(100, xp + 15));
                              quest.done = true;
                              triggerConfetti();
                            }}
                            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                          >
                            <Play size={16} fill="white" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <BadgeCard icon="🔥" title="Super Assidu" desc="5 jours d'affilée" date="Obtenu hier" unlocked={true} />
                  <BadgeCard icon="📐" title="Mètre Laser" desc="Géométrie niveau 3" date="Obtenu le 12 Juin" unlocked={true} />
                  <BadgeCard icon="🌟" title="Plein d'étoiles" desc="Cumule 100 étoiles" date="Obtenu le 8 Juin" unlocked={true} />
                  <BadgeCard icon="👑" title="Roi des Mathy" desc="Complète 50 leçons" date="Verrouillé" unlocked={false} />
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar: Quick Navigation & Virtual Companion */}
          <div className="space-y-6">
            
            {/* Mascot Widget */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-3xl p-6 border border-indigo-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex gap-4 items-start relative z-10">
                <div className="text-4xl bg-slate-900/80 p-3 rounded-2xl border border-slate-800 animate-bounce">
                  🔮
                </div>
                <div>
                  <h4 className="font-extrabold text-indigo-300 text-sm uppercase tracking-wider">Mathy te conseille :</h4>
                  <div className="mt-2 text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-900">
                    "Essaye de faire l'exercice sur les fractions aujourd'hui pour obtenir ta <strong>médaille de bronze</strong> !"
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Portal */}
            <div className="bg-slate-950/40 border border-slate-850 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Menu d'Aventure</h3>
              
              <div className="grid gap-3">
                <MenuButton icon={<Map className="text-sky-400" />} title="Carte des Leçons" subtitle="Apprends et révise" color="sky" />
                <MenuButton icon={<Compass className="text-purple-400" />} title="Jeux Mathématiques" subtitle="Entraîne-toi en jouant" color="purple" />
                <MenuButton icon={<Lightbulb className="text-amber-400" />} title="Astuces secrètes" subtitle="Aide et explications" color="amber" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

const BadgeCard = ({ icon, title, desc, date, unlocked }) => (
  <div className={`p-4 rounded-2.5xl border text-center flex flex-col items-center justify-center transition-all duration-300 ${
    unlocked 
      ? 'bg-slate-900/90 border-slate-800/80 hover:border-purple-500/30' 
      : 'bg-slate-950/40 border-slate-900/60 opacity-40'
  }`}>
    <span className={`text-3xl mb-2 block ${unlocked ? 'animate-pulse' : 'grayscale'}`}>{icon}</span>
    <h5 className="font-bold text-sm text-slate-200 leading-tight">{title}</h5>
    <p className="text-[10px] text-slate-500 mt-1">{desc}</p>
    <span className="text-[8px] bg-slate-950 px-2 py-0.5 rounded-full font-bold uppercase text-slate-400 tracking-widest mt-2">{date}</span>
  </div>
);

const MenuButton = ({ icon, title, subtitle, color }) => (
  <button className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-2xl border border-slate-850 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer text-left">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-950 rounded-xl group-hover:scale-110 transition duration-300">
        {icon}
      </div>
      <div>
        <p className="font-extrabold text-sm text-slate-200 group-hover:text-white">{title}</p>
        <p className="text-[10px] text-slate-500">{subtitle}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition duration-300" />
  </button>
);

export default TemplateEnfant;
