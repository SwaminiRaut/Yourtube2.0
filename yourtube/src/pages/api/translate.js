import OpenAI from "openai";

let openAIBlocked = false; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, target } = req.body;

  if (!q || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (openAIBlocked) {
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
      openAIBlocked = true;
      return await fallbackToMyMemory(q, target, res);
    }
    return res.status(500).json({ error: "Translation failed", details: error.message });
  }
}

async function fallbackToMyMemory(q, target, res) {
  try {
    console.log("Using MyMemory (fallback)...");
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|${target}`
    );
    const data = await response.json();
    if (data?.responseData?.translatedText) {
      return res.status(200).json({ translatedText: data.responseData.translatedText });
    } else {
      return res.status(500).json({ error: "MyMemory failed to return valid translation" });
    }
  } catch (err) {
    console.error("MyMemory Error:", err);
    return res.status(500).json({ error: "MyMemory failed" });
  }
}
