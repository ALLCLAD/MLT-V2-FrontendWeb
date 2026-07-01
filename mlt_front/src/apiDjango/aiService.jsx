import Groq from "groq-sdk";

// Configuration de l'instance Groq
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

/**
 * UTILITAIRE : Calcule le nombre d'exercices requis selon le niveau scolaire
 */
const getNombreExercicesParClasse = (classe) => {
    const c = classe.toUpperCase();
    if (c.includes("CP")) return 5;
    if (c.includes("CE")) return 10;
    if (c.includes("CM")) return 15;
    return 5;
};

// --- FONCTIONS EXPORTÉES ---

/**
 * FONCTION 1 : Feedback ludique (Mathy)
 */
export const getMathyFeedback = async (question, reponseUtilisateur, isCorrect, explicationBack) => {
    const isHintMode = reponseUtilisateur === "DEMANDE_INDICE";

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es Mathy, un tuteur IA chaleureux pour un enfant du primaire au Togo.
                    Ton ton : Très joyeux, motivant. Tu t'adresses directement à l'enfant par "tu".
                    REGLES :
                    1. MODE INDICE : Donne une piste imagée (bonbons, jouets) sans donner la réponse (1 phrase maximum).
                    2. MODE FEEDBACK : Style Duolingo (très court et direct, max 10 mots). Si correct, félicite chaleureusement. Si incorrect, encourage positivement et donne un tout petit conseil simple (pas de longue explication).
                    3. Format : 1 seule phrase très courte + emojis.`
                },
                {
                    role: "user",
                    content: isHintMode
                        ? `AIDE-MOI : Question "${question}". Explication "${explicationBack}". Indice ludique.`
                        : `RESULTAT : Question: "${question}" | Réponse: "${reponseUtilisateur}" | Correct: ${isCorrect ? 'OUI' : 'NON'}.`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_tokens: 150,
        });

        return completion.choices[0]?.message?.content;
    } catch (error) {
        console.error("Erreur Groq feedback:", error);
        return "Continue comme ça, tu deviens de plus en plus fort ! 💪";
    }
};

/**
 * FONCTION 2 : Génération du cours complet (Version courte & Structurée)
 */
export const genererContenuLecon = async (titre, description, classe) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es Mathy, un tuteur expert pour un enfant (niveau ${classe}) au Togo.
                    
                    OBJECTIF : Générer une leçon courte (150 à 200 mots maximum).
                    
                    STYLE DE RÉDACTION :
                    - Parle directement à l'enfant ("Tu").
                    - Pas de phrases trop longues (facile à lire et à écouter).
                    - Utilise des exemples togolais (marché, francs CFA, prénoms locaux).

                    STRUCTURE OBLIGATOIRE (Titres en chiffres romains) :
                    ## 1. Introduction
                    (Une phrase d'accroche joyeuse)
                    
                    ## 2. Le concept
                    (Explication simplifiée du sujet en 2-3 phrases)
                    
                    ## 3. Exemples pour comprendre
                    (Maximum 2 exemples courts avec des listes à puces)
                    
                    ## 4. À retenir
                    (Les 2 points les plus importants)

                    FORMATAGE :
                    - Utilise le Markdown (## pour les titres, ** pour les mots importants).
                    - Évite les émojis complexes, garde uniquement les plus simples (🎉, 📝, 💡).
                    - Saute deux lignes entre les sections.`
                },
                {
                    role: "user",
                    content: `Écris une leçon courte (max 250 mots) pour moi. Titre : "${titre}". Description : "${description}".`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 600, // Limite les tokens pour forcer la concision
        });

        return completion.choices[0]?.message?.content;
    } catch (error) {
        console.error("Erreur Groq génération leçon:", error);
        return null;
    }
};

/**
 * FONCTION 2b : Reformatage et amélioration d'un contenu de document importé (PDF/Word)
 * Prend le texte brut extrait du document et le reformate en Markdown pédagogique
 */
