import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { backendDomain } from "../../utils";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  border: 1px solid #fff;
  border-radius: 8px;
  background-color: #111;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  height: 50vh;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 8px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const AiIcon = styled.div`
  font-size: 1.5rem;
  margin-top: -4px;
  margin-right: ${(props) => (props.isUser ? "0" : "8px")};
  margin-left: ${(props) => (props.isUser ? "8px" : "0")};
`;

const SpeakerIcon = styled.div`
  font-size: 1.5rem;
  margin-top: -4px;
  cursor: pointer;
  margin-right: ${(props) => (props.isUser ? "8px" : "0")};
  margin-left: ${(props) => (props.isUser ? "0" : "8px")};
  color: ${(props) => (props.isUser ? "#fff" : "#ccc")};
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.isUser ? "#000" : "#222")};
  color: #fff;
  border: 1px solid #fff;
  border-radius: 12px;
  padding: 10px 15px;
  max-width: 75%;
  white-space: pre-line;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    color: #fff;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #fff;
    }
    &:hover fieldset {
      border-color: #ccc;
    }
    &.Mui-focused fieldset {
      border-color: #fff;
    }
  }
  & .MuiInputLabel-root {
    color: #fff;
  }
  width: 100%;
`;

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null); // Ref for audio playback

  const handleChange = (e) => {
    setThought(e.target.value);
  };

  const handleSubmit = async () => {
    if (!thought.trim()) return;

    const inputText = `Thought: ${thought}`;
    setLoading(true);

    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const tutorResponse = await fetch(`${backendDomain()}/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const tutorData = await tutorResponse.json();
      setConversation((prev) => [
        ...prev,
        { text: tutorData.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching the tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handlePlayTTS = async (what2Speak) => {
    if (what2Speak && what2Speak) {
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            voice: "alloy",
            input: what2Speak,
          }),
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error with TTS:", error);
      }
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <Typography variant="h4" align="center" gutterBottom>
          SMART Journaling
        </Typography>
        <ChatContainer ref={chatContainerRef}>
          {conversation.map((msg, index) => (
            <MessageContainer key={index} isUser={msg.isUser}>
              {!msg.isUser && <AiIcon>✧₊⁺</AiIcon>}{" "}
              {/* AI icon next to top of message */}
              <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
              {!msg.isUser && (
                <SpeakerIcon onClick={() => handlePlayTTS(msg.text)}>
                  ၊၊||၊
                </SpeakerIcon>
              )}
            </MessageContainer>
          ))}
          {loading && (
            <MessageContainer isUser={false}>
              <AiIcon>✧₊⁺</AiIcon>
              <MessageBubble>
                <CircularProgress size={20} color="inherit" />
                {" Processing..."}
              </MessageBubble>
            </MessageContainer>
          )}
        </ChatContainer>
        <InputContainer>
          <StyledTextField
            placeholder="Type your thought here..."
            variant="outlined"
            value={thought}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ marginRight: "10px" }}
          />
          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={!thought.trim()}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { backgroundColor: "grey" },
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.5)", // Lighter color for disabled text
                borderColor: "rgba(255, 255, 255, 0.5)", // Lighter color for disabled border
              },
            }}
          >
            Send
          </Button>
          <audio ref={audioRef} />
        </InputContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ProjectSmart;
