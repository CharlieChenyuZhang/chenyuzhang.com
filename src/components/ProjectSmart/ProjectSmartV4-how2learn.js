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
    details: `
Cognitive Load Theory: Our working memory has a limited capacity to process information at any given moment. When we attempt to absorb too much, such as reviewing multiple AI research updates in one sitting, cognitive overload can occur—leading to stress, confusion, and forgetfulness. The objective is to minimize unnecessary mental workload so that we can focus on the most essential information.

Chunking Information: Chunking refers to the strategy of breaking down large amounts of information into smaller, meaningful units. This technique improves comprehension and long-term memory by reducing the number of elements our working memory needs to manage at once. For instance, rather than reading an entire whitepaper in one session, you can divide it into sections—like background, methods, and conclusions—and review them separately. This helps prevent cognitive overload and supports focused attention.

Filtering and Focus: Filtering allows learners to prioritize and engage only with the most relevant information. Research supports that setting clear goals for information consumption—such as focusing solely on AI topics related to healthcare for a week—helps reduce cognitive burden. Additionally, turning off notifications and ignoring non-essential information further reduces distractions and supports deeper processing of key content.

Journaling for Cognitive Offload: Writing down ideas is a powerful way to externalize thoughts and free up working memory. By keeping an "AI learning journal," learners can summarize key points, record personal insights, and raise questions. This practice not only helps retain information but also reduces the mental load from juggling too many concepts internally, thus making space for reflection and understanding.

Tools & Resources:
- Note-Taking Apps: Use tools like Notion, Evernote, or OneNote to create bite-sized chunks of content. These platforms support tagging, organization, and ease of review, which all facilitate better cognitive offload.
- Time Management Tools: Tools like Pomodoro timers (e.g., Focus To-Do) help regulate how long learners spend on cognitively demanding tasks. A 25-minute reading session followed by a 5-minute break reduces fatigue and improves focus.
- Readability Aids: Browser features such as Reader View or extensions like Mercury Reader eliminate visual clutter, making digital reading less cognitively demanding and more accessible.
- Mind-Mapping Tools: Visual learners may benefit from using apps like XMind or MindMeister to break down complex topics. By visually organizing podcast takeaways or research summaries into diagrams, learners can better comprehend and retain information.
`,
  },
  {
    week: 2,
    title: "Critically Filtering AI Information",
    summary:
      "Develop a framework to evaluate the credibility and relevance of AI news and research. Practice using rubrics and peer review.",
    details: `
      The Challenge of Misinformation: Not all AI information is created equal. Some sources are reliable and well-researched, while others are speculative, biased, or incorrect. Consuming low-quality or irrelevant content not only wastes time but can also lead to poor decisions. This week's module introduces strategies to critically evaluate AI-related information and focus only on credible, useful sources.
      
      CRAAP Test – A Framework for Source Evaluation: The CRAAP test helps assess the quality of information using five criteria:
      - Currency: Is the information up-to-date? For AI, newer content is often more relevant.
      - Relevance: Does it address your specific needs or questions?
      - Authority: Who wrote or published it? Is the author credible in the AI field?
      - Accuracy: Are claims supported by evidence or references?
      - Purpose: Why was the content created – to inform, persuade, sell, or entertain? Identifying bias is key.
      
      Using this checklist can help filter out unreliable sources. For example, an outdated, unsupported article from an obscure site likely fails multiple CRAAP criteria and can be safely ignored.
      
      Lateral Reading – Thinking Like a Fact-Checker: Rather than reading a questionable source top to bottom, open additional tabs to check what other sources say. Fact-checkers do this by verifying authors, claims, and context externally. If a claim about AI isn't confirmed by reputable news or is debunked by Snopes or similar sites, treat it with skepticism. Searching the author's background can also reveal expertise (or lack thereof).
      
      Peer Review & Skeptical Mindset: Academic work is vetted by experts before publication. You can mimic this by asking colleagues for a second opinion on bold AI claims. Discussing articles helps uncover new perspectives and identify flaws. The aim is to cultivate healthy skepticism, not cynicism—question sources, verify facts, and refine your internal filter to recognize trustworthy information.
      
      Tools & Resources:
      - CRAAP Test Checklist: A structured rubric for evaluating information based on the five CRAAP categories. Keep this nearby while reviewing articles.
      - Wikipedia and WikiData: Quickly check unknown authors or organizations. Wikipedia often includes background, biases, or controversies about sources.
      - Fact-Checking Sites: Tools like Snopes, PolitiFact, and FactCheck.org can help verify viral or sensational AI stories. Google's Fact Check Explorer is another helpful resource.
      - Browser Extensions: Install tools like NewsGuard to assess source reliability at a glance. These tools flag untrustworthy websites with visual indicators.
      - Critical Reading Tools: Use Hypothesis to annotate and discuss articles collaboratively. Marking up AI content with notes like "citation?" or "biased language" turns passive reading into an analytical activity.
      `,
  },
  {
    week: 3,
    title: "Designing a Personalized Information Management Toolkit",
    summary:
      "Build your own toolkit of strategies and apps to manage AI information, tailored to your needs. Draft, share, and refine your plan.",
    details: `
      Why You Need a Toolkit: In previous weeks, we explored managing cognitive overload and critically evaluating AI information. Now, it's time to build your personal information management toolkit—a system of tools and habits that supports you daily. Instead of ad-hoc browsing and scattered bookmarks, you'll design a structured, repeatable approach that reduces decision fatigue and ensures important content isn't lost. A well-built toolkit helps you curate trustworthy sources, organize what you keep, and schedule regular time to process what matters. Your toolkit will be unique to your role, preferences, and workflow.
      
      Core Components of an Information Management System:
      1. Curated Sources: Select a few high-quality, relevant sources. For instance, subscribe to a weekly newsletter, follow two trusted AI blogs, and join a LinkedIn group in your field. Focus on subdomains—like AI in healthcare—and ignore irrelevant topics. The goal is to filter proactively and create a consistent information stream.
      
      2. Aggregation & Delivery: Use tools like Feedly (RSS reader) to centralize updates from your sources in one place. Email newsletters are also helpful for inbox delivery. If you prefer social media, make lists on Twitter or LinkedIn and view them with tools like TweetDeck to reduce distraction. Aggregation cuts noise and keeps your intake intentional.
      
      3. Organization & Storage: Choose how you'll store and revisit important items. Options include:
      - Notion, Evernote, or OneNote for notes and summaries, organized in folders or databases.
      - Zotero or Mendeley for academic papers, with tagging, annotations, and citation management.
      - Pocket or Instapaper to save articles for later reading—preventing browser tab chaos.
      - Trello or Todoist to manage "to-read" articles as tasks—ideal if you process lots of content systematically.
      
      4. Workflow & Habits: Tools only work if paired with habits. Set dedicated times to read, save, and reflect. For example: "Check Feedly every morning from 8:00–8:30, save to Pocket, review notes on Friday." Add calendar blocks for "AI reading" and prune your sources monthly. Your toolkit should evolve as your needs change.
      
      5. Choosing the Right Tools: Pick tools that align with your routine and preferences. Simpler is better—avoid setting up tools you won't actually use. If you already use Outlook, leverage its RSS reader. If you prefer Slack, create a peer-sharing channel. Build from your existing habits and enhance as needed.
      
      Example Toolkit:
      - Sources: AI Weekly, Google Alert for "AI in healthcare," arXiv Sanity.
      - Aggregation: Feedly for blogs, YouTube playlist for conference talks.
      - Organization: Notion for summaries, Zotero for papers.
      - Workflow: Save daily, review weekly, journal insights.
      - Tools: Feedly, Pocket, Notion, Zotero, Google Calendar.
      
      Tools & Resources:
      - Feedly: An RSS reader for collecting and centralizing updates.
      - Notion: A flexible workspace for note-taking and organizing reading.
      - Zotero: A reference manager for saving and tagging academic papers.
      - Pocket: A read-it-later tool with tagging and offline access.
      - Trello/Todoist: Task management tools adapted for reading workflows.
      - Toolkit Planning Template: A worksheet or Notion template to guide your personalized toolkit setup.
      
      The ultimate goal is to design a toolkit that fits your lifestyle, helps you avoid overload, and supports continuous learning. Start simple, write it down, and iterate.
      `,
  },
  {
    week: 4,
    title: "Reflective Practice & Metacognitive Enhancement",
    summary:
      "Reflect on your learning journey, finalize your toolkit, and develop habits for lifelong learning and information management.",
    details: `
The Importance of Reflection: Reflection is essential for deep learning and long-term growth. It moves you beyond simply collecting tips and tools, enabling you to process how and why you use them. Reflection is a form of metacognition—thinking about your own thinking—which enhances self-awareness and supports adaptive learning strategies. In our context, it helps you recognize when you're overwhelmed and what steps to take. Over the past three weeks, you've experimented with techniques like chunking, filtering, and building a toolkit. Now is the time to evaluate: What's working? What isn't? For example, you may find journaling helped offload stress, or that limiting sources via Feedly improved your focus.

Metacognitive Questions: To engage in reflective practice, ask yourself: "Is my approach effective? What am I learning from this? What could I improve?" These questions help you monitor and refine your learning strategies. If AI headlines frequently distract you, consider what's triggering that and adjust—maybe disable notifications (Week 1) or focus more intentionally on relevant topics (Week 2). The aim is not self-criticism but self-optimization.

Habits and Continuous Improvement: The real power of your toolkit emerges when its use becomes habitual. Simply owning tools like Pocket or Feedly won't help unless you integrate them into regular routines. Habit formation research shows that tracking behaviors—like checking off a daily reading session—boosts consistency. Even marking an "X" on a calendar can be a motivating cue. Over time, tracking builds awareness and accountability.

Examples of Habits to Cultivate:
- Scheduled Learning Time: Designate blocks of time for consuming AI content, e.g., 30 minutes every Tuesday and Thursday.
- Regular Reflection: Set aside 5–10 minutes weekly to write a short recap—What did I learn? Did I feel overloaded?
- Toolkit Maintenance: Prune your sources and clean up bookmarks monthly.
- Mindfulness Breaks: After focused work, take 1–2 minute breaks to reset. This helps manage cognitive fatigue and promotes mental clarity.

Adjusting Mindset – Lifelong Learning: It's normal to feel like you can't keep up with all AI news—and that's okay. Even experts miss things. Accepting that you'll never know everything is freeing. Instead, commit to continuous learning. Your toolkit and habits will help you absorb what matters most and ignore the rest. If something important happens, your network or curated sources will bring it back to your attention. Shift from fear of missing out (FOMO) to trust in your system.

Metacognitive Enhancement: Build self-reflection into your process. When reading a dense paper, pause and ask: "Should I chunk this?" When stressed by unread tabs, ask: "Am I subscribing to too much?" Over time, you'll spot patterns—like overwhelm or distraction—and apply fixes automatically, such as journaling or taking a break. This is how metacognitive habits turn into resilience.

Tools & Resources:
- Habit Tracking Apps: Try Habitica (gamified), Loop (Android), or Streaks (iOS). Or use paper, spreadsheets, or bullet journals. The key is visible, regular tracking.
- Journaling Tools: Use apps like Day One or Journey for digital journaling. Or create a reflection section in Notion or Evernote. These apps allow tagging and timeline views to review progress.
- Mindfulness & Focus Aids: Explore apps like Headspace or Calm for guided breathing and stress relief. Even a short breathing exercise after reading sessions can reset cognitive load.
- Community & Continued Learning: Consider joining a Slack, Discord, or Reddit group where AI professionals share top picks. Use community insight as a filter, not a distraction. Check forums weekly—not constantly.
- Lifelong Learning Resources: Explore books like *Make It Stick*, *The Organized Mind* (Levitin), or *Digital Minimalism* (Newport). These provide deeper insights into information management, cognitive load, and learning habits.
- Support System: People are part of your toolkit. Identify a mentor or colleague who stays updated on AI and touch base periodically. A quarterly chat can help you reflect and stay informed.

The core message of Week 4: don't just consume—reflect. Deepen your self-awareness, cultivate sustainable habits, and trust in your ability to adapt. That's the real key to thriving in an AI-saturated world.
`,
  },
];

