import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Modal,
  Paper,
} from "@mui/material";
import { backendDomain } from "../../utils";
import selfHuggingImage from "./self-compassion/dinasour.png";

// Professional color palette
const colors = {
  background: "linear-gradient(135deg, #1a2233 0%, #232946 100%)",
  cardBg: "linear-gradient(135deg, #232946 0%, #2d3250 100%)",
  accent: "#1ec6b6", // teal
  accent2: "#e6b800", // gold
  text: "#f7f8fa",
  textSoft: "#bfc9d1",
  border: "#1ec6b6",
  border2: "#e6b800",
  shadow: "rgba(0,0,0,0.10)",
};

// Halftone background is now a subtle overlay
const halftoneBackground = `
  radial-gradient(circle at 100% 0%, ${colors.accent}10 2px, transparent 2px),
  radial-gradient(circle at 0% 100%, ${colors.accent2}10 2px, transparent 2px)
`;

// Use a modern, professional font
const mainFont = "Inter, Segoe UI, Arial, sans-serif";

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
  background: ${colors.background};
  color: ${colors.text};
  font-family: ${mainFont};
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
  font-family: ${mainFont};
  font-weight: 700;
  font-size: 2.1rem;
  color: ${colors.accent};
  text-align: center;
  margin: 32px 0 12px 0;
  letter-spacing: 1px;
`;

const ConversationFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 100px;
`;

const ConversationItem = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  align-items: flex-start;
  gap: 18px;
  width: 100%;
  position: relative;
`;

const CharacterContainer = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #232946;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px ${colors.shadow};
  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
    border-radius: 50%;
  }
`;

const SpeechBubble = styled.div`
  background: ${colors.cardBg};
  color: ${colors.text};
  padding: 18px 22px;
  border-radius: 18px;
  max-width: 420px;
  border: 1.5px solid ${colors.accent};
  font-family: ${mainFont};
  font-size: 1.05rem;
  margin: ${(props) => (props.isUser ? "0 12px 0 0" : "0 0 0 12px")};
  box-shadow: 0 2px 8px ${colors.shadow};
  position: relative;
`;

const TTSButton = styled(Button)`
  && {
    position: absolute;
    top: -10px;
    right: -10px;
    min-width: 36px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    padding: 0;
    background: ${colors.accent};
    border: 1.5px solid ${colors.border2};
    box-shadow: 0 1px 4px ${colors.shadow};
    color: #fff;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.18s ease;
    &:hover {
      background: ${colors.accent2};
      color: #232946;
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
  background: #232946ee;
  padding: 18px 0 18px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
  border-top: 2px solid ${colors.accent};
  box-shadow: 0 -2px 12px ${colors.shadow};
`;

const StyledTextField = styled(TextField)`
  && {
    & .MuiInputBase-root {
      color: ${colors.text};
      font-family: ${mainFont};
      border-radius: 10px;
      background: #232946;
      border: 1.5px solid ${colors.accent};
      box-shadow: 0 1px 4px ${colors.shadow};
      &:hover {
        box-shadow: 0 2px 8px ${colors.shadow};
      }
      &.Mui-focused {
        box-shadow: 0 2px 8px ${colors.shadow};
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
      color: ${colors.textSoft};
      font-family: ${mainFont};
    }
    textarea {
      font-family: ${mainFont};
      font-size: 1.05rem;
      padding: 12px;
      color: ${colors.text};
      &::placeholder {
        color: ${colors.accent};
        font-family: ${mainFont};
        letter-spacing: 0.5px;
        opacity: 1;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 800px;
`;

const ActionButton = styled(Button)`
  && {
    font-family: ${mainFont};
    font-size: 1.05rem;
    letter-spacing: 0.5px;
    padding: 7px 18px;
    border-width: 1.5px;
    border-radius: 10px;
    color: ${colors.accent};
    border-color: ${colors.accent};
    background: #232946;
    box-shadow: 0 1px 4px ${colors.shadow};
    transition: all 0.18s;
    &:hover {
      color: #232946;
      background: ${colors.accent};
      border-color: ${colors.accent2};
    }
    &:active {
      color: #fff;
      background: ${colors.accent2};
    }
  }
`;

const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 36px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
  }
`;

const LeftColumn = styled.div`
  flex: 2;
  min-width: 0;
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 320px;
  background: ${colors.cardBg};
  border-radius: 18px;
  padding: 22px 16px;
  border: 1.5px solid ${colors.accent2};
  box-shadow: 0 2px 8px ${colors.shadow};
  color: ${colors.text};
  font-family: ${mainFont};
  position: sticky;
  top: 30px;
  @media (max-width: 900px) {
    position: static;
    margin-top: 30px;
    min-width: 0;
    width: 100%;
  }
