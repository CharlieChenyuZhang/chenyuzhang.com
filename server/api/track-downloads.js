const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Track download event
router.post("/", async (req, res) => {
  const { user_id, originalText, reframedText } = req.body;

  if (!user_id || !originalText || !reframedText) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    // Store the download event in DynamoDB
    const params = {
      TableName: "glowingstar-journaling",
      Item: {
        user_id,
        event: "TRACK_DOWNLOAD",
        timestamp: new Date().toISOString(),
        originalText,
        reframedText,
      },
    };

    await dynamoDb.put(params).promise();

    res.status(200).send({ message: "Download tracked successfully" });
  } catch (error) {
    console.error("Error tracking download:", error);
    res.status(500).send({ error: "Error tracking download" });
  }
});

module.exports = router;