const LearningModulesModal = ({ open, onClose, initialIndex = 0 }) => {
  const [current, setCurrent] = useState(initialIndex);
  const modalRef = useRef();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setCurrent((c) => (c > 0 ? c - 1 : c));
      if (e.key === "ArrowRight")
        setCurrent((c) => (c < learningModules.length - 1 ? c + 1 : c));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open, current]);

  if (!open) return null;
  const mod = learningModules[current];
  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(20,24,40,0.98)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s",
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          background: colors.cardBg,
          color: colors.text,
          borderRadius: 24,
          boxShadow: `0 8px 48px ${colors.shadow}`,
          border: `2.5px solid ${colors.accent2}`,
          fontFamily: mainFont,
          maxWidth: 700,
          width: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "40px 32px 32px 32px",
          position: "relative",
          outline: "none",
          animation: "fadeIn 0.4s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => setCurrent((c) => (c > 0 ? c - 1 : c))}
            disabled={current === 0}
            aria-label="Previous Module"
            style={{
              background: current === 0 ? colors.textSoft : colors.accent2,
              border: "none",
              color: current === 0 ? colors.cardBg : "#232946",
              fontSize: 32,
              cursor: current === 0 ? "not-allowed" : "pointer",
              marginRight: 24,
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: current === 0 ? "none" : `0 2px 8px ${colors.shadow}`,
              transition: "background 0.18s, color 0.18s",
              outline: "none",
            }}
            onMouseOver={(e) => {
              if (current !== 0)
                e.currentTarget.style.background = colors.accent;
            }}
            onMouseOut={(e) => {
              if (current !== 0)
                e.currentTarget.style.background = colors.accent2;
            }}
          >
            ‹
          </button>
          <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
            <span
              style={{
                fontFamily: mainFont,
                fontWeight: 700,
                fontSize: "1.5rem",
                color: colors.accent2,
                letterSpacing: 1,
                wordBreak: "break-word",
              }}
            >
              Week {mod.week}: {mod.title}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrent((c) => (c < learningModules.length - 1 ? c + 1 : c))
            }
            disabled={current === learningModules.length - 1}
            aria-label="Next Module"
            style={{
              background:
                current === learningModules.length - 1
                  ? colors.textSoft
                  : colors.accent2,
              border: "none",
              color:
                current === learningModules.length - 1
                  ? colors.cardBg
                  : "#232946",
              fontSize: 32,
              cursor:
                current === learningModules.length - 1
                  ? "not-allowed"
                  : "pointer",
              marginLeft: 24,
              marginRight: 24,
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                current === learningModules.length - 1
                  ? "none"
                  : `0 2px 8px ${colors.shadow}`,
              transition: "background 0.18s, color 0.18s",
              outline: "none",
            }}
            onMouseOver={(e) => {
              if (current !== learningModules.length - 1)
                e.currentTarget.style.background = colors.accent;
            }}
            onMouseOut={(e) => {
              if (current !== learningModules.length - 1)
                e.currentTarget.style.background = colors.accent2;
            }}
          >
            ›
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "relative",
              top: 0,
              right: 0,
              background: colors.accent2,
              color: "#232946",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 24,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 2px 8px ${colors.shadow}`,
              zIndex: 10,
              transition: "background 0.18s",
              marginLeft: 8,
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            fontSize: "1.12rem",
            color: colors.text,
            marginBottom: 18,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {mod.summary}
        </div>
        <div
          style={{
            background: "#181818",
            borderRadius: 14,
            padding: "18px 16px",
            border: `1.5px solid ${colors.accent2}`,
            color: "#ffe",
            fontSize: "1.08em",
            whiteSpace: "pre-line",
            boxShadow: "1px 1px 0 #000",
            lineHeight: 1.7,
            maxHeight: "55vh",
            overflowY: "auto",
          }}
        >
          {mod.details}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            color: colors.textSoft,
            fontSize: "0.98em",
          }}
        >
          Module {current + 1} of {learningModules.length}
        </div>
      </div>
    </div>
  );
};

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
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [modulesModalOpen, setModulesModalOpen] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question:
        "Which of the following is a strategy to manage cognitive load?",
      options: [
        "Chunking information",
        "Ignoring all new information",
        "Reading as fast as possible",
        "Multitasking with unrelated tasks",
      ],
      answer: 0,
    },
    {
      id: 2,
      question:
        "What is a good way to evaluate the credibility of an AI article?",
      options: [
        "Check the source and author",
        "Only read the title",
        "Trust any article with 'AI' in the title",
        "Share before reading",
      ],
      answer: 0,
    },
    {
      id: 3,
      question:
        "Which tool is commonly used for personal knowledge management?",
      options: ["Anki", "Instagram", "Netflix", "Uber"],
      answer: 0,
    },
  ];

  const handleQuizChange = (qid, idx) => {
    setQuizAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

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

  const handleCheckQuizAnswers = () => {
    const results = {};
    quizQuestions.forEach((q) => {
      results[q.id] = quizAnswers[q.id] === q.answer;
    });
    setQuizResults(results);
  };

  return (
    <MainContainer>
      {/* Quiz Modal */}
      <Modal open={quizOpen} onClose={() => setQuizOpen(false)}>
        <Paper
          sx={{
            background: colors.cardBg,
            color: colors.text,
            borderRadius: 4,
            boxShadow: `0 4px 24px ${colors.shadow}`,
            border: `2px solid ${colors.accent2}`,
            fontFamily: mainFont,
            minWidth: 340,
            maxWidth: 420,
            mx: "auto",
            my: 8,
            p: 4,
            outline: "none",
            position: "relative",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: colors.accent2,
              fontWeight: 700,
              mb: 2,
              fontFamily: mainFont,
            }}
          >
            Quick Quiz
          </Typography>
          {quizQuestions.map((q) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, color: colors.accent }}>
                {q.question}
              </Typography>
              {q.options.map((opt, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    minHeight: 32,
                    mb: 0.5,
                  }}
                >
                  <input
                    type="radio"
                    id={`q${q.id}_opt${idx}`}
                    name={`quiz_q${q.id}`}
                    checked={quizAnswers[q.id] === idx}
                    onChange={() => handleQuizChange(q.id, idx)}
                    style={{
                      accentColor: colors.accent,
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                  />
                  <label
                    htmlFor={`q${q.id}_opt${idx}`}
                    style={{
                      color: colors.text,
                      fontFamily: mainFont,
                      fontSize: "1rem",
                      lineHeight: "1.2",
                      paddingTop: 1,
                    }}
                  >
                    {opt}
                  </label>
                </Box>
              ))}
              {quizResults[q.id] !== undefined && (
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color: quizResults[q.id] ? "#1ec6b6" : "#e74c3c",
                    fontFamily: mainFont,
                  }}
                >
                  {quizResults[q.id] ? "Correct!" : "Incorrect"}
                </Typography>
              )}
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={handleCheckQuizAnswers}
            sx={{
              mt: 1,
              background: colors.accent,
              color: "#232946",
              borderRadius: 2,
              fontWeight: 700,
              fontFamily: mainFont,
              boxShadow: `0 2px 8px ${colors.shadow}`,
              "&:hover": { background: colors.accent2, color: colors.cardBg },
            }}
            fullWidth
          >
            Check Answers
          </Button>
          <Button
            variant="contained"
            onClick={() => setQuizOpen(false)}
            sx={{
              mt: 2,
              background: colors.accent,
              color: "#232946",
              borderRadius: 2,
              fontWeight: 700,
              fontFamily: mainFont,
              boxShadow: `0 2px 8px ${colors.shadow}`,
              "&:hover": { background: colors.accent2, color: colors.cardBg },
            }}
            fullWidth
          >
            Close
          </Button>
        </Paper>
      </Modal>
      <LearningModulesModal
        open={modulesModalOpen}
        onClose={() => setModulesModalOpen(false)}
      />
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
          Version: v1.0.0
        </Typography>
      </Box>
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto 18px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setModulesModalOpen(true)}
          sx={{
            background: colors.accent2,
            color: "#232946",
            borderRadius: 2,
            fontWeight: 700,
            fontFamily: mainFont,
            boxShadow: `0 2px 8px ${colors.shadow}`,
            fontSize: "1.1rem",
            mb: 1,
            width: { xs: "100%", sm: "auto" },
            minWidth: 220,
            "&:hover": { background: colors.accent, color: colors.cardBg },
          }}
        >
          View All Modules
        </Button>
        <div
          style={{
            color: colors.textSoft,
            fontSize: "1.02em",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          <b>Tip:</b> Click "View All Modules" to read the full learning modules
          in a focused, distraction-free view.
        </div>
      </div>
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
              <ActionButton
                variant="outlined"
                onClick={() => setQuizOpen(true)}
                sx={{ color: colors.accent2, borderColor: colors.accent2 }}
              >
                QUIZ! ✨
              </ActionButton>
            </ButtonGroup>

            <audio ref={audioRef} />
          </InputContainer>
        </LeftColumn>
      </TwoColumnLayout>
    </MainContainer>
  );
};

export default ProjectBetterTogether;
