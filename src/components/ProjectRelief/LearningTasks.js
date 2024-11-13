import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Button, Typography, TextField } from "@mui/material";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`;

const LayoutContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid white;
  display: grid;
  grid-template-areas:
    "text chat countdown"
    "input chat countdown"
    "button1 button2 button3";
  grid-template-columns: 1fr 2fr 0.5fr;
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

const LearningTasks = () => {
  return (
    <MainContainer>
      <LayoutContainer>
        <TextSection>
          <Typography variant="body1" style={{ flexGrow: 1 }}>
            {`
            
            for i in range(n):
              print(i)
            
            `}
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

        <CountdownSection>Time Countdown</CountdownSection>

        <ButtonsContainer>
          <ButtonSection>
            <CustomButton variant="outlined">Proceed</CustomButton>
          </ButtonSection>

          <Button2Section>
            <CustomButton variant="outlined">
              I am frustrated! Please help!
            </CustomButton>
          </Button2Section>
        </ButtonsContainer>
      </LayoutContainer>
    </MainContainer>
  );
};

export default LearningTasks;
