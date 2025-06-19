const express = require("express");
const router = express.Router();

// Placeholder: In production, connect to LLMs, translation APIs, image generation, etc.

// 1. Kid-Friendly Definition
router.post("/define", async (req, res) => {
  const { word, language, feedback } = req.body;
  // TODO: Integrate with LLM for kid-friendly definition, rephrase if feedback is 'not understood'
  res.json({
    word,
    definition: `A simple, kid-friendly definition of '${word}'.`,
    rephrased:
      feedback === "not understood"
        ? `A rephrased definition of '${word}'.`
        : undefined,
  });
});

// 2. Use in a Sentence
router.post("/sentence", async (req, res) => {
  const { word, context } = req.body;
  // TODO: Integrate with LLM for sentence generation
  res.json({
    word,
    sentence: `A ${context || "fun"} sentence using '${word}'.`,
  });
});

// 3. Visualize the Word
router.post("/visualize", async (req, res) => {
  const { word } = req.body;
  // TODO: Integrate with emoji/illustration/AI image API
  res.json({
    word,
    imageUrl: `https://dummyimage.com/200x200/eee/333&text=${encodeURIComponent(
      word
    )}`,
    emoji: "🎨",
  });
});

// 4. Translate
router.post("/translate", async (req, res) => {
  const { word, targetLanguage } = req.body;
  // TODO: Integrate with translation API
  res.json({
    word,
    translation: `Translation of '${word}' in ${targetLanguage || "Chinese"}`,
  });
});

// 5. Quiz Me
router.post("/quiz", async (req, res) => {
  const { word } = req.body;
  // TODO: Generate quiz (multiple choice, drag-and-drop, etc.)
  res.json({
    word,
    quiz: {
      question: `What does '${word}' mean?`,
      options: [
        `Correct meaning of '${word}'`,
        "Wrong option 1",
        "Wrong option 2",
        "Wrong option 3",
      ],
      answer: 0,
    },
  });
});

// 6. Fun Fact or Story
router.post("/fun-fact", async (req, res) => {
  const { word } = req.body;
  // TODO: Integrate with LLM for fun fact or story
  res.json({
    word,
    fact: `A fun fact or story about '${word}'.`,
  });
});

// 7. My Turn to Speak
router.post("/speak", async (req, res) => {
  const { word, audio } = req.body;
  // TODO: Integrate with speech recognition for pronunciation feedback
  res.json({
    word,
    feedback: "Great job! Your pronunciation is clear.",
  });
});

// 8. Word Family
router.post("/family", async (req, res) => {
  const { word } = req.body;
  // TODO: Integrate with LLM or dictionary API for word family
  res.json({
    word,
    root: word,
    related: ["related1", "related2"],
    synonyms: ["synonym1", "synonym2"],
    antonyms: ["antonym1", "antonym2"],
    forms: ["form1", "form2"],
  });
});

// 9. Context Challenge
router.post("/context-challenge", async (req, res) => {
  const { word } = req.body;
  // TODO: Generate cloze (fill-in-the-blank) challenge
  res.json({
    word,
    sentence: `This is a ____ (fill in '${word}') sentence.`,
    hint: "Hint for the blank.",
  });
});

module.exports = router;
