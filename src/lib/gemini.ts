import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getGeminiContent(prompt: string, cacheKey: string) {
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached).value;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  sessionStorage.setItem(cacheKey, JSON.stringify({ value: text, expiry: Date.now() + 3600000 }));
  return text;
}