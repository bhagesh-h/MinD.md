import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function processMarkdownWithAI(content: string, instruction: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
    You are an AI Markdown assistant for 'MinD.md'.
    Task: ${instruction}
    
    Current Markdown Content:
    ---
    ${content}
    ---
    
    Instruction specifics:
    - Return ONLY the updated markdown or requested output.
    - Preserve formatting where appropriate.
    - If summarizing, be concise and professional.
  `});

  return response.text || "";
}

export async function generateOutline(content: string): Promise<string> {
  return processMarkdownWithAI(content, "Generate a detailed outline for this markdown document.");
}

export async function summarizeNote(content: string): Promise<string> {
  return processMarkdownWithAI(content, "Provide a concise summary of this note.");
}
