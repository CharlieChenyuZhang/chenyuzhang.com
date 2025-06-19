const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AWS = require("aws-sdk");
const app = express();
const matter = require("gray-matter");
const port = process.env.PORT || 8080;

// configure all the middlewares
app.use(cors()); // This will enable CORS for all routes
app.use(
  "/backend-assets",
  express.static(path.join(__dirname, "backend-assets"))
);

app.use(express.json()); // such that it can process json
require("dotenv").config(); // such that it can use .env file

app.get("/", (req, res) => {
  res.send({
    status: "healthy",
  });
});

// import all the other API endpoints
const reliefRoutes = require("./api/relief");
const llmEvalRoute = require("./api/personal-llm-eval");

// so that backend can serve images
// this can be used for FE to serve the media files, not for FE to render the media files in the .md content.
app.use("/server/images", express.static("./images"));

//////////////////// business logic goes after this line ////////////////////////////////////
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use("/relief", reliefRoutes);
app.use("/personal-llm-eval", llmEvalRoute);

app.get("/project/all", (req, res) => {
  const mdDirectory = path.join(__dirname, "projects"); // Adjust the path as necessary

  fs.readdir(mdDirectory, (err, files) => {
    if (err) {
      console.error("Error reading directory: ", err);
      return res.status(500).send({ error: "Error reading directory" });
    }

    let results = {};
    let filesProcessed = 0;

    files.forEach((file) => {
      const filePath = path.join(mdDirectory, file);
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          console.error("Error reading file: ", err);
          return res.status(500).send({ error: `Error reading file: ${file}` });
        }

        const parsed = matter(content);

        if (parsed?.data?.published) {
          results[file] = parsed;
        }

        filesProcessed++;
        if (filesProcessed === files.length) {
          res.send(results);
        }
      });
    });
  });
});

app.get("/project/:name", (req, res) => {
  const postName = req.params.name;
  const mdDirectory = path.join(__dirname, "projects"); // Adjust the path as necessary
  const filePath = path.join(mdDirectory, postName); // Assuming the files have '.md' extension

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      console.error("Error reading file: ", err);
      return res.status(500).send({ error: `Error reading file: ${postName}` });
    }

    const parsed = matter(content);

    if (parsed?.data?.published) {
      res.send(parsed);
    } else {
      res.status(404).send({ error: "Post not found or not published" });
    }
  });
});

app.get("/blog/all", (req, res) => {
  const mdDirectory = path.join(__dirname, "blogs"); // Adjust the path as necessary

  fs.readdir(mdDirectory, (err, files) => {
    if (err) {
      console.error("Error reading directory: ", err);
      return res.status(500).send({ error: "Error reading directory" });
    }

    let results = {};
    let filesProcessed = 0;

    files.forEach((file) => {
      const filePath = path.join(mdDirectory, file);
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          console.error("Error reading file: ", err);
          return res.status(500).send({ error: `Error reading file: ${file}` });
        }

        const parsed = matter(content);

        if (parsed?.data?.published) {
          results[file] = parsed;
        }

        filesProcessed++;
        if (filesProcessed === files.length) {
          res.send(results);
        }
      });
    });
  });
});

app.get("/blog/:name", (req, res) => {
  const postName = req.params.name;
  const mdDirectory = path.join(__dirname, "blogs"); // Adjust the path as necessary
  const filePath = path.join(mdDirectory, postName); // Assuming the files have '.md' extension

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      console.error("Error reading file: ", err);
      return res.status(500).send({ error: `Error reading file: ${postName}` });
    }

    const parsed = matter(content);

    if (parsed?.data?.published) {
      res.send(parsed);
    } else {
      res.status(404).send({ error: "Post not found or not published" });
    }
  });
});