`;

const ModuleCard = styled.div`
  background: #232946;
  border-radius: 12px;
  border: 1.5px solid ${colors.accent2};
  margin-bottom: 16px;
  padding: 16px 12px;
  box-shadow: 0 1px 4px ${colors.shadow};
  color: ${colors.text};
  font-family: ${mainFont};
  cursor: pointer;
  transition: box-shadow 0.18s, border-color 0.18s;
  position: relative;
  &:hover {
    box-shadow: 0 2px 8px ${colors.accent};
    border-color: ${colors.accent};
  }
  h3 {
    font-family: ${mainFont};
    font-weight: 600;
    color: ${colors.accent2};
    margin: 0 0 8px 0;
    font-size: 1.08rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  p {
    margin: 0;
    font-size: 0.98rem;
    color: ${colors.textSoft};
  }
`;

const ToggleIcon = styled.span`
  display: inline-block;
  font-size: 1.1em;
  margin-left: 6px;
  color: ${colors.accent};
  transition: transform 0.18s;
  transform: ${({ expanded }) => (expanded ? "rotate(90deg)" : "rotate(0deg)")};
`;

const learningModules = [
  {
    week: 1,
    title: "Managing Cognitive Load in AI Content",
    summary:
      "Learn to recognize and manage cognitive load when engaging with AI material. Practice chunking, filtering, and journaling to avoid overload.",
    details: `Objectives: Introduce cognitive load theory and equip learners with strategies to avoid overload when engaging with AI-related material. By week's end, participants will recognize the limits of working memory and practice techniques to reduce extraneous load in dense content.\n\nKey Topics & Materials: Cognitive Load Theory (working memory limits, intrinsic vs extraneous load); Information Overload in AI; multimedia lesson on cognitive load; infographic on working memory capacity; reading on "AI information overload" with examples.\n\nLearning Activities:\n- Interactive Case Scenario: Step through a scenario where an entrepreneur is bombarded with AI articles. Identify overload points and triage information.\n- Microlearning Modules: Short modules on chunking, note-taking, dual coding, each with a quiz.\n- Reflective Journal: Daily log of experiences with AI content, using guided prompts.\n- Synchronous Session: Live workshop to collaboratively apply load-reducing techniques to a dense AI article.\n\nAssessment & Reflection:\n- End-of-week quiz on core concepts.\n- Practical summary/mind-map assignment.\n- Peer review of a peer's summary.\n- Self-reflection journal prompt.`,
  },
  {
    week: 2,
    title: "Critically Filtering AI Information",
    summary:
      "Develop a framework to evaluate the credibility and relevance of AI news and research. Practice using rubrics and peer review.",
    details: `Objectives: Develop critical evaluation skills using a transferable framework to filter AI-related information. By the end, learners can apply a rubric to judge credibility and relevance of AI news, research, or content.\n\nKey Topics & Materials: Information Literacy Frameworks; source evaluation rubric (e.g. CRAAP test); pitfalls in AI reporting; cognitive biases.\n\nLearning Activities:\n- Rubric Guided Evaluation: Interactive walkthrough evaluating a sample AI article.\n- Compare & Contrast: Analyze three sources (research, blog, news) and fill a comparison table.\n- Reflective Journal: Reflect on how you decide if a source is trustworthy.\n- Spaced Repetition Quiz: Recall questions from Week 1 and new content.\n- Synchronous Session: Live expert panel and group fact-checking exercise.\n\nAssessment & Peer Review:\n- Source evaluation report using the rubric.\n- Peer review of two peers' reports.\n- Self-reflection journal entry.`,
  },
  {
    week: 3,
    title: "Designing a Personalized Information Management Toolkit",
    summary:
      "Build your own toolkit of strategies and apps to manage AI information, tailored to your needs. Draft, share, and refine your plan.",
    details: `Objectives: Guide learners to create a personal toolkit of strategies, workflows, and technology tools for managing AI information. By week's end, participants have a prototype of their information management system.\n\nKey Topics & Materials: Personal Knowledge Management (PKM) principles; toolkit menu of recommended tools (Anki, Pocket, Notion, etc.); case studies.\n\nLearning Activities:\n- Toolkit Exploration: Try at least 2 new tools or methods.\n- Design Challenge: Draft a personalized information management plan using an interactive template.\n- Journaling: Reflect on tool/strategy preferences.\n- Spaced Review: Flashcards from Weeks 1–2 and new terms.\n- Synchronous Session: Guest talk and toolkit show-and-tell.\n\nAssessment:\n- Draft toolkit submission.\n- Peer feedback with a checklist.\n- Self-evaluation of toolkit.`,
  },
  {
    week: 4,
    title: "Reflective Practice & Metacognitive Enhancement",
    summary:
      "Reflect on your learning journey, finalize your toolkit, and develop habits for lifelong learning and information management.",
    details: `Objectives: Culminate with reflective practice to deepen metacognitive awareness and finalize the personal toolkit project.\n\nKey Topics & Materials: Metacognition and reflective practice; techniques like Gibbs Reflective Cycle; sustaining reflection post-course.\n\nLearning Activities:\n- Final Journal Entry: Synthesize learning and describe pivotal moments.\n- Metacognitive Exercise: Self-assessment inventory.\n- Culminating Project: Finalize and present toolkit.\n- Spaced Repetition Review: Capstone quiz on all modules.\n- Synchronous Session: Toolkit showcase and course retrospective.\n\nAssessment:\n- Final toolkit presentation (graded).\n- Reflective essay.\n- Self & peer assessment of collaboration.`,
  },
];

