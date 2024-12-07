# Participant Interaction Logging System

## Overview

This system is designed to track participant interactions across four screens in a study application. It logs data such as email address, time spent on tasks, user inputs, and bot interactions. All data will be stored in AWS for analysis.

---

## API Design

### 1. **Endpoint: User Registration (Screen 1)**

**Description:** Logs participant email and demographic information when they start the study.

- **Method:** `POST`
- **Endpoint:** `/relief/register`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "mbti_type": "INTJ",
    "race_ethnicity": "East Asian",
    "country_of_origin": "China",
    "gender": "Male",
    "age": 25,
    "school_affiliation": "MIT",
    "python_proficiency": 4,
    "time_stamp": "2024-12-04T00:49:27.618Z"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success"
  }
  ```

---

### 2. **Endpoint: Log Learning Task Time (Screen 2)**

**Description:** Tracks time spent on the learning task

- **Method:** `POST`
- **Endpoint:** `/relief/log-learning-task`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "task_start_time": "2024-11-27T13:00:00Z", // when first reach the /project/relief/learning-video
    "task_end_time": "2024-11-27T13:10:30Z" // when leave the /project/relief/learning-video
  }
  ```
- **Response:**
  ```json
  {
    "status": "success"
  }
  ```

---

### 3. **Endpoint: Log Question Attempts (Screen 3)**

**Description:** Logs all attempts made in the "Your Answer" area and interactions with the bot.

- **Method:** `POST`
- **Endpoint:** `/api/log-question-attempts`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "question_id": "time_complexity_1",
    "attempts": [
      {
        "attempt_number": 1,
        "answer": "O(n)",
        "timestamp": "2024-11-27T13:15:00Z"
      },
      {
        "attempt_number": 2,
        "answer": "O(1)",
        "timestamp": "2024-11-27T13:16:00Z"
      }
    ],
    "bot_conversations": [
      {
        "message_by_user": "What is time complexity?",
        "message_by_bot": "Time complexity is a measure of algorithm efficiency.",
        "timestamp": "2024-11-27T13:17:00Z"
      },
      {
        "message_by_user": "Can you give me an example?",
        "message_by_bot": "Sure. Accessing the first element of a list is O(1).",
        "timestamp": "2024-11-27T13:18:00Z"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Question attempts log saved successfully."
  }
  ```

---

### 4. **Endpoint: Log Debrief Responses (Screen 4)**

**Description:** Logs participant responses to the post-research questionnaire.

- **Method:** `POST`
- **Endpoint:** `/relief/log-debrief`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "emotions": ["Curiosity", "Frustration", "Relief"],
    "emotion_explanation": "I am just curious.",
    "impact": ["It enhanced my understanding.", "It made me feel supported."],
    "ai_assistance": "The AI provided clarity on complex concepts.",
    "improvement_suggestions": "Provide more examples in the bot responses."
  }
  ```
- **Response:**
  ```json
  {
    "status": "success"
  }
  ```

---

### 5. **Endpoint: tutor/reframe design**

- **Method:** `POST`
- **Endpoint:** `/relief/tutor` or `/relief/reframe`
- **Request Body:**
  ```json
  {
    "conversations": [
      {
        "isUser": true,
        "text": "How do I define a list in Python?"
      },
      {
        "isUser": false,
        "text": "You can define a list using square brackets, e.g., my_list = [1, 2, 3]."
      }
    ]
  }
  ```
- **Response:**

  ```json
  {
    "response": "You can define a list using square brackets, for example, my_list = [1, 2, 3]."
  }
  ```

---

### 6. **Endpoint: track/events**

- **Method:** `POST`
- **Endpoint:** `/relief/track/events`
- **Request Body (For Submit Answer):**
  ```json
  {
    "event_name": "SUBMIT_ANSWER_CLICKED",
    "data": {
      "answer": "ABC",
      "correct": true,
      "timestamp": "2024-12-03T12:00:00Z"
    }
  }
  ```

Or

- **Request Body (For Submit Answer):**
  ```json
  {
    "event_name": "EXTREMELY_FRUSTRATED_CLICKED", // values are EXTREMELY_FRUSTRATED_CLICKED, MODERATELY_FRUSTRATED_CLICKED, SLIGHTLY_FRUSTRATED_CLICKED
    "data": {
      "timestamp": "2024-12-03T12:00:00Z"
    }
  }
  ```

---

## Data Storage Design

**AWS Suggestions:**

1. **DynamoDB**:

   - Use a table named `ParticipantLogs` with the following structure:
     - **Primary Key:** `email` (String)
     - **Attributes:**
       - `registration_data` (JSON)
       - `learning_task_data` (JSON)
       - `question_attempts` (JSON)
       - `debrief_responses` (JSON)

2. **S3 Buckets**:
   - Store raw JSON files for each participant session in a bucket named `participant-session-data`.

---

## Example Logged Data

### **Screen 1 Example Log:**

````json
{
    "email": "participant@example.com",
    "registration_data": {
        "mbti_type": "INTJ",
        "race_ethnicity": "East Asian",
        "country_of_origin": "China",
        "gender": "Male",
        "age": 25,
        "school_affiliation": "MIT",
        "python_proficiency": 4
    }
}

### **Screen 2 Example Log:**
```json
{
    "email": "participant@example.com",
    "learning_task_data": {
        "task_start_time": "2024-11-27T13:00:00Z",
        "task_end_time": "2024-11-27T13:10:30Z",
        "iframe_watch_duration": 630,
        "button_clicks": [
            {
                "button_id": "next_button",
                "timestamp": "2024-11-27T13:10:30Z"
            }
        ]
    }
}



### **Screen 3 Example Log:**
```json
{
    "email": "participant@example.com",
    "question_attempts": {
        "question_id": "time_complexity_1",
        "attempts": [
            {
                "attempt_number": 1,
                "answer": "O(n)",
                "timestamp": "2024-11-27T13:15:00Z"
            },
            {
                "attempt_number": 2,
                "answer": "O(1)",
                "timestamp": "2024-11-27T13:16:00Z"
            }
        ],
        "bot_conversations": [
            {
                "message_by_user": "What is time complexity?",
                "message_by_bot": "Time complexity is a measure of algorithm efficiency.",
                "timestamp": "2024-11-27T13:17:00Z"
            },
            {
                "message_by_user": "Can you give me an example?",
                "message_by_bot": "Sure. Accessing the first element of a list is O(1).",
                "timestamp": "2024-11-27T13:18:00Z"
            }
        ]
    }
}



### **Screen 4 Example Log:**
```json
{
    "email": "participant@example.com",
    "debrief_responses": {
        "emotions": ["Curiosity", "Frustration", "Relief"],
        "impact": ["It enhanced my understanding.", "It made me feel supported."],
        "ai_assistance": "The AI provided clarity on complex concepts.",
        "improvement_suggestions": "Provide more examples in the bot responses."
    }
}
````

---

# Participant Interaction Logging System

## **Endpoint: AI Tutor Interaction Logging (/relief/tutor)**

### **Description**

Facilitates an AI tutoring session focused strictly on Python syntax. The system interacts with the OpenAI API to provide concise, accurate responses to user queries while enforcing topic restrictions.

### **Method**

`POST`

### **Endpoint**

`/relief/tutor`

### **Request Body**

```json
{
  "conversations": [
    {
      "isUser": true,
      "text": "How do I define a list in Python?"
    },
    {
      "isUser": false,
      "text": "You can define a list using square brackets, e.g., my_list = [1, 2, 3]."
    }
  ]
}
```

### newUserId

newUserId is stored in localStorage
