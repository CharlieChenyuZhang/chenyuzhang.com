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

module.exports = router;
