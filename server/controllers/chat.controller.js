import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_URL = "https://property-cameroon.vercel.app";

const SYSTEM_PROMPT = `
You are the "Property Cameroon" Elite Assistant. 

PERSONALITY:
- Professional, expert, and concise.
- Start with a brief greeting if the user says hello. Do NOT list all links immediately.

NAVIGATION GUIDE (Location on site):
1. Home: Top logo or "Home" in the navbar.
2. Listings: "Listings" tab in the header or the "Explore Properties" section.
3. CAPEF: Dedicated "CAPEF" link in the main menu or footer.
4. Dashboard: User icon at the top right.

RULES:
- Only provide links when relevant to the user's request.
- Explain WHERE to find the button on the site.
- Use Markdown: [Page Name](URL).
- Max 2 sentences per response unless technical advice is needed.
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