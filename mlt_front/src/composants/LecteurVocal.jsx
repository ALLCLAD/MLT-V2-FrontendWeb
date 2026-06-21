import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

const LecteurVocal = ({ texte }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const synth = window.speechSynthesis;

    // Charger les voix de manière sécurisée
    useEffect(() => {
        const updateVoices = () => {
            setVoices(synth.getVoices());
        };

        updateVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = updateVoices;
        }

        return () => synth.cancel();
    }, [synth]);

    // Nettoyage strict : Markdown + Émojis + Pauses de lecture
    const filtrerTexte = (txt) => {
        if (!txt) return "";
        return txt
            // 1. Suppression radicale des émojis et symboles spéciaux
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
            // 2. Nettoyage Markdown
            .replace(/[#*`_~]/g, '')
            // 3. Texte des liens uniquement
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            // 4. Remplacement des sauts de ligne par des points (pour marquer des pauses)
            .replace(/[\r\n]+/g, '. ')
            // 5. Nettoyage des espaces doubles
            .replace(/\s+/g, ' ')
            .trim();
    };

    const obtenirMeilleureVoixFrancaise = useCallback(() => {
        const toutesLesVoix = voices.length > 0 ? voices : synth.getVoices();

        // Priorité aux voix de haute qualité
        return toutesLesVoix.find(v => v.lang === 'fr-FR' && v.name.includes('Google')) ||
            toutesLesVoix.find(v => v.lang === 'fr-FR' && v.name.includes('Premium')) ||
            toutesLesVoix.find(v => v.lang === 'fr-FR') ||
            toutesLesVoix.find(v => v.lang.startsWith('fr'));
    }, [voices, synth]);

    const lire = () => {
        if (isPaused) {
            synth.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        synth.cancel();

        const texteNettoye = filtrerTexte(texte);
        const message = new SpeechSynthesisUtterance(texteNettoye);

        const voixFr = obtenirMeilleureVoixFrancaise();
        if (voixFr) {
            message.voice = voixFr;
            message.lang = voixFr.lang;
        } else {
            message.lang = 'fr-FR';
        }

        // --- AJUSTEMENT DE LA VITESSE ---
        // 0.65 c'est une vitesse calme, idéale pour que l'enfant assimile bien.
        message.rate = 0.75;
        message.pitch = 1.1; // Garde une tonalité légèrement enfantine/amicale

        message.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        message.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        message.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        synth.speak(message);
    };

    const pause = () => {
        if (synth.speaking) {
            synth.pause();
            setIsPaused(true);
            setIsSpeaking(false);
        }
    };

    const stop = () => {
        synth.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    return (
        <div className="flex items-center gap-4 bg-primary/10 p-5 rounded-[2rem] border-2 border-primary/20 mb-8 animate-in fade-in zoom-in duration-500">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Volume2 size={24} className={isSpeaking ? "animate-pulse" : ""} />
            </div>

            <div className="flex-1">
                <p className="font-black text-primary text-xs uppercase tracking-widest">Écoute ta leçon</p>
                <p className="text-[10px] font-bold opacity-50 italic text-base-content">
                    {isSpeaking ? "Mathy lit doucement pour toi..." : "Clique sur play pour écouter Mathy"}
                </p>
            </div>

            <div className="flex gap-2">
                {!isSpeaking ? (
                    <button
                        onClick={lire}
                        className="btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform"
                    >
                        <Play size={20} fill="currentColor" />
                    </button>
                ) : (
                    <button
                        onClick={pause}
                        className="btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform"
                    >
                        <Pause size={20} fill="currentColor" />
                    </button>
                )}

                <button
                    onClick={stop}
                    className="btn btn-circle btn-ghost text-error hover:bg-error/10"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

export default LecteurVocal;