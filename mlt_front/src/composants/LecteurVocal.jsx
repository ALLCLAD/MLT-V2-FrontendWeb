import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import api from '../apiDjango/api.jsx';
import { stopAllAudio, setCurrentAudio, setCurrentAbortController, registerInterruptCallback } from '../apiDjango/ttsService';

const LecteurVocal = ({ texte }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [indexPhrase, setIndexPhrase] = useState(0);
    const [totalPhrases, setTotalPhrases] = useState(0);

    const audioRef = useRef(null);
    const indexRef = useRef(0);
    const phrasesRef = useRef([]);
    const abortControllerRef = useRef(null);
    const userPausedRef = useRef(false);
    
    // Identifiant de session de lecture pour éviter les chevauchements asynchrones
    const lectureSessionIdRef = useRef(0);
    
    // Réf pour avoir la valeur de isSpeaking en temps réel dans les callbacks
    const isSpeakingRef = useRef(false);
    useEffect(() => {
        isSpeakingRef.current = isSpeaking;
    }, [isSpeaking]);

    // Nettoyage strict : Markdown + Émojis + Pauses de lecture
    const filtrerTexte = (txt) => {
        if (!txt) return "";
        return txt
            // 1. Suppression des émojis et symboles spéciaux
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

    const decouperEnPhrases = (texteNettoye) => {
        if (!texteNettoye) return [];
        const phrases = [];
        let accumule = "";
        for (let i = 0; i < texteNettoye.length; i++) {
            const char = texteNettoye[i];
            accumule += char;
            // Découper sur les points de ponctuation principaux
            if (char === '.' || char === '?' || char === '!') {
                const texteTrimme = accumule.trim();
                // Éviter de découper sur les numéros de liste comme "1.", "2.", etc.
                const estNumeroListe = char === '.' && /^\d+$/.test(texteTrimme.substring(0, texteTrimme.length - 1));
                
                if (!estNumeroListe) {
                    phrases.push(texteTrimme);
                    accumule = "";
                }
            }
        }
        if (accumule.trim()) {
            phrases.push(accumule.trim());
        }
        
        // Sécurité supplémentaire : si une phrase est extrêmement longue, on la recoupe par morceaux plus petits
        const phrasesFinales = [];
        for (const p of phrases) {
            if (p.length > 800) {
                const parties = p.split(',');
                for (let i = 0; i < parties.length; i++) {
                    let fragment = parties[i].trim();
                    if (fragment) {
                        if (i < parties.length - 1) {
                            fragment += ',';
                        }
                        phrasesFinales.push(fragment);
                    }
                }
            } else {
                phrasesFinales.push(p);
            }
        }
        
        return phrasesFinales.filter(p => p.length > 0);
    };

    // Initialiser les phrases au chargement ou changement de texte
    useEffect(() => {
        const texteNettoye = filtrerTexte(texte);
        const listePhrases = decouperEnPhrases(texteNettoye);
        phrasesRef.current = listePhrases;
        setTotalPhrases(listePhrases.length);
        
        // Enregistrer le callback d'interruption globale
        registerInterruptCallback(() => {
            if (isSpeakingRef.current) {
                stop();
            }
        });

        return () => {
            // Nettoyage complet lors du démontage du composant
            stopSilencieusement();
            registerInterruptCallback(null);
        };
    }, [texte]);

    const stopSilencieusement = () => {
        // Incrémenter la session de lecture annule immédiatement toute boucle ou promesse en cours
        lectureSessionIdRef.current += 1;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        if (audioRef.current) {
            try {
                audioRef.current.onended = null;
                audioRef.current.onerror = null;
                audioRef.current.onpause = null;
                audioRef.current.pause();
            } catch (e) {}
            audioRef.current = null;
        }
        setCurrentAudio(null);
        setCurrentAbortController(null);
    };

    const stop = () => {
        stopSilencieusement();
        indexRef.current = 0;
        setIndexPhrase(0);
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoading(false);
        userPausedRef.current = false;
    };

    const pause = () => {
        userPausedRef.current = true;
        setIsSpeaking(false);
        setIsPaused(true);
        setIsLoading(false);

        // On incrémente la session de lecture pour annuler les requêtes asynchrones en cours
        lectureSessionIdRef.current += 1;

        if (audioRef.current) {
            audioRef.current.pause();
        } else if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setCurrentAbortController(null);
        }
    };

    const jouerSegment = async (index) => {
        // Enregistrer l'ID de session actuel pour ce segment
        const sessionId = lectureSessionIdRef.current;

        if (index >= phrasesRef.current.length) {
            stop();
            return;
        }

        indexRef.current = index;
        setIndexPhrase(index);
        const phrase = phrasesRef.current[index];

        // Préparer le controller pour l'annulation
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setCurrentAbortController(controller);
        setIsLoading(true);

        try {
            const response = await api.post(
                '/tts/synthesize/',
                { text: phrase },
                { 
                    responseType: 'blob',
                    signal: controller.signal
                }
            );

            // Validation de session : si la session a changé pendant le téléchargement, on abandonne !
            if (lectureSessionIdRef.current !== sessionId) return;

            setIsLoading(false);
            const audioBlob = new Blob([response.data], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            setCurrentAudio(audio);

            audio.onended = () => {
                // Validation de session
                if (lectureSessionIdRef.current !== sessionId) return;
                
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
                setCurrentAudio(null);
                // Passer au segment suivant
                jouerSegment(indexRef.current + 1);
            };

            audio.onerror = (err) => {
                console.error("Erreur lecture audio segment:", err);
                if (lectureSessionIdRef.current !== sessionId) return;

                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
                setCurrentAudio(null);
                // Passer au suivant après 1s
                setTimeout(() => {
                    if (lectureSessionIdRef.current === sessionId && isSpeakingRef.current && !userPausedRef.current) {
                        jouerSegment(indexRef.current + 1);
                    }
                }, 1000);
            };

            await audio.play();
            
            // Re-vérifier au cas où un changement de session synchrone aurait eu lieu pendant play()
            if (lectureSessionIdRef.current !== sessionId) {
                audio.pause();
                return;
            }
        } catch (err) {
            if (err.name === 'AbortError' || err.message === 'canceled') {
                return; // Annulation silencieuse
            }
            console.error("Erreur synthèse segment :", err);
            
            if (lectureSessionIdRef.current !== sessionId) return;

            setIsLoading(false);
            // Passer au suivant après 1s
            setTimeout(() => {
                if (lectureSessionIdRef.current === sessionId && isSpeakingRef.current && !userPausedRef.current) {
                    jouerSegment(indexRef.current + 1);
                }
            }, 1000);
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
                setCurrentAbortController(null);
            }
        }
    };

    const lire = async () => {
        // 1. Si on reprend après une pause utilisateur
        if (isPaused && userPausedRef.current) {
            userPausedRef.current = false;
            setIsSpeaking(true);
            setIsPaused(false);
            
            // Relancer une session pour cette reprise
            lectureSessionIdRef.current += 1;
            const sessionId = lectureSessionIdRef.current;
            
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    // Vérifier si une interruption a eu lieu pendant le play
                    if (lectureSessionIdRef.current !== sessionId) {
                        audioRef.current.pause();
                    }
                } catch (err) {
                    console.error("Erreur de reprise lecture :", err);
                    jouerSegment(indexRef.current);
                }
            } else {
                jouerSegment(indexRef.current);
            }
            return;
        }

        // 2. Sinon, on démarre une nouvelle lecture
        stopAllAudio(); // Coupe tout autre audio du site. Le callback d'interruption n'aura pas d'effet car isSpeaking est encore false !

        if (phrasesRef.current.length === 0) return;

        // Démarrer une nouvelle session de lecture
        lectureSessionIdRef.current += 1;
        
        setIsSpeaking(true);
        setIsPaused(false);
        userPausedRef.current = false;
        
        jouerSegment(indexRef.current);
    };

    return (
        <div className="flex items-center gap-4 bg-primary/10 p-5 rounded-[2rem] border-2 border-primary/20 mb-8 animate-in fade-in zoom-in duration-500">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Volume2 size={24} className={isSpeaking && !isLoading ? "animate-pulse" : ""} />
            </div>

            <div className="flex-1">
                <p className="font-black text-primary text-xs uppercase tracking-widest">Écoute ta leçon</p>
                <p className="text-[10px] font-bold opacity-70 text-base-content/85">
                    {isLoading 
                        ? "Mathy prépare sa voix..." 
                        : isSpeaking 
                            ? `Lecture : phrase ${indexPhrase + 1} sur ${totalPhrases}...` 
                            : isPaused 
                                ? "Lecture suspendue" 
                                : "Clique sur play pour écouter Mathy"
                    }
                </p>
                {totalPhrases > 0 && (isSpeaking || isPaused) && (
                    <div className="w-full bg-base-300 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                            className="bg-primary h-full transition-all duration-300 rounded-full"
                            style={{ width: `${((indexPhrase + (isSpeaking && !isLoading ? 0.5 : 0)) / totalPhrases) * 100}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {isLoading ? (
                    <button className="btn btn-circle btn-primary shadow-lg cursor-not-allowed">
                        <Loader2 size={20} className="animate-spin" />
                    </button>
                ) : !isSpeaking ? (
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
                    disabled={!isSpeaking && !isPaused && indexPhrase === 0}
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

export default LecteurVocal;