function LearningModulesSidebar() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div>
      <h2
        style={{
          fontFamily: '"Bangers", "Comic Sans MS", cursive',
          color: "#FFD700",
          marginBottom: 16,
        }}
      >
        Learning Modules
      </h2>
      {learningModules.map((mod, idx) => {
        const expanded = openIndex === idx;
        return (
          <ModuleCard
            key={mod.week}
            onClick={() => setOpenIndex(expanded ? null : idx)}
            tabIndex={0}
            aria-expanded={expanded}
            aria-controls={`module-details-${mod.week}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenIndex(expanded ? null : idx);
            }}
          >
            <h3>
              Week {mod.week}: {mod.title}
              <ToggleIcon expanded={expanded}>
                {expanded ? "▼" : "▶"}
              </ToggleIcon>
            </h3>
            <p>{mod.summary}</p>
            {expanded && (
              <div
                id={`module-details-${mod.week}`}
                style={{
                  marginTop: 12,
                  background: "#181818",
                  borderRadius: 10,
                  padding: "12px 10px",
                  border: "1px solid #FFD700",
                  color: "#ffe",
                  fontSize: "0.98em",
                  whiteSpace: "pre-line",
                  boxShadow: "1px 1px 0 #000",
                }}
              >
                {mod.details}
              </div>
            )}
          </ModuleCard>
        );
      })}
    </div>
  );
}

const ProjectBetterTogether = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [loadingTTSIds, setLoadingTTSIds] = useState(new Set());
  const [privacyOpen, setPrivacyOpen] = useState(true);

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
      const tutorResponse = await fetch(`${backendDomain()}/t543-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText,
          conversation: newConversation,
        }),
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
      <ComicHeader>How to Learn (Almost) Anything</ComicHeader>
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
          Course Project for EDU T543: Applying Cognitive Science to Learning
          and Teaching
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Author: Chenyu Zhang
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Version: v0.0.1
        </Typography>
      </Box>
      <TwoColumnLayout>
        <LeftColumn>
          <ConversationFlow>
            {conversation.length === 0 && !loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "320px",
                  padding: "32px 0 24px 0",
                  textAlign: "center",
                  color: colors.textSoft,
                  background: "rgba(30,198,182,0.04)",
                  borderRadius: "18px",
                  boxShadow: `0 2px 12px ${colors.shadow}`,
                  border: `1.5px dashed ${colors.accent}`,
                  marginBottom: "18px",
                  animation: "fadeIn 0.7s",
                }}
              >
                <img
                  src={selfHuggingImage}
                  alt="Mascot"
                  style={{
                    width: 90,
                    height: 90,
                    marginBottom: 18,
                    filter: "drop-shadow(0 2px 8px #1ec6b6aa)",
                  }}
                />
                <div
                  style={{
                    fontSize: "1.18rem",
                    fontWeight: 600,
                    color: colors.accent,
                    marginBottom: 8,
                  }}
                >
                  Welcome! 👋
                </div>
                <div
                  style={{
                    fontSize: "1.04rem",
                    color: colors.textSoft,
                    maxWidth: 420,
                  }}
                >
                  This is your learning companion. <br />
                  <span style={{ color: colors.accent2 }}>
                    Share a learning challenge, question, or insight
                  </span>{" "}
                  below to get started.
                  <br />
                  You can type or use the <b>🎤 SPEAK!</b> button.
                </div>
              </div>
            )}
            {conversation.map((msg, index) => (
              <ConversationItem key={index} isUser={msg.isUser}>
                {!msg.isUser && (
                  <CharacterContainer isUser={msg.isUser}>
                    <img
                      src={selfHuggingImage}
                      alt="Self Compassion Character"
                    />
                  </CharacterContainer>
                )}
                {msg.isUser ? (
                  <SpeechBubble isUser={msg.isUser}>{msg.text}</SpeechBubble>
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
              placeholder="Share a learning challenge, question, or insight..."
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
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                sx={{ color: "#FF69B4", borderColor: "#FF69B4" }}
              >
                {isRecording ? "🎯 STOP!" : "🎤 SPEAK!"}
              </ActionButton>
            </ButtonGroup>

            <audio ref={audioRef} />
          </InputContainer>
        </LeftColumn>
        <RightColumn>
          <LearningModulesSidebar />
        </RightColumn>
      </TwoColumnLayout>
    </MainContainer>
  );
};

export default ProjectBetterTogether;
