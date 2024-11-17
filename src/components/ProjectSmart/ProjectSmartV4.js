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
  flex-direction: column;
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

const ButtonGroup = styled.div``;

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null); // Ref for audio playback
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [loadingTTS, setLoadingTTS] = useState(false);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) =>
        audioChunks.push(event.data);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await handleTranscribe(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      setThought(data.text ?? "");
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleChange = (e) => {
    setThought(e.target.value ?? "");
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

  const handleEmbodimentSubmit = async () => {
    if (!thought.trim()) return;

    const imgPrompt = `Embodiment prompt: ${thought}`;
    setLoading(true);

    // Add the user's input to the conversation
    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const response = await fetch(`${backendDomain()}/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText: imgPrompt }),
      });

      const data = await response.json();
      const { embodimentResponseMsg, imageUrl } = data;

      // Add the embodiment response message and image to the conversation
      setConversation((prev) => [
        ...prev,
        { imageUrl, isUser: false }, // show the img first. Order matters here.
        { text: embodimentResponseMsg, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching embodiment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentalModelSubmit = async () => {
    if (!thought.trim()) return;

    const inputText = `Thought: ${thought}`;
    setLoading(true);

    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const tutorResponse = await fetch(`${backendDomain()}/mental-model`, {
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
  const handleReframeSubmit = async () => {
    if (!thought.trim()) return;

    const inputText = `Thought: ${thought}`;
    setLoading(true);

    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const tutorResponse = await fetch(`${backendDomain()}/reframe`, {
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
    if (what2Speak) {
      setLoadingTTS(true);
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
      } finally {
        setLoadingTTS(false);
      }
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        {/* <Typography variant="h4" align="center" gutterBottom>
          SMART Journaling
        </Typography> */}
        <ChatContainer ref={chatContainerRef}>
          {conversation.map((msg, index) => (
            <MessageContainer key={index} isUser={msg.isUser}>
              {!msg.isUser && <AiIcon>✧₊⁺</AiIcon>}{" "}
              {/* AI icon next to message */}
              <MessageBubble isUser={msg.isUser}>
                {msg.text && <span>{msg.text}</span>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Embodiment Response"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginTop: msg.text ? "8px" : "0",
                    }}
                  />
                )}
              </MessageBubble>
              {!msg.isUser && msg.text && (
                <SpeakerIcon onClick={() => handlePlayTTS(msg.text)}>
                  {loadingTTS ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    "၊၊||၊"
                  )}
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
            placeholder="What's on your mind today? Reflect freely..."
            variant="outlined"
            value={thought}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ marginRight: "10px" }}
          />

          <ButtonGroup>
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

            {/* record button */}
            <Button
              variant="outlined"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
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
              {isRecording ? <>🔴 stop recording</> : <>◉ start Recording</>}
            </Button>

            <Button
              variant="outlined"
              onClick={handleEmbodimentSubmit}
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
              Embody
            </Button>

            <Button
              variant="outlined"
              onClick={handleReframeSubmit}
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
              Reframe
            </Button>

            <Button
              variant="outlined"
              onClick={handleMentalModelSubmit}
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
              Mental Model
            </Button>
          </ButtonGroup>

          <audio ref={audioRef} />
        </InputContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ProjectSmart;
