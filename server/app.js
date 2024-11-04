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

    const gptPrompt = gptResponse.data.choices[0].message.content.trim();

    // Step 2: Call DALL-E 3 to generate an image
    const dalleResponse = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: "An ink sketch of a " + gptPrompt,
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

    const imageUrl = dalleResponse.data.data[0].url;

    res.send({
      prompt: gptPrompt,
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
