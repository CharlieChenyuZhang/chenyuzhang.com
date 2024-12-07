const express = require("express");
const axios = require("axios");
const router = express.Router();
const AWS = require("aws-sdk");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Configure AWS SDK
AWS.config.update({
  region: "us-east-1", // Replace with your region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

router.post("/tutor", async (req, res) => {
  const { conversations, userId } = req.body;

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
        model: "gpt-4",
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

    // Retrieve existing conversations from DynamoDB
    const getParams = {
      TableName: "mas630-relief",
      Key: { userId, event: "TRACK_TUTOR_CONVERSATION" },
    };

    const existingData = await dynamoDb.get(getParams).promise();

    const lastConversation = conversations.slice(-1)[0];
    const newConversations = [
      {
        timestamp: new Date().toISOString(),
        isUser: lastConversation?.isUser,
        text: lastConversation?.text ?? "",
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

    // Update the conversation and response in DynamoDB
    const putParams = {
      TableName: "mas630-relief",
      Item: {
        userId,
        event: "TRACK_TUTOR_CONVERSATION",
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
      "Error with Relief Tutor: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error with Relief Tutor" });
  }
});

router.post("/reframe", async (req, res) => {
  const { conversations, userId } = req.body;

  if (!Array.isArray(conversations)) {
    return res
      .status(400)
      .send({ error: "Conversations must be a non-empty array" });
  }

  const system_prompt = `You are a Cognitive Reframing expert designed to help students express their feelings when they just pressed the 'frustrated' button when trying to solve a problem, engage in reflective conversations with you, and reframe their unhelpful thoughts.
  Always start the conversation by directly asking the user how they are feeling at the moment when they pressed the 'frustrated' button.
  Then, lead them through a conversation to explore their thoughts underlying that emotion, identify their negative thinking patterns, help them find evidence that negates or supports their thought, and guide them towards a more positive perspective by reframing their thoughts.
  Make sure your responses are empathetic and genuine throughout the interaction with the user, do not be too blunt.
  Advance the conversation slowly and do not give empty responses. The students have no prior knowledge of Cognitive Reframing.
  After you guide the user through reframing their thought, if the student is not satisfied or confused, you must keep trying. Only when you receive confirmation that the student think the reframing is helpful, use this exact phrase 'I'm proud of you for looking at your thought from an alternative perspective!'.`;

  const initial_prompt = `The negative thinking patterns are defined as:
                    "Catastrophizing": giving greater weight to the worst possible outcome.
                    "Discounting the positive": You unreasonably tell yourself that positive experiences, deeds, or qualities do not count. Example: “I did that project well, but that doesn’t mean I’m competent; I just got lucky.”
                    "Overgeneralization": making faulty generalizations from insufficient evidence.
                    "Personalization": assigning a disproportionate amount of personal blame to oneself.
                    "Black-and-white or polarized thinking / All or nothing thinking": You view a situation in only two categories instead of on a continuum. Example: “If I’m not a total success, I’m a failure.”
                    "Mental filtering": You pay undue attention to one negative detail instead of seeing the whole picture. Example: “Because I got one low rating on my evaluation [which also contained several high ratings] it means I’m doing a lousy job.”
                    "Jumping to conclusions: mind reading": You believe you know what others are thinking, failing to consider other, more likely possibilities. Example: “He thinks that I don’t know the first thing about this project.”
                    "Jumping to conclusions: Fortune-telling": You predict the future negatively without considering other, more likely outcomes. Example: “I’ll be so upset, I won’t be able to function at all.”
                    "Should statements": a person demands particular behaviors regardless of the realistic circumstances.
                    "Labeling and mislabeling": You put a fixed, global label on yourself or others without considering that the evidence might more reasonably lead to a less disastrous conclusion. Example: “I’m a loser. He’s no good.”

                    The reframing strategies you can use are:
                    "Growth Mindset": Reframe a challenging event as an opportunity to grow instead of dwelling on the setbacks.
                    "Impermanence": Say that bad things don't last forever, will get better soon, and/or that others have experienced similar struggles.
                    "Neutralizing": Challenge the negative or catastrophic possibilities and reframe it with a neutral possibility.
                    "Optimism": Focus and be thankful for the positive aspects of the current situation.
                    "Self-Affirmation": Say that the character can overcome the challenging event because of their strengths or values.

                    Explain unhelpful thought patterns and reframing strategies compassionately and thoroughly to students, providing personal examples when asked by the student.

                    Example #1 of reframe:
                    **Unhelpful Thought**: My neighbor calls me by my first name instead of my nickname. He probably thinks bubblegum is a tacky nickname.
                    **Unhelpful thinking pattern**: Jumping to conclusions: mind reading
                    **Reframed Thought**: My neighbor calls me by my first name instead of my nickname. He may think he doesn't know me well enough to use it. I will let him know that I don't mind if he calls me Bubblegum.
                    **Reframing Stategy**: Neutralizing

                    Example #2 of reframe:
                    **Unhelpful Thought**: I'm a vegan, and the restaurant served me a dish with fish in it. They're trying to kill me.
                    **Unhelpful thinking pattern**: Overgeneralization
                    **Reframed Thought**: I'm vegan, and the restaurant served me a dish with a fish in it. I'll just notify the waiter and have it sent back.
                    **Reframing Stategy**: Neutralizing

                    Example #3 of reframe:
                    **Unhelpful Thought**: I failed the last exam for my law course in college, it's because I am worthless.
                    **Unhelpful thinking pattern**: Labeling and mislabeling
                    **Reframed Thought**: I failed the law course in college the first time, but I studied hard and worked with the professor to get an A the second time
                    **Reframing Stategy**: Growth Mindset

                    Example #4 of reframe:
                    **Unhelpful Thought**: I want to study and be an engineer but I fear I will fail my exams and never become an engineer.
                    **Unhelpful thinking pattern**: Catastrophizing
                    **Reframed Thought**: I want to study and be an engineer, and even though I fear I will fail my exams, if I keep working at it I'll become an engineer.
                    **Reframing Stategy**: Self-Affirmation

                    Begin the conversation with the user by directly asking the user how they are feeling at the moment when they pressed the 'frustrated' button.`;

  try {
    // Only use the last 5 conversations
    const lastFiveConversations = conversations.slice(-5);

    const messages = [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: initial_prompt,
      },
      ...lastFiveConversations.map((conversation) => ({
        role: conversation.isUser ? "user" : "assistant",
        content: conversation.text ?? "",
      })),
    ];

    const reliefReframingResponse = await axios.post(
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

    const response =
      reliefReframingResponse.data.choices[0].message.content.trim();

    // Retrieve existing conversations from DynamoDB
    const getParams = {
      TableName: "mas630-relief",
      Key: { userId, event: "TRACK_REFRAMING_CONVERSATION" },
    };

    const existingData = await dynamoDb.get(getParams).promise();

    const lastConversation = conversations.slice(-1)[0];
    const newConversations = [
      {
        timestamp: new Date().toISOString(),
        isUser: lastConversation?.isUser,
        text: lastConversation?.text ?? "",
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

    // Update the conversation and response in DynamoDB
    const putParams = {
      TableName: "mas630-relief",
      Item: {
        userId,
        event: "TRACK_REFRAMING_CONVERSATION",
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
      "Error performing reframing: ",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Error performing reframing" });
  }
});

router.post("/register", async (req, res) => {
  const {
    userId,
    mbtiType,
    email,
    ethnicity,
    countryOfOrigin,
    originGrewUp,
    gender,
    age,
    schoolAffiliation,
    pythonComfort,
  } = req.body;

  const params = {
    TableName: "mas630-relief", // Replace with your DynamoDB table name
    Item: {
      userId,
      event: "TRACK_FIRST_REGISTRATION",
      mbtiType,
      email,
      ethnicity,
      countryOfOrigin,
      originGrewUp,
      gender,
      age,
      schoolAffiliation,
      pythonComfort,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error storing user data in DynamoDB:", error);
    res.status(500).send({ error: "Error storing user data" });
  }
});

router.post("/log-learning-task", async (req, res) => {
  const { userId, task_start_time, task_end_time } = req.body;

  if (!userId || !task_start_time || !task_end_time) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const params = {
    TableName: "mas630-relief",
    Item: {
      userId,
      event: "TRACK_LEARNING_VIDEO",
      task_start_time,
      task_end_time,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res
      .status(200)
      .send({ message: "learning video stats stored successfully" });
  } catch (error) {
    console.error(
      "Error storing learning video stats data in DynamoDB:",
      error
    );
    res.status(500).send({ error: "Error storing learning video stats data" });
  }
});

router.post("/track/post-reframing-action", async (req, res) => {
  const { userId, action } = req.body;

  if (!userId || !action) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const putParams = {
    TableName: "mas630-relief",
    Item: {
      userId,
      timestamp: new Date().toISOString(),
      event: "TRACK_POST_REFRAMING_SELECTION",
      action,
    },
  };

  await dynamoDb.put(putParams).promise();

  res.send({});
});

router.post("/track/frustration-level", async (req, res) => {
  const { userId, level } = req.body;

  // FIXME: TBD
  if (!userId || !level) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  // Retrieve existing conversations from DynamoDB
  const getParams = {
    TableName: "mas630-relief",
    Key: { userId, event: "FRUSTRATION_LEVEL_SELECTION" },
  };

  const existingData = await dynamoDb.get(getParams).promise();

  const updatedData = [
    ...(existingData?.Item?.levels || []),
    ...[
      {
        timestamp: new Date().toISOString(),
        level,
      },
    ],
  ];

  // Update the conversation and response in DynamoDB
  const putParams = {
    TableName: "mas630-relief",
    Item: {
      userId,
      event: "FRUSTRATION_LEVEL_SELECTION",
      levels: updatedData,
    },
  };

  await dynamoDb.put(putParams).promise();

  res.send({});
});

router.post("/track/question-answer", async (req, res) => {
  const { userId, question, answer, isCorrect } = req.body;

  // FIXME: TBD
  if (!userId || !question || !answer || !isCorrect) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  // Retrieve existing conversations from DynamoDB
  const getParams = {
    TableName: "mas630-relief",
    Key: { userId, event: "TRACK_QUESTION_ANSWER" },
  };

  const existingData = await dynamoDb.get(getParams).promise();

  const updatedData = [
    ...(existingData?.Item?.levels || []),
    ...[
      {
        timestamp: new Date().toISOString(),
        level,
      },
    ],
  ];

  // Update the conversation and response in DynamoDB
  const putParams = {
    TableName: "mas630-relief",
    Item: {
      userId,
      event: "FRUSTRATION_LEVEL_SELECTION",
      levels: updatedData,
    },
  };

  await dynamoDb.put(putParams).promise();

  res.send({});
});

module.exports = router;
