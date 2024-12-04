import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { backendDomain } from "../../utils"; // Assuming you have a backendDomain utility
import { questions } from "./constants";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`;

const LayoutContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid white;
  display: grid;
  grid-template-areas: ${({ intervening }) =>
    intervening ? "'chat'" : "'text chat' 'input chat' 'button1 button2'"};
  grid-template-columns: ${({ intervening }) =>
    intervening ? "1fr" : "1fr 2fr"};
  gap: 1.5rem;
  width: 100%;
  max-width: 80%;
  color: #fff;
`;

const TextSection = styled.div`
  grid-area: text;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 8px;
  /* min-height: 300px; */
  display: flex;
  flex-direction: column;
`;

const ChatSection = styled.div`
  grid-area: chat;
  border: ${(props) => (props.color === "green" ? "5px" : "1px")} solid
    ${(props) => props.color || "white"};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 600px;
  overflow-y: auto;
`;

// const TextInputSection = styled.div`
//   grid-area: input;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 0.5rem;
// `;

const TextInputSection = styled.div`
  grid-area: input;
  display: flex;
  flex-direction: row; /* Inline layout for the input and send icon */
  align-items: center; /* Align vertically */
  gap: 0.5rem; /* Spacing between input and send icon */
`;

const AnswerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CustomButton = styled(Button)`
  background-color: black !important;
  color: white !important;
  border: 1px solid white !important;
  &:hover {
    background-color: #888 !important;
  }
  width: 100%;
  padding: 1rem;
`;

const RedButton = styled(Button)`
  background-color: black !important;
  color: white !important;
  border: 2px solid red !important;
  &:hover {
    background-color: #880000 !important;
  }
  width: 100%;
  padding: 1rem;
`;

const AnswerStyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    width: 150px;
    color: white;
    fieldset {
      border-color: ${(props) => (props.error ? "red" : "white")};
    }
    &:hover fieldset {
      border-color: #888;
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiInputLabel-root {
    color: white;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    fieldset {
      border-color: ${(props) => (props.error ? "red" : "white")};
    }
    &:hover fieldset {
      border-color: #888;
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiInputLabel-root {
    color: white;
  }
`;

const StyledPre = styled.pre`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const AiIcon = styled.div`
  color: ${(props) => props.color || "white"};
  font-size: 1.5rem;
  margin-top: -4px;
  margin-right: ${(props) => (props.isUser ? "0" : "8px")};
  margin-left: ${(props) => (props.isUser ? "8px" : "0")};
`;

const MessageBubble = styled.div`
  background-color: ${(props) =>
    props.isUser ? "#000" : props.color || "#222"};
  color: #fff;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 10px 15px;
  max-width: 75%;
  white-space: pre-line;
`;

const STUDY_TIME = 1800; // 30 minutes in seconds

const LearningTasks = () => {
  const [intervening, setIntervening] = useState(false); // Default color is white
  const [timeLeft, setTimeLeft] = useState(STUDY_TIME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [interventionConversations, setInterventionConversations] = useState(
    []
  );
  const [thought, setThought] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    const initialTime = savedTime ? parseInt(savedTime, 10) : STUDY_TIME;
    setTimeLeft(initialTime);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          localStorage.removeItem("timeLeft");
          navigate("/project/relief/debrief");
          return 0;
        } else {
          const newTime = prev - 1;
          localStorage.setItem("timeLeft", newTime);
          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      if (solvedCount + 1 === questions.length) {
        navigate("/project/relief/debrief");
      }

      setSolvedCount(solvedCount + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect answer. Please try again.");
    }
  };

  const handleChatSubmit = async () => {
    if (!thought.trim()) return;

    const newConversatioins = [
      ...(intervening ? interventionConversations : conversations),
      { text: thought, isUser: true },
    ];
    setLoading(true);
    if (intervening) {
      setInterventionConversations(newConversatioins);
    } else {
      setConversations(newConversatioins);
    }
    setThought("");

    try {
      const lastFiveMessages = newConversatioins.slice(-5); // Get the last 5 messages

      const response = await fetch(
        `${backendDomain()}/relief/${intervening ? "reframe" : "tutor"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversations: lastFiveMessages }),
        }
      );
      const data = await response.json();

      if (intervening) {
        setInterventionConversations([
          ...newConversatioins,
          { text: data.response, isUser: false },
        ]);
      } else {
        setConversations([
          ...newConversatioins,
          { text: data.response, isUser: false },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFrustrationClick = async () => {
    if (!intervening) {
      setIntervening(true);
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendDomain()}/relief/reframe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversations: [] }),
      });

      // whenever this button click, we assume a new intervention thread
      setInterventionConversations([]);
      const data = await response.json();
      setInterventionConversations([
        ...interventionConversations,
        { text: data.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching last five conversations response:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [conversations, interventionConversations]);

  return (
    <MainContainer>
      <Box textAlign="center" marginBottom="1rem" sx={{ marginTop: "100px" }}>
        <Typography variant="h1" fontWeight="bold">
          Time Left: {formatTime(timeLeft)}
        </Typography>
        <Typography variant="h2" fontWeight="bold">
          You solved {solvedCount} / {questions.length} questions.
        </Typography>
      </Box>

      <LayoutContainer intervening={intervening}>
        {!intervening && (
          <TextSection>
            <Typography variant="body1">
              Find the time complexity of the following:
              <StyledPre>
                <code>{questions[currentQuestionIndex].code}</code>
              </StyledPre>
            </Typography>
            <TextInputSection>
              <AnswerContainer>
                {"O("}
                <AnswerStyledTextField
                  variant="outlined"
                  placeholder="Your answer"
                  fullWidth
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setErrorMessage("");
                  }}
                  error={errorMessage !== ""}
                />
                {")"}
              </AnswerContainer>
              <CustomButton onClick={handleAnswerSubmit} variant="outlined">
                Submit Answer
              </CustomButton>
            </TextInputSection>
            <Typography color="error" variant="body2" sx={{ height: "20px" }}>
              {errorMessage}
            </Typography>

            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              Tips:
              <ul>
                <li>
                  Please write your answer in terms of <strong>n</strong>.
                </li>
                <li>
                  If it is exponential, use the symbol <strong>^</strong>. For
                  example, two to the power of <strong>n</strong> should be
                  written as <strong>2^n</strong>.
                </li>
                <li>
                  For multiplication, write <strong>2n</strong> instead of{" "}
                  <strong>2*n</strong>.
                </li>
              </ul>
            </Typography>
          </TextSection>
        )}

        <ChatSection color={intervening ? "green" : "white"}>
          <Typography variant="h5" color={intervening ? "red" : "white"}>
            {intervening
              ? "Please keep talking to the chatbot till the color turns back to normal."
              : "Chat Bot here to explain unfamiliar concepts but won't give you"}
          </Typography>
          <div
            style={{ overflowY: "auto", flexGrow: 1 }}
            ref={chatContainerRef}
          >
            {(intervening ? interventionConversations : conversations).map(
              (msg, index) => (
                <MessageContainer key={index} isUser={msg.isUser}>
                  {!msg.isUser && (
                    <AiIcon color={intervening ? "green" : "white"}>✧₊⁺</AiIcon>
                  )}
                  <MessageBubble
                    isUser={msg.isUser}
                    color={intervening ? "green" : "white"}
                  >
                    {msg.text}
                  </MessageBubble>
                </MessageContainer>
              )
            )}
            {loading && (
              <MessageContainer isUser={false}>
                <AiIcon color={intervening ? "green" : "white"}>✧₊⁺</AiIcon>
                <MessageBubble color={intervening ? "green" : "white"}>
                  <CircularProgress size={20} color="inherit" />
                  {" Processing..."}
                </MessageBubble>
              </MessageContainer>
            )}
          </div>
          <TextInputSection>
            <StyledTextField
              variant="outlined"
              placeholder="Ask the bot for help here..."
              fullWidth
              multiline
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
            <IconButton
              onClick={handleChatSubmit}
              sx={{
                color: "white",
                "&:hover": {
                  color: "grey",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </TextInputSection>

          {!intervening && (
            <>
              <Box mt={2} width="100%">
                try me:
              </Box>

              <Box mt={1} width="100%">
                <RedButton level="extreme" onClick={handleFrustrationClick}>
                  🔥 I am Extremely frustrated
                </RedButton>
              </Box>
              <Box mt={1} width="100%">
                <RedButton level="moderate" onClick={handleFrustrationClick}>
                  ⚠️ I am Moderately frustrated
                </RedButton>
              </Box>
              <Box mt={1} width="100%">
                <RedButton level="slight" onClick={handleFrustrationClick}>
                  🟡 I am Slightly frustrated
                </RedButton>
              </Box>
            </>
          )}
        </ChatSection>
      </LayoutContainer>
    </MainContainer>
  );
};

export default LearningTasks;
