import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Typography, TextField, Box } from "@mui/material";

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
  grid-template-areas:
    "text chat"
    "input chat"
    "button1 button2";
  grid-template-columns: 1fr 2fr;
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
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChatSection = styled.div`
  grid-area: chat;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
`;

const TextInputSection = styled.div`
  grid-area: input;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const AnswerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonSection = styled.div`
  grid-area: button1;
`;

const Button2Section = styled.div`
  margin-top: 20px;
  grid-area: button2;
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

const FrustratedButton = styled(CustomButton)`
  border: 1px solid red !important;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    fieldset {
      border-color: white;
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

const LearningTasks = () => {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    // Load remaining time from localStorage
    const savedTime = localStorage.getItem("timeLeft");
    const initialTime = savedTime ? parseInt(savedTime, 10) : 1800;
    setTimeLeft(initialTime);

    // Countdown logic
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          localStorage.removeItem("timeLeft"); // Clear storage when time runs out
          return 0;
        } else {
          const newTime = prev - 1;
          localStorage.setItem("timeLeft", newTime);
          return newTime;
        }
      });
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(countdown);
  }, []);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <MainContainer>
      <Box textAlign="center" marginBottom="1rem" sx={{ marginTop: "100px" }}>
        <Typography variant="h6" fontWeight="bold">
          Time Left: {formatTime(timeLeft)}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          You solved 0 / 30 questions.
        </Typography>
      </Box>

      <LayoutContainer>
        <TextSection>
          <Typography variant="body1" style={{ flexGrow: 1 }}>
            {"Find the time complexity of the following:"}
            <StyledPre>
              <code>
                {`
for i in range(n):
  print(i)
      `}
              </code>
            </StyledPre>
          </Typography>

          <TextInputSection>
            <AnswerContainer>
              {"O("}
              <StyledTextField
                variant="outlined"
                placeholder="Your answer"
                fullWidth
              />
              {")"}
            </AnswerContainer>
            <CustomButton className="answer-btn" variant="outlined">
              Submit Answer
            </CustomButton>
          </TextInputSection>
        </TextSection>

        <ChatSection>
          <Typography variant="body1">
            Chat Bot here to explain unfamiliar concepts but won't give you
            answers
          </Typography>

          <TextInputSection>
            <StyledTextField
              variant="outlined"
              placeholder="Text input"
              fullWidth
            />
            <CustomButton className="chatbot-submit-btn" variant="outlined">
              Submit Chat
            </CustomButton>
            <FrustratedButton variant="outlined">
              I am VERY frustrated! Please help!
            </FrustratedButton>
            <FrustratedButton variant="outlined">
              I am Moderately frustrated! Please help!
            </FrustratedButton>
            <FrustratedButton variant="outlined">
              I am Slightly frustrated! Please help!
            </FrustratedButton>
          </TextInputSection>
        </ChatSection>
      </LayoutContainer>
    </MainContainer>
  );
};

export default LearningTasks;
