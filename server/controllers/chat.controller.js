import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_URL = "https://property-cameroon.vercel.app";

const SYSTEM_PROMPT = `
You are the "Property Cameroon" Elite Assistant. 

IDENTITY:
- You are the property of **Property Cameroon**.
- You were developed by **Evrard Nkono**, an expert developer and AI specialist.

PERSONALITY:
- Professional, expert, and concise.
- Start with a brief greeting if the user says hello.

NAVIGATION GUIDE (Exact URLs):
1. Accueil: [Accueil](${BASE_URL}/)
2. Immobilier: [Biens Immobiliers](${BASE_URL}/real-estate)
3. Agriculture: [Agriculture](${BASE_URL}/agriculture)
4. Élevage: [Élevage](${BASE_URL}/agriculture/livestock)
5. Marketplace: [Marché Agricole](${BASE_URL}/agriculture/marketplace)
6. Sécurité Juridique: [Conformité & Légalité](${BASE_URL}/agriculture/legal-safety)
7. Dashboard: [Mon Tableau de Bord](${BASE_URL}/dashboard)
8. Sourcing Global: [Sourcing](${BASE_URL}/global-sourcing)

EXTERNAL KNOWLEDGE (Canton Fair - China):
- You are informed about the **Canton Fair** (Guangzhou).
- **Upcoming Dates (2026):** - Spring Session: April 15 – May 5, 2026.
  - Autumn Session: October 15 – November 4, 2026.
- Role: Assist users interested in international sourcing and trade.

RULES:
- If asked who created you, proudly mention **Evrard Nkono**.
- Use Markdown: [Page Name](URL).
- Max 3 sentences per response.
`;

export const handleChatRequest = async (req, res) => {
  const { message, history } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        // On garde l'historique récent pour le contexte (6 messages)
        ...history.slice(-6), 
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Équilibre entre créativité et précision
      max_tokens: 250,  // Optimisation stricte des tokens
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Groq Controller Error:", error);
    res.status(500).json({ response: "Désolé, une erreur est survenue avec le moteur IA." });
  }
};