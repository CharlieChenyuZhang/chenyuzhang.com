import React, { useState, useRef, useEffect } from "react";
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

const RightAlignedSpinner = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 10px;
`;

const INTERACTION_TURN_LIMIT = 5;

const EvalV2 = () => {
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
  const [studentLoadingStates, setStudentLoadingStates] = useState({
    GPT4o: false,
    MistralAI: false,
    LearnLM: false,
  });
  const [limitReached, setLimitReached] = useState(false);

  const chatRefs = {
    GPT4o: useRef(null),
    MistralAI: useRef(null),
    LearnLM: useRef(null),
  };

  useEffect(() => {
    Object.keys(chatRefs).forEach((model) => {
      const chatRef = chatRefs[model].current;
      if (chatRef) {
        chatRef.scrollTop = chatRef.scrollHeight;
      }
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const totalInteractions = Object.keys(messages).reduce(
      (acc, model) => acc + messages[model].length,
      0
    );

    if (totalInteractions >= INTERACTION_TURN_LIMIT) {
      setLimitReached(true);
      return;
    }

    setLimitReached(false);

    const userMessage = { text: input, isUser: true };
    setInput("");
    setLoadingStates({ GPT4o: true, MistralAI: true, LearnLM: true });

    const newMessages = {
      GPT4o: [...messages.GPT4o, userMessage],
      MistralAI: [...messages.MistralAI, userMessage],
      LearnLM: [...messages.LearnLM, userMessage],
    };

    setMessages(newMessages);

    try {
      const fetchResponses = Object.keys(newMessages).map((model) =>
        handleModelInteraction(model, newMessages)
      );

      await Promise.all(fetchResponses);
    } catch (error) {
      console.error("Error during message processing:", error);
    }
  };

  const handleModelInteraction = async (model, newMessages) => {
    try {
      // Call the /tutor endpoint
      const tutorResponse = await fetch(
        `${backendDomain()}/personal-llm-eval/tutor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversations: newMessages[model],
          }),
        }
      );

      const tutorData = await tutorResponse.json();
      const updatedMessagesWithTutor = [
        ...newMessages[model],
        { text: tutorData.response, isUser: false },
      ];

      setMessages((prev) => ({ ...prev, [model]: updatedMessagesWithTutor }));

      // Call the /student-persona-sim endpoint
      const studentResponse = await fetch(
        `${backendDomain()}/personal-llm-eval/student-persona-sim`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversations: updatedMessagesWithTutor,
          }),
        }
      );

      const studentData = await studentResponse.json();
      const updatedMessagesWithStudent = [
        ...updatedMessagesWithTutor,
        { text: studentData.response, isUser: true },
      ];

      setMessages((prev) => ({ ...prev, [model]: updatedMessagesWithStudent }));

      // Recursive call back to /tutor
      const totalInteractions = Object.keys(newMessages).reduce(
        (acc, modelKey) => acc + newMessages[modelKey].length,
        0
      );

      if (totalInteractions < INTERACTION_TURN_LIMIT) {
        await handleModelInteraction(model, {
          ...newMessages,
          [model]: updatedMessagesWithStudent,
        });
      }
    } catch (error) {
      console.error(`Error during interaction for ${model}:`, error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [model]: false }));
      setStudentLoadingStates((prev) => ({ ...prev, [model]: false }));
    }
  };

  return (
    <MainContainer>
      {limitReached && (
        <Typography
          variant="body1"
          style={{ color: "red", marginBottom: "10px" }}
        >
          Interaction limit of {INTERACTION_TURN_LIMIT} turns reached. Please
          refresh to start over.
        </Typography>
      )}
      <ModelsContainer>
        {Object.keys(messages).map((model) => (
          <ModelCard key={model}>
            <Typography variant="h6">{model}</Typography>
            <ChatContainer ref={chatRefs[model]}>
              {messages[model].map((msg, index) => (
                <MessageContainer key={index} isUser={msg.isUser}>
                  {!msg.isUser && <AIIcon />}
                  <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
                </MessageContainer>
              ))}
              {studentLoadingStates[model] ? (
                <RightAlignedSpinner>
                  <CircularProgress size={20} style={{ color: "#00ff00" }} />
                </RightAlignedSpinner>
              ) : loadingStates[model] ? (
                <MessageContainer>
                  <MessageBubble>
                    <CircularProgress size={20} style={{ color: "#fff" }} />
                  </MessageBubble>
                </MessageContainer>
              ) : null}
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
          disabled={limitReached}
        />
        <StyledIconButton onClick={handleSend} disabled={limitReached}>
          <SendIcon />
        </StyledIconButton>
      </TextInputSection>
    </MainContainer>
  );
};

export default EvalV2;
