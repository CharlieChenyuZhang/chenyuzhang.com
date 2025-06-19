const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper for OpenAI chat completion
async function gptChat(messages, model = "gpt-4") {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model,
      messages,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}

// 1. Kid-Friendly Definition
router.post("/define", async (req, res) => {
  const { word, language = "en", feedback } = req.body;
  try {
    let prompt = `Explain the word "${word}" in a simple, kid-friendly way for a grade 3 student. Use very basic vocabulary.`;
    if (feedback === "not understood") {
      prompt = `Rephrase the definition of "${word}" in an even simpler way for a young child.`;
    }
    const definition = await gptChat([
      {
        role: "system",
        content: "You are a helpful elementary school teacher.",
      },
      { role: "user", content: prompt },
    ]);
    res.json({ word, definition });
  } catch (e) {
    res.status(500).json({ error: "Failed to get definition." });
  }
});

// 2. Use in a Sentence
router.post("/sentence", async (req, res) => {
  const { word, context = "fun" } = req.body;
  try {
    const prompt = `Use the word "${word}" in a sentence for a child. Make it ${context} (e.g., about animals, school, or food).`;
    const sentence = await gptChat([
      { role: "system", content: "You are a creative teacher." },
      { role: "user", content: prompt },
    ]);
    res.json({ word, sentence });
  } catch (e) {
    res.status(500).json({ error: "Failed to get sentence." });
  }
});

// 3. Visualize the Word (emoji + DALL-E prompt)
router.post("/visualize", async (req, res) => {
  const { word } = req.body;
  try {
    // Emoji via GPT
    const emojiPrompt = `Give me a single emoji that best represents the word "${word}" for a child.`;
    const emoji = await gptChat([
      { role: "system", content: "You are an emoji expert." },
      { role: "user", content: emojiPrompt },
    ]);
    // DALL-E prompt
    const dallePrompt = `A simple, colorful illustration of "${word}" for a child, cartoon style.`;
    // Optionally call DALL-E API here and return image URL
    // For now, return a dummy image
    const imageUrl = `https://dummyimage.com/200x200/eee/333&text=${encodeURIComponent(
      word
    )}`;
    res.json({ word, imageUrl, emoji });
  } catch (e) {
    res.status(500).json({ error: "Failed to visualize word." });
  }
});

// 4. Translate
router.post("/translate", async (req, res) => {
  const { word, targetLanguage = "zh" } = req.body;
  try {
    // Always use OpenAI for translation
    const translation = await gptChat([
      { role: "system", content: "You are a translation expert." },
      {
        role: "user",
        content: `Translate the word "${word}" into ${targetLanguage}. Only return the translated word.`,
      },
    ]);
    res.json({ word, translation });
  } catch (e) {
    res.status(500).json({ error: "Failed to translate." });
  }
});

// 5. Quiz Me
router.post("/quiz", async (req, res) => {
  const { word } = req.body;
  try {
    const prompt = `Create a multiple-choice question for the word "${word}" for a child. Give 1 correct answer and 3 fun, plausible wrong answers. Return as JSON: {question, options, answer}`;
    const quizRaw = await gptChat([
      { role: "system", content: "You are a quiz master for kids." },
      { role: "user", content: prompt },
    ]);
    // Try to parse JSON from GPT
    let quiz;
    try {
      quiz = JSON.parse(quizRaw);
    } catch {
      quiz = {
        question: `What does '${word}' mean?`,
        options: [quizRaw],
        answer: 0,
      };
    }
    res.json({ word, quiz });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

// 6. Fun Fact or Story
router.post("/fun-fact", async (req, res) => {
  const { word } = req.body;
  try {
    const prompt = `Tell a short, fun fact or story about the word "${word}" for a child.`;
    const fact = await gptChat([
      { role: "system", content: "You are a fun storyteller." },
      { role: "user", content: prompt },
    ]);
    res.json({ word, fact });
  } catch (e) {
    res.status(500).json({ error: "Failed to get fun fact." });
  }
});

// 7. My Turn to Speak (placeholder for speech recognition)
router.post("/speak", async (req, res) => {
  const { word, audio } = req.body;
  // TODO: Integrate with speech recognition API for pronunciation feedback
  res.json({ word, feedback: "Great job! (Speech recognition coming soon)" });
});

// 8. Word Family
router.post("/family", async (req, res) => {
  const { word } = req.body;
  try {
    const prompt = `List the root, related words, synonyms, antonyms, and forms (tense, plural, etc.) for the word "${word}". Return as JSON: {root, related, synonyms, antonyms, forms}`;
    const familyRaw = await gptChat([
      { role: "system", content: "You are a vocabulary expert." },
      { role: "user", content: prompt },
    ]);
    let family;
    try {
      family = JSON.parse(familyRaw);
    } catch {
      family = {
        root: word,
        related: [],
        synonyms: [],
        antonyms: [],
        forms: [],
      };
    }
    res.json({ word, ...family });
  } catch (e) {
    res.status(500).json({ error: "Failed to get word family." });
  }
});

// 9. Context Challenge
router.post("/context-challenge", async (req, res) => {
  const { word } = req.body;
  try {
    const prompt = `Create a fill-in-the-blank sentence (cloze) using the word "${word}" for a child. Give a hint. Return as JSON: {sentence, hint}`;
    const challengeRaw = await gptChat([
      { role: "system", content: "You are a creative teacher." },
      { role: "user", content: prompt },
    ]);
    let challenge;
    try {
      challenge = JSON.parse(challengeRaw);
    } catch {
      challenge = {
        sentence: `This is a ____ (fill in '${word}') sentence.`,
        hint: "Hint for the blank.",
      };
    }
    res.json({ word, ...challenge });
  } catch (e) {
    res.status(500).json({ error: "Failed to get context challenge." });
  }
});

module.exports = router;
