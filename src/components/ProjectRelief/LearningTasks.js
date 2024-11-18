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
    "countdown text chat"
    "countdown input chat"
    "button1 button2 button3";
  grid-template-columns: 0.5fr 1fr 2fr;
  grid-template-rows: auto;
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

const CountdownSection = styled.div`
  grid-area: countdown;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: auto;
`;

const TextInputSection = styled.div`
  grid-area: input;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
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

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledPre = styled.pre`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
`;

const LearningTasks = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear the interval when countdown reaches 0
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <MainContainer>
      <Box textAlign="center" marginBottom="1rem" sx={{ marginTop: "100px" }}>
        <Typography variant="h5" fontWeight="bold">
          Welcome to our Gen AI Python Tutor Study
        </Typography>
        <Typography variant="body1" color="inherit">
          To get started, please fill out the form below.
        </Typography>
      </Box>

      <LayoutContainer>
        <CountdownSection>
          {countdown > 0 ? countdown : "Time's up!"}
        </CountdownSection>

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
            <StyledTextField
              variant="outlined"
              placeholder="Text input"
              fullWidth
            />
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
          </TextInputSection>
        </ChatSection>

        <ButtonsContainer>
          <ButtonSection>
            <CustomButton variant="outlined">Proceed</CustomButton>
          </ButtonSection>

          <Button2Section>
            <FrustratedButton variant="outlined">
              I am frustrated! Please help!
            </FrustratedButton>
          </Button2Section>
        </ButtonsContainer>
      </LayoutContainer>
    </MainContainer>
  );
};

export default LearningTasks;
