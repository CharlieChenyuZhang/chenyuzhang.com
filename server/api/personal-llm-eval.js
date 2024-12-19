const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/tutor", async (req, res) => {
  const { conversations } = req.body;

  if (!Array.isArray(conversations)) {
    return res
      .status(400)
      .send({ error: "Conversations must be a non-empty array" });
  }

  const lastFiveConversations = conversations.slice(-5);

  try {
    const reliefTutorResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              Act as a tutor and I am your student. Your only task is to answer my questions related to Python Syntext.
              If I ask anything other than Python syntax, kindly say you cannot answer. 
              Please refuse answer any question related to time complexity or big-O notations. 
              Keep your answer short and concise. 
            `,
          },
          ...lastFiveConversations.map((conversation) => ({
            role: conversation.isUser ? "user" : "assistant",
            content: conversation.text ?? "",
          })),
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = reliefTutorResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error with Relief Tutor: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error with Relief Tutor" });
  }
});

module.exports = router;