export const genererContenuLeconDepuisDocument = async (titre, classe, documentText, consignes = '') => {
    try {
        // Limiter le texte extrait à 4000 caractères pour ne pas dépasser les tokens
        const texteLimité = documentText.substring(0, 4000);

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es Mathy, un tuteur expert pour la classe ${classe} au Togo.
                    
                    MISSION : Tu reçois un contenu brut extrait d'un document (PDF ou Word) fourni par un enseignant.
                    Tu dois :
                    1. Extraire les informations essentielles de ce contenu.
                    2. Améliorer le style : rendre le texte clair, engageant et adapté aux enfants.
                    3. Ajouter des exemples togolais concrets si possible (marché, francs CFA, prénoms).
                    4. Structurer proprement en Markdown selon ce format :

                    ## 1. Introduction
                    (Phrase d'accroche)

                    ## 2. Le concept
                    (Explication simplifiée, 2-4 phrases max)

                    ## 3. Exemples pour comprendre
                    (1-2 exemples concrets avec listes à puces)

                    ## 4. À retenir
                    (2-3 points clés)

                    CONTRAINTES :
                    - Maximum 300 mots.
                    - Parle directement à l'enfant avec "tu".
                    - Garde uniquement les émojis simples (🎉, 💡, 📝).`
                },
                {
                    role: "user",
                    content: `Titre de la leçon : "${titre}"
Niveau : ${classe}
${consignes ? `Consignes de l'enseignant : ${consignes}\n` : ''}Contenu brut du document :
---
${texteLimité}
---
Réécris ce contenu en Markdown pédagogique clair.`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 700,
        });

        return completion.choices[0]?.message?.content;
    } catch (error) {
        console.error("Erreur Groq reformatage document:", error);
        return null;
    }
};

/**
 * FONCTION 3 : Génération dynamique d'exercices (JSON)
 * OPTIMISÉE POUR LA VOIX MATHY
 */
export const genererExercices = async (titre, classe, contenu) => {
    const nbExercices = getNombreExercicesParClasse(classe);

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es un expert en pédagogie primaire au Togo. 
                    Génère exactement ${nbExercices} exercices au format JSON.

                    RÈGLES DE RÉDACTION POUR LA VOIX (CRITIQUE) :
                    1. LONGUEUR : La question doit faire entre 50 et 100 caractères maximum.
                    2. STRUCTURE : Fais des phrases courtes. Utilise des points (.) pour créer des pauses.
                    3. MATHÉMATIQUES : Écris les calculs simplement (ex: 12 + 5 ou 4 x 3). 
                    4. STYLE : Utilise des prénoms (Koffi, Ablavi) et des contextes locaux (marché, francs CFA).
                    5. EXPLICATION : Doit être très courte (max 80 caractères) et commencer par "C'est simple !".

                    FORMAT JSON STRICT :
                    [
                        {
                            "question": "Texte court. Ponctuation claire.",
                            "reponse_correcte": "La réponse",
                            "mauvaises_reponses": "r1, r2, r3",
                            "explication": "C'est simple ! On ajoute les pommes.",
                            "ordre": 1
                        }
                    ]`
                },
                {
                    role: "user",
                    content: `Niveau ${classe}. Thème : "${titre}". Contenu : "${contenu?.substring(0, 500)}".`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 3800,
        });

        const responseText = completion.choices[0]?.message?.content;
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error("Erreur Groq génération exercices:", error);
        return null;
    }
};

/**
 * FONCTION 4 : Complétion d'un exercice manuel
 * OPTIMISÉE POUR LA CONCISION
 */
export const genererReponseExercice = async (question, classe) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Expert math primaire. 
                    Génère une réponse, 3 erreurs possibles et une explication très courte.
                    CONSIGNE VOCALE : L'explication ne doit pas dépasser 100 caractères.`
                },
                {
                    role: "user",
                    content: `Question: "${question}" | Niveau: ${classe}. Format JSON: {"reponse_correcte": "", "mauvaises_reponses": "r1, r2, r3", "explication": ""}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 400,
        });

        const responseText = completion.choices[0]?.message?.content;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error("Erreur Groq génération réponse:", error);
        return null;
    }
};