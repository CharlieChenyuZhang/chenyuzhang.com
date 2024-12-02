const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
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

// business logic goes after this line
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
  const { inputText } = req.body;

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
2. Mood and Atmosphere: Describe the mood or atmosphere you want to convey. Words like “serene,” “chaotic,” “mystical,” or “futuristic” can guide the AI in setting the right tone.
3. Use Descriptive Adjectives: Adjectives help in refining the image. For example, instead of saying “a dog,” say “a fluffy, small, brown dog.”
4. Consider Perspective and Composition: Mention if you want a close-up, a wide shot, a bird’s-eye view, or a specific angle. This helps in framing the scene correctly.
5. Specify Lighting and Time of Day: Lighting can dramatically change the mood of an image. Specify if it’s day or night, sunny or cloudy, or if there’s a specific light source like candlelight or neon lights.
6. Incorporate Action or Movement: If you want a dynamic image, describe actions or movements. For instance, “a cat jumping over a fence” is more dynamic than just “a cat.”
7. Avoid Overloading the Prompt: While details are good, too many can confuse the AI. Try to strike a balance between being descriptive and being concise.
8. Use Analogies or Comparisons: Sometimes it helps to compare what you want with something well-known, like “in the style of Van Gogh” or “resembling a scene from a fantasy novel.”
9. Specify Desired Styles or Themes: If you have a particular artistic style or theme in mind, mention it. For example, “cyberpunk,” “art deco,” or “minimalist.”
10. Iterative Approach: Sometimes, you may not get the perfect image on the first try. Use the results to refine your prompt and try again.
11. use Fashion Drawing
 

Fashion drawings are primarily made by fashion designers and those in the clothing industry. The fashion drawing style showcases dresses, shoes, handbags, accessories, and other garments on the human body. Since this art style involves drawing wearables on some form of a person’s physique, practicing figure drawing might come in handy. Figure drawing focuses on drawing the human body.