app.post("/image", async (req, res) => {
  const { inputText, language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // Step 1: Call GPT-4 to generate a prompt
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Below are the tips:
              Basic DALLE3 Prompt Tips

1. Be Specific and Detailed: The more specific your prompt, the better the image quality. Include details like the setting, objects, colors, mood, and any specific elements you want in the image.
2. Mood and Atmosphere: Describe the mood or atmosphere you want to convey. Words like "serene," "chaotic," "mystical," or "futuristic" can guide the AI in setting the right tone.
3. Use Descriptive Adjectives: Adjectives help in refining the image. For example, instead of saying "a dog," say "a fluffy, small, brown dog."
4. Consider Perspective and Composition: Mention if you want a close-up, a wide shot, a bird's-eye view, or a specific angle. This helps in framing the scene correctly.
5. Specify Lighting and Time of Day: Lighting can dramatically change the mood of an image. Specify if it's day or night, sunny or cloudy, or if there's a specific light source like candlelight or neon lights.
6. Incorporate Action or Movement: If you want a dynamic image, describe actions or movements. For instance, "a cat jumping over a fence" is more dynamic than just "a cat."
7. Avoid Overloading the Prompt: While details are good, too many can confuse the AI. Try to strike a balance between being descriptive and being concise.
8. Use Analogies or Comparisons: Sometimes it helps to compare what you want with something well-known, like "in the style of Van Gogh" or "resembling a scene from a fantasy novel."
9. Specify Desired Styles or Themes: If you have a particular artistic style or theme in mind, mention it. For example, "cyberpunk," "art deco," or "minimalist."
10. Iterative Approach: Sometimes, you may not get the perfect image on the first try. Use the results to refine your prompt and try again.
11. use Fashion Drawing
 

Fashion drawings are primarily made by fashion designers and those in the clothing industry. The fashion drawing style showcases dresses, shoes, handbags, accessories, and other garments on the human body. Since this art style involves drawing wearables on some form of a person's physique, practicing figure drawing might come in handy. Figure drawing focuses on drawing the human body.


"""

Follow the tips above, please convert the following text into a detailed prompt for DALL-E image generation. The prompts would include key words only. Keep the prompt short and concise.\n\nAnswer it using the specified language: ${language}\n\n"""
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imgPrompt = gptResponse.data.choices[0].message.content.trim();

    // Step 2: Call DALL-E 3 to generate an image
    const dalleResponse = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: "An ink sketch of a " + imgPrompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // step 3: embodiment generation

    const embodimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Act as a positive psychologist and a yogi, your task is to generate some meditation instructions to help me embody the image. 
              Keep it short and concise.\n\nAnswer it using the specified language: ${language}\n\nThis is the description of the image.\n\n${imgPrompt}\n\n"""
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embodimentResponseMsg =
      embodimentResponse.data.choices[0].message.content.trim();

    const imageUrl = dalleResponse.data.data[0].url;

    res.send({
      prompt: imgPrompt,
      embodimentResponseMsg: embodimentResponseMsg,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error(
      "Error generating image: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error generating image" });
  }
});

app.post("/sentiment", async (req, res) => {
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // Call GPT-4 for sentiment analysis and to generate a list of emotions
    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Analyze the following text for sentiment and provide a list of emotions associated with it.
              Return the emotions as a concise list without additional explanation.
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const emotions = sentimentResponse.data.choices[0].message.content.trim();

    res.send({
      emotions: emotions,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/tutor", async (req, res) => {
  const { inputText, language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // TODO: could have fed with the conversation history
    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Act as my assistant and my smart journal. Your task is to help me with whatever tasks I am stuck on.\n\nAnswer it using the specified language: ${language}
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = sentimentResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/better-together-tutor", async (req, res) => {
  const { inputText, conversation = [], language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // Convert conversation history to GPT messages format
    const conversationMessages = conversation.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    }));

    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Act as an experienced self-compassion coach or guide.\n\nAnswer it using the specified language: ${language}\n\nYou lovingly and thoughtfully provide insight into what is missing (such that when they are alerted to it by you they become aware of openings for new actions they can take to make impactful and lasting changes in their life) together with life-sized and approachable steps for gradual change and you do this consistently across time to support users in achieving their goals for their holistic health.\n\nAlways work from the guidelines for Universal Design for Learning (UDL) when producing and providing examples, options, and simulations.\n\nUse backwards learning models when breaking down information and ideas into steps and lessons.\n\nDraw on existing research in neuroscience, metacognition, motivation, cognitive load, and learning science to speak, teach, and co-learn in ways that honor how people learn, what is feasible for a brain to process, and how the human brain works to create thoughts, build knowledge, and hone understanding over time.\n\nEngage in culturally relevant and culturally sustaining teaching.\n\nSupport and encourage a growth mindset.\n\nCultivate psychological safety in the experience of sharing information with you.\n\nUse your knowledge of learning theories and frameworks to build appropriate learning plans before walking the user through them.\n\nAlways foster intrinsic motivation and self-efficacy.\n\nSupport cognitive processing by being mindful of cognitive load.\n\nDevelop, regularly update, and maintain an effective learner persona of the user.\n\nListen for causes of variance in your user's learner performance and be mindful of it when producing responses.\n\nUse thinking routines to make thinking visible using "The Power of Visible Thinking Book".\n\nEngage "Thinking Routines" from Project Zero's website and ideas from "Slow Looking"when constructing learning experiences.\n\nYou are talking to people for whom barriers exist in the environment to their ability to access, process, retain, and make use of new informations and learnings.\n\nThey may have a disability, neurodivergence, or learning differences that are important to accommodate with the support of the Universal Design for Learning Framework.\n\nYour Workflow\n\nStep 1\n\nFirst, warmly welcome users to the conversation. Say something like "Let's work together on generating lifelong holistic health and wellbeing. What is a challenge or goal that you would like to work on in the realm of your health? Feel free to think of health holistically. You may enter your responses as audio or text."\n\nStep 2\n\nIf they reply that they would like to continue to work on existing issues discuss the foundations of self-compassion with them and incorporate elements of the lesson plans on "foundations of self-compassion"\n\nELSE\n\nIf they have new challenges to discuss then listen compassionately to their new challenges, demonstrate your understanding of how and why they are challenged by it based on what they have shared about themselves, and invite them to participate in an exercise of thinking through their challenge.\n\nStep 3\n\nIf discussing new challenges walk them in a stepwise fashion through these questions: "what has happened?", "what might you have liked to happen?", "what do you wish you'd done differently?", "what would be supportive of your goals for yourself if you did it instead?", "how might you act differently in the future?", "what support do you need to do so?" then collect their responses and provide information about the difference doing so might have for their future all while drawing on their existing funds of knowledge, abilities, and skills throughout these processes\n\nELSE\n\nIf continuing with existing learning walk them through an exercise to explore their thinking patterns around self-compassion and learn more about their view of self and then give them opportunities to try on, practice, and engage with new behaviors and thinking routines that empower them to achieve their goals.\n\nStep 4\n\nNext, offer to generate simulations of scenarios that allow them to practice new ways of being. Generate them if they say "yes".\n\nStep 5\n\nFinally, or if they say "no", reflect back to them their progress and embed it into a visible timeline of where they have started in their journey, what they have accomplished across time, and where they are headed with continued engagement with you. Remind them that you are always available to continue the conversation and that you are an enduring partner in their growth towards [insert details of what you know about who and how they want to be being].\n\nGuidelines & Guardrails\n\nAvoid language that might seem judgmental or dismissive.\n\nBe inclusive in your examples and explanations, consider multiple perspectives, and avoid stereotypes.\n\nProvide clear, compassionate, and concise responses.\n\nIf off-topic, respond to what is input but encourage users to return to the main subject by incorporating kind reminders of their goals and what you intend to accomplish with them by focusing on them together.\n\nIMPORTANT:\n\n- keep your reply short and concise within 2 to 3 sentences.\n\n- ask one question at a time.
            `,
          },
          ...conversationMessages,
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = sentimentResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/t543-tutor", async (req, res) => {
  const { inputText, conversation = [], language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // Convert conversation history to GPT messages format
    const conversationMessages = conversation.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    }));

    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Act as an expert learning coach.\n\nAnswer it using the specified language: ${language}\n\nYou support adult learners in high-cognitive-demand fields by helping them build metacognitive skills to manage, filter, and reflect on fast-moving information.\n\nYour tone is supportive, professional, and inquisitive.\n\nUse research-backed strategies from learning sciences (e.g., Teaching for Understanding, cognitive load theory, problem-based learning) to encourage critical thinking and conceptual transfer.\n\nAsk reflective questions, scaffold problem-solving, and never provide direct answers unless explicitly asked.\n\nHelp learners articulate their reasoning, evaluate sources, and apply frameworks to their own contexts.\n\nYour responses should foster learner agency, emotional resilience, and practical relevance in a global, digital learning environment.\n\nIMPORTANT:\n\n- keep your reply short and concise within 2 to 3 sentences.\n\n- ask one question at a time.
            `,
          },
          ...conversationMessages,
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = sentimentResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/reframe", async (req, res) => {
  // Accept both legacy and new payloads
  const { inputText, language: reqLanguage, conversations, user_id } = req.body;
  const language = reqLanguage || "en";

  // If using new payload, require conversations and user_id
  if (conversations && user_id) {
    // Only use the last 5 conversations for context
    const lastFiveConversations = conversations.slice(-5);
    try {
      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Act as a positive psychologist, your task is to help me reframe the negative thoughts.\n\nAnswer it using the specified language: ${language}\n\nUse the following pattern\n\n"""\n\nReframe:`,
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

      const response = apiResponse.data.choices[0].message.content.trim();
      console.log("!!! response", response);

      // DynamoDB logic (pattern from relief.js)
      const AWS = require("aws-sdk");
      AWS.config.update({
        region: "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const dynamoDb = new AWS.DynamoDB.DocumentClient();

      // Retrieve existing conversations from DynamoDB
      const getParams = {
        TableName: "glowingstar-journaling",
        Key: { user_id, event: "TRACK_REFRAME_CONVERSATION" },
      };
      const existingData = await dynamoDb.get(getParams).promise();

      // Add the latest user and AI messages to the conversation log
      const lastConversation = conversations.slice(-1)[0] || {};
      const newConversations = [
        {
          timestamp: new Date().toISOString(),
          isUser: lastConversation.isUser ?? true,
          text: lastConversation.text ?? "",
        },
        {
          timestamp: new Date().toISOString(),
          isUser: false,
          text: response,
        },
      ];
      const updatedConversations = [
        ...(existingData?.Item?.conversations || []),
        ...newConversations,
      ];

      // Store the updated conversation in DynamoDB for this user/event
      const putParams = {
        TableName: "glowingstar-journaling",
        Item: {
          user_id,
          event: "TRACK_REFRAME_CONVERSATION",
          conversations: updatedConversations,
          aiResponse: response,
        },
      };
      await dynamoDb.put(putParams).promise();

      res.send({
        response: response,
      });
    } catch (error) {
      console.error(
        "Error performing reframing and storing conversation: ",
        error.response?.data || error.message
      );
      res.status(500).send({ error: "Error performing reframing" });
    }
    return;
  }

  // Legacy: fallback to old inputText only
  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // TODO: could have fed with the conversation history
    const apiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `\n              Act as a positive psychologist, your task is to help me reframe the negative thoughts.\n\nAnswer it using the specified language: ${language}\n\nUse the following pattern\n\n"""\n\nReframe: \n            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = apiResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/support", async (req, res) => {
  const { inputText, language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // TODO: could have fed with the conversation history
    const apiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              Act as a emotion supporter, use casual text style and emojis and interjection (e.g. Awwww) you are going to show your excitment and provide emotional values to the user's input. Make it short like in a text message, at the end, ask me a follow up question (focus on the emotion only). \n\nAnswer it using the specified language: ${language}\n\n
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = apiResponse.data.choices[0].message.content.trim();

    res.send({
      response: response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.post("/mental-model", async (req, res) => {
  const { inputText, language: reqLanguage } = req.body;
  const language = reqLanguage || "en";

  if (!inputText) {
    return res.status(400).send({ error: "No input text provided" });
  }

  try {
    // Call GPT-4 for sentiment analysis and to generate a list of emotions
    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
            Mental models are cognitive frameworks that simplify complex concepts and help us interpret, analyze, and navigate the world around us. ...
            Act as an expert in mental modeling.\n\nAnswer it using the specified language: ${language}\n\nTask: ${inputText}\n\nPlease format your response as follows:\n\nRecommended mental model: XXX\n\nWhat it is:\nXXX\n\nMental model analysis for your task:\nXXX
            `,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = sentimentResponse.data.choices[0].message.content.trim();

    res.send({
      response,
    });
  } catch (error) {
    console.error(
      "Error performing sentiment analysis: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing sentiment analysis" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
