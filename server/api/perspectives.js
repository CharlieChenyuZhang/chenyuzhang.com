const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your environment variables
});

router.post("/generate", async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: "Scenario is required" });
    }

    const prompt = `Given this scenario: "${scenario}"

Please analyze this situation from 4 different perspectives. For each perspective:
1. Give it a clear, descriptive name
2. Provide a thoughtful analysis from that viewpoint
3. Keep each perspective's analysis concise but insightful

Format the response as a JSON array with objects containing 'name' and 'perspective' fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing situations from multiple perspectives. You always provide balanced, thoughtful viewpoints that help people understand different sides of a situation. Always format your response as a valid JSON object with a 'perspectives' array containing objects with 'name' and 'perspective' fields.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Parse the JSON response
    const response = JSON.parse(completion.choices[0].message.content);

    // Ensure the response has the expected structure
    if (!response.perspectives || !Array.isArray(response.perspectives)) {
      throw new Error("Invalid response format from OpenAI");
    }

    res.json({ perspectives: response.perspectives });
  } catch (error) {
    console.error("Error generating perspectives:", error);
    res.status(500).json({
      error: "Failed to generate perspectives",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.post("/debate", async (req, res) => {
  try {
    const { perspectives, chatHistory, currentPerspectiveName, scenario } =
      req.body;

    if (!perspectives || !chatHistory || !currentPerspectiveName || !scenario) {
      return res
        .status(400)
        .json({ error: "Missing required fields for debate." });
    }

    const currentPerspective = perspectives.find(
      (p) => p.name === currentPerspectiveName
    );
    if (!currentPerspective) {
      return res.status(404).json({ error: "Current perspective not found." });
    }

    const formattedHistory = chatHistory
      .map((entry) => `${entry.author}: ${entry.message}`)
      .join("\n");

    const prompt = `
      You are an AI agent in a debate.
      The overall scenario is: "${scenario}"
      Your assigned perspective is "${currentPerspective.name}": "${currentPerspective.perspective}"

      Here is the conversation history:
      ${formattedHistory}

      Based on the history and your assigned perspective, what is your next argument?
      Keep it concise and impactful (1-2 sentences).

      Format the response as a JSON object with a single key "argument".
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a participant in a debate, arguing from a specific viewpoint. Provide a concise, relevant argument in JSON format with an 'argument' key.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const responseContent = completion.choices[0].message.content;
    const response = JSON.parse(responseContent);

    if (!response.argument) {
      throw new Error(
        "Invalid response format from OpenAI, 'argument' field is missing."
      );
    }

    res.json({ argument: response.argument });
  } catch (error) {
    console.error("Error generating debate argument:", error);
    res.status(500).json({
      error: "Failed to generate debate argument",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
