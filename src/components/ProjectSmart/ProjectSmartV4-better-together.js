import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { backendDomain } from "../../utils";
import selfHuggingImage from "./self-compassion/self-hugging.png";

const halftoneBackground = `
  radial-gradient(circle at 100% 0%, rgba(255,255,255,0.12) 2px, transparent 2px),
  radial-gradient(circle at 0% 100%, rgba(255,255,255,0.12) 2px, transparent 2px)
`;

const comicShake = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(1px, 1px) rotate(0.5deg); }
  75% { transform: translate(-1px, -1px) rotate(-0.5deg); }
`;

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background-image: ${halftoneBackground};
  background-size: 30px 30px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ComicHeader = styled.div`
  font-family: "Bangers", "Comic Sans MS", cursive;
  font-size: 2.5rem;
  color: #fff;
  text-align: center;
  margin: 20px 0;
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000,
    -1px 1px 0 #000, 1px 1px 0 #000;
  letter-spacing: 2px;
  animation: ${comicShake} 2.5s infinite;
`;

const ConversationFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 100px;
`;

const ConversationItem = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  align-items: center;
  gap: 20px;
  width: 100%;
  position: relative;
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  &:before {
    content: "${(props) => (props.isUser ? "YOU" : "AI")}";
    position: absolute;
    ${(props) => (props.isUser ? "right" : "left")}: 10px;
    top: -25px;
    font-family: "Bangers", "Comic Sans MS", cursive;
    color: ${(props) => (props.isUser ? "#FFD700" : "#FF69B4")};
    font-size: 1.2rem;
    text-shadow: 2px 2px 0 #000;
    transform: rotate(${(props) => (props.isUser ? "2deg" : "-2deg")});
  }

  @media (max-width: 768px) {
    flex-direction: column;
    ${(props) =>
      props.isUser ? "align-items: flex-end" : "align-items: flex-start"};
  }
`;

const CharacterContainer = styled.div`
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  transform: scale(0.9);
  transition: transform 0.3s ease;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${halftoneBackground};
    background-size: 10px 10px;
    mix-blend-mode: overlay;
    opacity: 0.1;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1) rotate(${(props) => (props.isUser ? "2deg" : "-2deg")});
    animation: ${comicShake} 0.5s;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
`;

const UserMessageDecorator = styled.div`
  position: relative;

  &:before,
  &:after {
    content: "✦";
    position: absolute;
    font-size: 1.5rem;
    color: #ffd700;
    animation: ${sparkle} 2s infinite;
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }

  &:before {
    right: -25px;
    top: 0;
    animation-delay: 0.3s;
  }

  &:after {
    right: -15px;
    bottom: 0;
    animation-delay: 0.6s;
  }
`;

const SpeechBubble = styled.div`
  background-color: white;
  color: black;
  padding: 25px;
  border-radius: 30px;
  max-width: 400px;
  position: relative;
  border: 3px solid black;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
  font-size: 16px;
  margin: ${(props) => (props.isUser ? "0 20px 0 0" : "0 0 0 20px")};
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
  transform: rotate(${(props) => (props.isUser ? "1deg" : "-1deg")});
  background: ${(props) =>
    props.isUser ? "linear-gradient(135deg, #fff 0%, #fff8e1 100%)" : "white"};
  transform-origin: ${(props) => (props.isUser ? "right" : "left")} center;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
  
  &:before {
    content: '';
    position: absolute;
    ${(props) => (props.isUser ? "right: -22px" : "left: -22px")};
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: none;
    background: white;
    clip-path: ${(props) =>
      props.isUser
        ? "polygon(0 0, 0% 100%, 100% 50%)"
        : "polygon(100% 0, 100% 100%, 0 50%)"};
    width: 22px;
    height: 22px;
    background: ${(props) =>
      props.isUser
        ? "linear-gradient(135deg, #fff 0%, #fff8e1 100%)"
        : "white"};
  }

  &:after {
    content: '';
    position: absolute;
    ${(props) => (props.isUser ? "right: -22px" : "left: -22px")};
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    background: transparent;
    border: 3px solid black;
    border-${(props) => (props.isUser ? "left" : "right")}: 0;
    border-${(props) => (props.isUser ? "right" : "left")}: 3px solid black;
    clip-path: ${(props) =>
      props.isUser
        ? "polygon(-1px -1px, -1px 26px, 26px 13px)"
        : "polygon(26px -1px, 26px 26px, -1px 13px)"};
  }

  ${(props) =>
    props.isUser &&
    `
    &:hover {
      transform: scale(1.02) rotate(1deg);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8),
                 0 0 20px rgba(255, 215, 0, 0.2);
      
      &:before {
        background: linear-gradient(135deg, #fff 0%, #fff8e1 100%);
      }
    }
    
    &:after {
      border-color: black;
    }
  `}

  ${(props) =>
    !props.isUser &&
    `
    &:hover {
      transform: scale(1.02) rotate(-1deg);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
    }
  `}

  /* Add position relative for TTS button positioning */
  position: relative;
`;

const TTSButton = styled(Button)`
  && {
    position: absolute;
    top: -15px;
    right: -15px;
    min-width: 40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    background: #ff69b4;
    border: 3px solid black;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(0deg);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1) rotate(-5deg);
      background: #ff1493;
    }

    &:disabled {
      background: #ccc;
      color: #666;
    }
  }
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.95);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 10;
  backdrop-filter: blur(10px);
  border-top: 3px solid #ffd700;
  box-shadow: 0 -4px 20px rgba(255, 215, 0, 0.2);
  animation: ${popIn} 0.5s ease-out forwards;