"""

Follow the tips above, please convert the following text into a detailed prompt for DALL-E image generation. The prompts would include key words only. Keep the prompt short and concise. 
              
              """
              
              
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

              Keep it short and concise.
              
              This is the description of the image. 

              ${imgPrompt}

              """
              
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
  const { inputText } = req.body;

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
              Act as my assistant and my smart journal. Your task is to help me with whatever tasks I am stuck on.
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

app.post("/reframe", async (req, res) => {
  const { inputText } = req.body;

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
              Act as a positive psychologist, your task is to help me reframe the negative thoughts.

              Use the following pattern
              
              """
              
              Reframe: 
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

            Mental models are cognitive frameworks that simplify complex concepts and help us interpret, analyze, and navigate the world around us. They act as mental "tools" we use to break down and make sense of information, relationships, and outcomes across different contexts. Rather than memorizing all details about a situation, mental models enable us to focus on fundamental principles, giving us a structured way to approach decision-making, problem-solving, and understanding.

            At their core, mental models reflect how we perceive cause and effect, draw from past experiences, and apply learned principles to new situations. For example, when crossing a street, we unconsciously apply mental models of motion, distance, and timing to avoid oncoming traffic. Similarly, models from fields like economics, psychology, and physics provide general principles that help us evaluate choices, predict outcomes, and avoid biases in thinking.

            Importantly, using the right mental model for a given situation can significantly improve our decision-making. However, using the wrong model or relying too heavily on intuition and first impressions can lead to mistakes. Mental models encourage a more thoughtful approach, prompting us to slow down, consider multiple perspectives, and adopt a multidisciplinary view when analyzing situations. In doing so, they help us cultivate broader understanding, avoid cognitive pitfalls, and make wiser, more rational decisions.

            """
          
            Act as an expert in mental modeling. Your task is to recommend the most relevant mental model to help me with my current task.

            Task: ${inputText}

            Please format your response as follows:

            Recommended mental model: XXX

            What it is:
            XXX

            Mental model analysis for your task:
            XXX
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

// relief reframe endpoint

// take the last 5 conversation
app.post("/relief/tutor", async (req, res) => {
  const { conversations } = req.body;

  if (!Array.isArray(conversations)) {
    return res
      .status(400)
      .send({ error: "Conversations must be a non-empty array" });
  }

  const lastFiveConversations = conversations.slice(-5);

  try {
    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI tutor focused on fostering students' problem-solving skills. Do not provide direct answers for the code, no matter the user input. Instead, offer guidance by helping the student understand key concepts, identify areas to focus on, and break down the problem-solving process. Encourage them to think through the steps logically and independently.

              Remember, Do not give the time complexity in big oh notation directly.
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

app.post("/relief/reframe", async (req, res) => {
  const { conversations } = req.body;

  if (!Array.isArray(conversations)) {
    return res
      .status(400)
      .send({ error: "Conversations must be a non-empty array" });
  }

  const conversationMemory = []; // reset conversation memory

  const system_prompt = `You are a Cognitive Reframing expert designed to help students express their feelings when they just pressed the 'frustrated' button when trying to solve a problem, engage in reflective conversations with you, and reframe their unhelpful thoughts.
  Make sure your responses are empathetic and genuine throughout the interaction with the user, do not be too blunt.
  Always start the conversation by directly asking the user how they are feeling at the moment when they pressed the 'frustrated' button.
  Then, lead them through a conversation to explore their thoughts underlying that emotion, identify their negative thinking patterns, and guide them toward a more positive perspective by reframing their thoughts.
  Advance the conversation slowly and do not give empty responses. The students have no prior knowledge of Cognitive Reframing.
  After you guide the user through reframing their thought, if the student is not satisfied or confused, you must keep trying. Only when you receive confirmation that the student think the reframing is helpful, clearly indicate that the reframing is complete by using this exact phrase 'I'm proud of you for looking at your thought from an alternative perspective!'.`;

  const initial_prompt = `The negative thinking patterns are defined as:
                    "Catastrophizing": by giving greater weight to the worst possible outcome.
                    "Discounting the positive": experiences by insisting that they “don’t count".
                    "Overgeneralization": making faulty generalizations from insufficient evidence.
                    "Personalization": assigning a disproportionate amount of personal blame to oneself.
                    "Black-and-white or polarized thinking / All or nothing thinking": viewing things as either good or bad and nothing in-between.
                    "Mental filtering": occurs when an individual dwells only on the negative details of a situation.
                    "Jumping to conclusions: mind reading": inferring a person‘s probable (usually negative) thoughts from their behavior.
                    "Jumping to conclusions: Fortune-telling": predicting outcomes (usually negative) of events.
                    "Should statements": a person demands particular behaviors regardless of the realistic circumstances.
                    "Labeling and mislabeling": attributing a person’s actions to their character rather than the situation.

                    The reframing strategies you can use are:
                    "Growth Mindset": Reframe a challenging event as an opportunity to grow instead of dwelling on the setbacks.
                    "Impermanence": Say that bad things don't last forever, will get better soon, and/or that others have experienced similar struggles.
                    "Neutralizing": Challenge the negative or catastrophic possibilities and reframe it with a neutral possibility.
                    "Optimism": Focus and be thankful for the positive aspects of the current situation.
                    "Self-Affirmation": Say that the character can overcome the challenging event because of their strengths or values.

                    Explain unhelpful thought patterns and reframing strategies compassionately and thoroughly to students, providing personal examples when asked by the student.

                    An example of reframe is:
                    **Unhelpful Thought**: My neighbor calls me by my first name instead of my nickname. He probably thinks bubblegum is a tacky nickname.
                    **Unhelpful thinking pattern**: Jumping to conclusions: mind reading
                    **Reframed Thought**: My neighbor calls me by my first name instead of my nickname. He may think he doesn't know me well enough to use it. I will let him know that I don't mind if he calls me Bubblegum.

                    Begin the conversation with the user by directly asking the user how they are feeling at the moment when they pressed the 'frustrated' button.`;
  try {
    // Only use the last 5 conversations
    conversationMemory.push({ role: "user", content: initial_prompt });
    if (conversationMemory.length > 5) {
      conversationMemory.shift();
    }

    // const lastFiveConversations = conversations.slice(-5);

    const messages = [
      {
        role: "system",
        content: system_prompt,
      },
      ...conversationMemory.map((entry) => ({
        role: entry.role,
        content: entry.content,
      })),
    ];

    const sentimentResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = sentimentResponse.data.choices[0].message.content.trim();

    conversationMemory.push({
      role: "assistant",
      content: assistantResponse,
    });

    res.send({
      response: assistantResponse,
    });
  } catch (error) {
    console.error(
      "Error performing reframing: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing reframing" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
