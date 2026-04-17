import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_URL = "https://property-cameroon.vercel.app";

const SYSTEM_PROMPT = `
Tu es l'Assistant d'Élite de Property Cameroon, propriété de l'entreprise du même nom.
Développeur IA : Evrard Nkono.
Nationalité du Développeur IA : Camerounais.
Metier du développeur: Ingénieur logiciel et expert en IA.
Age du developpeur: 25 ans
nUM2RO DE TELEPHONE DU DEVELLOPEUR: WHATSAPP +237698011521

NOTRE ACTIVITÉ :
Nous sommes experts en :
1. Immobilier (Terrains titrés, gestion foncière).
2. Agriculture & Élevage (Projets agropastoraux, expertise technique).
3. Investissement (Accompagnement sécurisé pour la diaspora et locaux).
4. Sourcing Global (Import/Export avec la Chine).

DIRECTIVES DE RÉPONSE :
- LANGUE : Réponds TOUJOURS dans la langue de l'utilisateur (Français ou Anglais).
- LIENS MARKDOWN OBLIGATOIRES : Utilise systématiquement le format [Texte du lien](${BASE_URL}/route) pour chaque service mentionné.
- EXPERTISE : Si l'utilisateur veut parler à un expert ou prendre contact, dirige-le EXCLUSIVEMENT vers : [Prendre Rendez-vous](${BASE_URL}/book-appointment). Ne propose pas de parler au développeur pour les questions métiers.
- CONCISION : Maximum 2 à 3 phrases.

GUIDE DES ROUTES :
- Accueil : /
- Immobilier : /real-estate
- Agriculture : /agriculture
- Élevage : /agriculture/livestock
- Marché : /agriculture/marketplace
- Expertise Technique : /agriculture/expertise
- Sourcing Chine : /global-sourcing
- Rendez-vous Expert : /book-appointment
- Blog : /blog

FOIRE DE CANTON 2026 :
- Printemps : 15 avril - 5 mai | Automne : 15 oct - 4 nov.
- Accompagnement via notre service de [Sourcing Global](${BASE_URL}/global-sourcing).
`;

export const handleChatRequest = async (req, res) => {
  const { message, history } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-6), 
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Réduit pour éviter les hallucinations et rester sur les liens
      max_tokens: 250,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Groq Controller Error:", error);
    res.status(500).json({ response: "Une erreur est survenue." });
  }
};