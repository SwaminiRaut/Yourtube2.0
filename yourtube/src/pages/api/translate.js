// /src/pages/api/translate.js
import OpenAI from "openai";

let openAIBlocked = false; // ✅ store flag

// ✅ initialize OpenAI client once
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { q, target } = req.body;

  if (!q || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (openAIBlocked) {
    // ✅ directly use MyMemory if we already know OpenAI is blocked
    return await fallbackToMyMemory(q, target, res);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Translate this text to ${target}. Return only the translation.` },
        { role: "user", content: q },
      ],
    });

    const translatedText = completion.choices[0].message.content.trim();
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error("OpenAI Translation Error:", error);
    if (error.code === "insufficient_quota" || error.status === 429) {
      openAIBlocked = true; // ✅ don’t retry next time
      return await fallbackToMyMemory(q, target, res);
    }
    return res.status(500).json({ error: "Translation failed", details: error.message });
  }
}

async function fallbackToMyMemory(q, target, res) {
  try {
    console.log("⚠️ Using MyMemory (direct)...");
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|${target}`
    );
    const data = await response.json();
    return res.status(200).json({ translatedText: data.responseData.translatedText });
  } catch (err) {
    console.error("MyMemory Error:", err);
    return res.status(500).json({ error: "MyMemory failed" });
  }
}
