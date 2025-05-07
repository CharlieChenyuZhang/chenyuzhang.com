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

const PrivacyModalContent = styled(Paper)`
  padding: 36px 28px;
  max-width: 480px;
  margin: 40px auto;
  border-radius: 30px;
  outline: none;
  text-align: center;
  background: #fff;
  color: #111;
  box-shadow: 8px 8px 0 #000, 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 4px solid #ff1744;
  font-family: "Comic Sans MS", "Chalkboard SE", cursive;
  position: relative;
  overflow: visible;

  &:before {
    content: "✨";
    position: absolute;
    left: -24px;
    top: -24px;
    font-size: 2.2rem;
    color: #ff1744;
    text-shadow: 2px 2px 0 #000;
    animation: ${comicShake} 2s infinite;
  }
  &:after {
    content: "✨";
    position: absolute;
    right: -24px;
    bottom: -24px;
    font-size: 2.2rem;
    color: #ff1744;
    text-shadow: 2px 2px 0 #000;
    animation: ${comicShake} 2s infinite reverse;
  }

  ul {
    text-align: left;
    margin: 18px 0 18px 0;
    padding-left: 28px;
    color: #111;
    font-size: 1.08rem;
    font-family: inherit;
    list-style: "✦ ";
  }

  li {
    margin-bottom: 10px;
    font-family: inherit;
    text-shadow: none;
  }

  b {
    color: #ff1744;
    text-shadow: none;
  }

  .privacy-header {
    font-family: "Bangers", "Comic Sans MS", cursive;
    color: #ff1744;
    font-size: 2.1rem;
    text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000,
      -1px 1px 0 #000, 1px 1px 0 #000;
    letter-spacing: 2px;
    margin-bottom: 10px;
    animation: ${comicShake} 2.5s infinite;
  }

  .privacy-btn {
    margin-top: 18px;
    background: #ff1744;
    color: #fff;
    font-weight: bold;
    border-radius: 15px;
    font-family: "Bangers", "Comic Sans MS", cursive;
    font-size: 1.2rem;
    border: 3px solid #000;
    box-shadow: 2px 2px 0 #000;
    text-shadow: none;
    padding: 8px 32px;
    transition: all 0.2s;
    &:hover {
      background: #ff5252;
      color: #fff;
      transform: scale(1.05) rotate(-2deg);
      box-shadow: 4px 4px 0 #000;
    }
  }
`;

const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;
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
  background: rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: 24px 18px;
  border: 3px solid #ffd700;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.7);
  color: #fff;
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
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
  background: #222;
  border-radius: 16px;
  border: 2px solid #ffd700;
  margin-bottom: 18px;
  padding: 18px 14px;
  box-shadow: 2px 2px 0 #000;
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  position: relative;

  &:hover {
    box-shadow: 4px 4px 0 #ffd700;
    border-color: #fff700;
  }

  h3 {
    font-family: "Bangers", "Comic Sans MS", cursive;
    color: #ffd700;
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  p {
    margin: 0;
    font-size: 1rem;
    color: #fff;
  }
`;

const ToggleIcon = styled.span`
  display: inline-block;
  font-size: 1.3em;
  margin-left: 6px;
  transition: transform 0.2s;
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