`;

const StyledTextField = styled(TextField)`
  && {
    & .MuiInputBase-root {
      color: #fff;
      font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
      transition: all 0.3s ease;
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.05);
      border: 3px solid #ffd700;
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8);
      }

      &.Mui-focused {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8);
      }
    }

    & .MuiOutlinedInput-root {
      & fieldset {
        border: none;
      }

      &:hover fieldset {
        border: none;
      }

      &.Mui-focused fieldset {
        border: none;
      }
    }

    & .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.7);
      font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
    }

    textarea {
      font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
      font-size: 1.1rem;
      padding: 15px;
      color: #ffffff;

      &::placeholder {
        color: rgba(255, 215, 0, 0.7);
        font-family: "Bangers", "Comic Sans MS", cursive;
        letter-spacing: 1px;
        opacity: 1;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  position: relative;

  &:before {
    content: "✨";
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: ${comicShake} 2s infinite;
  }

  &:after {
    content: "✨";
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    animation: ${comicShake} 2s infinite reverse;
  }
`;

const ActionButton = styled(Button)`
  && {
    font-family: "Bangers", "Comic Sans MS", cursive;
    font-size: 1.1rem;
    letter-spacing: 1px;
    padding: 8px 20px;
    border-width: 3px;
    border-radius: 15px;
    text-shadow: 1px 1px 0 #000;
    position: relative;
    overflow: hidden;

    &:before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 60%
      );
      transform: scale(0);
      transition: transform 0.3s ease-out;
    }

    &:hover:before {
      transform: scale(1);
    }

    &:hover {
      transform: translateY(-3px) rotate(-1deg);
      box-shadow: 0 6px 12px rgba(255, 215, 0, 0.3);
    }

    &:active {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

const EqualContributionNote = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:before,
  &:after {
    content: "✦";
    color: #ffd700;
    font-size: 1rem;
  }
`;

const ProjectBetterTogether = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [loadingTTSIds, setLoadingTTSIds] = useState(new Set());

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
      const tutorResponse = await fetch(
        `${backendDomain()}/better-together-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputText,
            conversation: newConversation,
          }),
        }
      );

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

  const handlePlayTTS = async (what2Speak, messageId) => {
    if (what2Speak) {
      setLoadingTTSIds((prev) => new Set([...prev, messageId]));
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
        setLoadingTTSIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }
    }
  };

  return (
    <MainContainer>
      <ComicHeader>Self-Compassion Journal</ComicHeader>

      <Box
        sx={{
          marginTop: "20px",
          padding: "15px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          Course Project for EDU T560: Universal Design for Learning
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Team Better Together
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Chenyu Zhang, Jessy Lu, Janice Mason
        </Typography>
        <EqualContributionNote>
          ★ These authors contributed equally to this work ★
        </EqualContributionNote>
        <Typography variant="caption" display="block" gutterBottom>
          software version: v4.1.0
        </Typography>
      </Box>
      <ConversationFlow>
        {conversation.map((msg, index) => (
          <ConversationItem key={index} isUser={msg.isUser}>
            {!msg.isUser && (
              <CharacterContainer isUser={msg.isUser}>
                <img src={selfHuggingImage} alt="Self Compassion Character" />
              </CharacterContainer>
            )}
            {msg.isUser ? (
              <UserMessageDecorator>
                <SpeechBubble isUser={msg.isUser}>{msg.text}</SpeechBubble>
              </UserMessageDecorator>
            ) : (
              <SpeechBubble isUser={msg.isUser}>
                {msg.text}
                <TTSButton
                  onClick={() => handlePlayTTS(msg.text, index)}
                  disabled={loadingTTSIds.has(index)}
                >
                  {loadingTTSIds.has(index) ? "..." : "🔊"}
                </TTSButton>
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Response Image"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginTop: "10px",
                      border: "3px solid black",
                      boxShadow: "4px 4px 0 rgba(0,0,0,0.8)",
                    }}
                  />
                )}
              </SpeechBubble>
            )}
          </ConversationItem>
        ))}

        {loading && (
          <ConversationItem isUser={false}>
            <CharacterContainer>
              <img src={selfHuggingImage} alt="Self Compassion Character" />
            </CharacterContainer>
            <SpeechBubble isUser={false}>
              <CircularProgress size={20} color="inherit" />
              {" THINKING..."}
            </SpeechBubble>
          </ConversationItem>
        )}
      </ConversationFlow>

      <InputContainer>
        <StyledTextField
          placeholder="What's on your mind today? POW! Let it out..."
          variant="outlined"
          value={thought}
          onChange={handleChange}
          multiline
          rows={2}
          sx={{ width: "100%", maxWidth: "800px" }}
        />

        <ButtonGroup>
          <ActionButton
            variant="outlined"
            onClick={handleSubmit}
            disabled={!thought.trim()}
            sx={{ color: "#FFD700", borderColor: "#FFD700" }}
          >
            SEND! 💥
          </ActionButton>
          <ActionButton
            variant="outlined"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            sx={{ color: "#FF69B4", borderColor: "#FF69B4" }}
          >
            {isRecording ? "🎯 STOP!" : "🎤 SPEAK!"}
          </ActionButton>
        </ButtonGroup>

        <audio ref={audioRef} />
      </InputContainer>
    </MainContainer>
  );
};

export default ProjectBetterTogether;
