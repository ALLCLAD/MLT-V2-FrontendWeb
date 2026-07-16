import React, { useState, useEffect, useRef } from 'react';

const CalculEcritView = ({ question, data, onResolve, disabled }) => {
    // Ex de data: {"operande1": "135", "operande2": "48", "operateur": "+"}
    const op1Str = String(data?.operande1 || '').trim();
    const op2Str = String(data?.operande2 || '').trim();
    const operator = String(data?.operateur || '+').trim();
    
    // Déterminer la taille maximale pour aligner en colonnes (avec place pour un dépassement éventuel de retenue)
    const maxLen = Math.max(op1Str.length, op2Str.length) + 1;

    // Tableaux pour stocker les chiffres alignés à droite
    const op1Digits = op1Str.padStart(maxLen, ' ').split('');
    const op2Digits = op2Str.padStart(maxLen, ' ').split('');

    // États pour les entrées utilisateur
    const [resultDigits, setResultDigits] = useState(Array(maxLen).fill(''));
    const [retenues, setRetenues] = useState(Array(maxLen).fill(''));

    // Références pour la navigation automatique du focus (droite vers gauche !)
    const resultRefs = useRef([]);
    const retenuesRefs = useRef([]);

    // Définir la bonne réponse attendue
    const correctAnswer = String(question.reponse_correcte).trim();

    // Re-initialiser si la question change
    useEffect(() => {
        setResultDigits(Array(maxLen).fill(''));
        setRetenues(Array(maxLen).fill(''));
        // Mettre le focus sur la case tout à droite (les unités)
        setTimeout(() => {
            if (resultRefs.current[maxLen - 1]) {
                resultRefs.current[maxLen - 1].focus();
            }
        }, 50);
    }, [op1Str, op2Str, operator, maxLen]);

    // Gérer la saisie d'un chiffre dans le résultat
    const handleResultChange = (val, index) => {
        if (disabled) return;
        const cleaned = val.replace(/[^0-9]/g, '').slice(-1); // Seulement 1 chiffre

        const newDigits = [...resultDigits];
        newDigits[index] = cleaned;
        setResultDigits(newDigits);

        // Déplacer automatiquement le focus vers la gauche (calcul traditionnel)
        if (cleaned !== '' && index > 0) {
            resultRefs.current[index - 1].focus();
        }
    };

    // Gérer la touche Retour arrière (Backspace) pour le résultat
    const handleResultKeyDown = (e, index) => {
        if (disabled) return;
        if (e.key === 'Backspace' && resultDigits[index] === '' && index < maxLen - 1) {
            resultRefs.current[index + 1].focus();
        }
    };

    // Gérer la saisie d'un chiffre dans les retenues
    const handleRetenueChange = (val, index) => {
        if (disabled) return;
        const cleaned = val.replace(/[^0-9]/g, '').slice(-1);
        const newRetenues = [...retenues];
        newRetenues[index] = cleaned;
        setRetenues(newRetenues);

        if (cleaned !== '' && index > 0) {
            retenuesRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const concatted = resultDigits.join('').trim();
        if (concatted) {
            onResolve(concatted);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-300">
            <span className="badge badge-primary font-black uppercase mb-4 py-3 tracking-widest text-[10px]">
                Calcul Écrit Posé
            </span>
            
            {/* GRILLE D'OPÉRATION VERTICALE */}
            <div className="flex flex-col items-end font-mono text-3xl md:text-4xl text-base-content select-none">
                
                {/* 1. LIGNE DES RETENUES */}
                <div className="flex mb-2">
                    {retenues.map((val, idx) => (
                        <div key={`ret-${idx}`} className="w-12 h-12 flex items-center justify-center relative">
                            {/* Les retenues n'apparaissent pas sur la case de droite (les unités) */}
                            {idx < maxLen - 1 && (
                                <input
                                    ref={el => retenuesRefs.current[idx] = el}
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleRetenueChange(e.target.value, idx)}
                                    disabled={disabled}
                                    placeholder="+"
                                    className="w-8 h-8 rounded-full border border-primary/30 text-center text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-primary/5 placeholder-primary/20"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* 2. PREMIER OPÉRANDE */}
                <div className="flex mb-1">
                    {op1Digits.map((char, idx) => (
                        <div key={`op1-${idx}`} className="w-12 text-center font-black">
                            {char}
                        </div>
                    ))}
                </div>

                {/* 3. DEUXIÈME OPÉRANDE (avec opérateur) */}
                <div className="flex items-center mb-2 border-b-4 border-base-content/80 pb-2">
                    <span className="text-2xl mr-2 font-black opacity-65">{operator}</span>
                    <div className="flex">
                        {op2Digits.map((char, idx) => (
                            <div key={`op2-${idx}`} className="w-12 text-center font-black">
                                {char}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. ZONE DE RÉSULTAT */}
                <div className="flex gap-1 py-2">
                    {resultDigits.map((val, idx) => (
                        <input
                            key={`res-${idx}`}
                            ref={el => resultRefs.current[idx] = el}
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={val}
                            onChange={(e) => handleResultChange(e.target.value, idx)}
                            onKeyDown={(e) => handleResultKeyDown(e, idx)}
                            disabled={disabled}
                            maxLength={1}
                            className={`w-12 h-14 rounded-xl border-2 text-center text-2xl font-black focus:outline-none transition-all
                            ${disabled 
                                ? 'bg-base-200 border-base-300 text-base-content/50' 
                                : 'bg-base-100 border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                        />
                    ))}
                </div>
            </div>

            <p className="mt-4 text-[10px] font-bold text-base-content/50 text-center uppercase tracking-wider">
                Remplis de droite à gauche. Écris les retenues en haut si besoin.
            </p>

            <button
                type="submit"
                disabled={disabled || !resultDigits.join('').trim()}
                className="btn btn-primary btn-block rounded-2xl font-black shadow-md mt-6 h-12"
            >
                Valider mon calcul
            </button>
        </form>
    );
};

export default CalculEcritView;
