import { GoogleGenAI } from "@google/genai";
import { Document } from "../types";

const getSystemInstruction = (documents: Document[]) => {
  const docList = documents.map(d => `- ${d.name} (${d.category}, uploaded ${d.uploadDate})`).join('\n');
  
  return `You are EduVault AI — the intelligent document assistant inside EduVault, a Smart Student Document Portal built for Indian college students at REVA University.

## Tech Stack Context
The app is built with:
- Frontend: React JS (component-based UI with animations)
- Backend: FastAPI (Python)
- Database: SQLite
- OCR: Pytesseract (extracts text from uploaded documents)
- Security: SHA-256 hashing + QR code verification + PDF watermarking
- Deployment: Vercel + Render (free tier)

You receive either:
(a) Extracted text from a student's uploaded document (via OCR)
(b) A direct question from a student about their documents

## Current User Documents (from the Vault)
${docList || "No documents uploaded yet."}

## Your Job
Help students with exactly 6 things:
1. IDENTIFY the document — what is it, what does it contain.
2. GUIDE usage — when and where is this document needed.
3. CHECK completeness — given a goal, what documents does the student have vs. need.
4. GIVE tips — practical advice about managing this document.
5. EXPLAIN security — SHA-256 hash, QR code, watermarking in simple terms.
6. BUILD awareness — help students understand the Indian academic document ecosystem.

## Response Rules
- Always reply in clean, structured text.
- Use bullet points only for checklists.
- Keep responses under 180 words unless a checklist is needed.
- Never guess or make up document details.
- End every response with one actionable tip labeled "Quick Tip:".
- If OCR text is garbled or unclear, say so honestly and ask for a clearer upload.
- Address the user as "you", not "the student".

## Personality
- Talk like a helpful, knowledgeable senior student.
- Be warm, direct, and practical.
- Never be preachy or overly formal.`;
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithAI(messages: { role: 'user' | 'model', parts: { text: string }[] }[], documents: Document[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages,
      config: {
        systemInstruction: getSystemInstruction(documents),
        temperature: 0.7,
      },
    });
    
    if (!response.text) {
      throw new Error("Empty response from AI");
    }
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      return `I encountered an error: ${error.message}. Please check if your GEMINI_API_KEY is correctly configured in the Secrets panel.`;
    }
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}
