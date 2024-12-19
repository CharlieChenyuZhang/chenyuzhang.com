import React, { useState } from "react";
import styled from "styled-components";
import {
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { backendDomain } from "../../utils";

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`;

const ModelsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ModelCard = styled.div`
  flex: 1;
  margin: 0 10px;
  border: 1px solid white;
  border-radius: 8px;
  padding: 10px;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  border: 1px solid white;
  border-radius: 8px;
  padding: 10px;
  background-color: #111;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin: 5px 0;
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.isUser ? "#333" : "#555")};
  color: white;
  padding: 10px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
  display: flex;
  align-items: center;
`;

const AIIcon = styled(SmartToyIcon)`
  color: #00ff00;
  margin-right: 8px;
`;

const TextInputSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
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
`;

const StyledIconButton = styled(IconButton)`
  color: white !important;
  border: 1px solid white;
  border-radius: 50%;
  padding: 10px;
  margin-left: 10px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #333;
    color: #00ff00 !important;
  }
`;

const INTERACTION_LIMIT = 3;

const EvalV1 = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState({
    GPT4o: [],
    MistralAI: [],
    LearnLM: [],
  });
  const [loadingStates, setLoadingStates] = useState({
    GPT4o: false,
    MistralAI: false,
    LearnLM: false,
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };

    // Update state with user message for all models
    setMessages((prev) => ({
      GPT4o: [...prev.GPT4o, userMessage],
      MistralAI: [...prev.MistralAI, userMessage],
      LearnLM: [...prev.LearnLM, userMessage],
    }));

    setInput("");
    setLoadingStates({ GPT4o: true, MistralAI: true, LearnLM: true });

    const apiEndpoints = {
      GPT4o: `${backendDomain()}/personal-llm-eval/tutor`,
      MistralAI: `${backendDomain()}/personal-llm-eval/tutor`,
      LearnLM: `${backendDomain()}/personal-llm-eval/tutor`,
    };

    const conversationLoop = async (
      iteration = 1,
      initialMessages = { ...messages }
    ) => {
      if (iteration > INTERACTION_LIMIT) {
        setLoadingStates({ GPT4o: false, MistralAI: false, LearnLM: false });
        return;
      }

      const fetchResponses = Object.keys(apiEndpoints).map(async (model) => {
        try {
          const response = await fetch(apiEndpoints[model], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversations: initialMessages[model] }),
          });

          const data = await response.json();

          setMessages((prev) => ({
            ...prev,
            [model]: [...prev[model], { text: data.response, isUser: false }],
          }));

          return data.response; // Return the AI's response for the next input
        } catch (error) {
          console.error(`Error fetching response for ${model}:`, error);
          return null; // Handle errors gracefully
        }
      });

      const responses = await Promise.all(fetchResponses);

      // Use the first valid response as the next input for simplicity
      const nextInput = responses.find((resp) => resp) || "";

      // Recursively call the conversation loop if there's valid input
      if (nextInput) {
        // Update initialMessages for the next loop iteration
        const updatedMessages = { ...initialMessages };
        Object.keys(updatedMessages).forEach((model) => {
          updatedMessages[model] = [
            ...updatedMessages[model],
            { text: nextInput, isUser: true },
          ];
        });
        conversationLoop(iteration + 1, updatedMessages);
      }
    };

    // Start the conversation loop with the initial messages
    conversationLoop(1, {
      GPT4o: [...messages.GPT4o, userMessage],
      MistralAI: [...messages.MistralAI, userMessage],
      LearnLM: [...messages.LearnLM, userMessage],
    });
  };

  return (
    <MainContainer>
      <ModelsContainer>
        {["GPT4o", "MistralAI", "LearnLM"].map((model) => (
          <ModelCard key={model}>
            <Typography variant="h6">{model}</Typography>
            <Typography style={{ color: "#0f0" }}>
              duration: 20ms
              <br />
              cLatency: 400ms
              <br />
              # of interactions: 5
              <br />
              persona satisfaction: 80%
            </Typography>
            <ChatContainer>
              {messages[model].map((msg, index) => (
                <MessageContainer key={index} isUser={msg.isUser}>
                  {!msg.isUser && <AIIcon />}
                  <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
                </MessageContainer>
              ))}
              {loadingStates[model] && (
                <MessageContainer>
                  <MessageBubble>
                    <CircularProgress size={20} style={{ color: "#fff" }} />
                  </MessageBubble>
                </MessageContainer>
              )}
            </ChatContainer>
          </ModelCard>
        ))}
      </ModelsContainer>
      <TextInputSection>
        <StyledTextField
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <StyledIconButton onClick={handleSend}>
          <SendIcon />
        </StyledIconButton>
      </TextInputSection>
    </MainContainer>
  );
};

export default EvalV1;
