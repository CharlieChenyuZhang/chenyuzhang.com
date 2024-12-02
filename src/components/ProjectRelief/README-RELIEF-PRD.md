# Participant Interaction Logging System

## Overview

This system is designed to track participant interactions across four screens in a study application. It logs data such as email address, time spent on tasks, user inputs, and bot interactions. All data will be stored in AWS for analysis.

---

## API Design

### 1. **Endpoint: User Registration (Screen 1)**

**Description:** Logs participant email and demographic information when they start the study.

- **Method:** `POST`
- **Endpoint:** `/api/register`
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
    "python_proficiency": 4
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Participant registered successfully.",
    "email": "participant@example.com"
  }
  ```

---

### 2. **Endpoint: Log Learning Task Time (Screen 2)**

**Description:** Tracks time spent on the learning task and button clicks.

- **Method:** `POST`
- **Endpoint:** `/api/log-learning-task`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "task_start_time": "2024-11-27T13:00:00Z",
    "task_end_time": "2024-11-27T13:10:30Z",
    "iframe_watch_duration": 630, // in seconds
    "button_clicks": [
      {
        "button_id": "next_button",
        "timestamp": "2024-11-27T13:10:30Z"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Learning task log saved successfully."
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
- **Endpoint:** `/api/log-debrief`
- **Request Body:**
  ```json
  {
    "email": "participant@example.com",
    "emotions": ["Curiosity", "Frustration", "Relief"],
    "impact": ["It enhanced my understanding.", "It made me feel supported."],
    "ai_assistance": "The AI provided clarity on complex concepts.",
    "improvement_suggestions": "Provide more examples in the bot responses."
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Debrief responses logged successfully."
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
