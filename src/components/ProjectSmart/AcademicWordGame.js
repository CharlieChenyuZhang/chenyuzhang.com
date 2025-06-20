import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { backendDomain } from "../../utils";

// --- Glass effect and background video styled-components ---
const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  color: #fff;
  position: relative;
  z-index: 1;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  border: 1.5px solid #e3e8f0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px 0 rgba(30, 60, 120, 0.18);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  padding: 32px 24px;
  z-index: 2;
  color: #1a237e;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const VideoSwitcherContainer = styled.div`
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(30, 30, 40, 0.45);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  padding: 18px 28px 8px 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  max-width: 98vw;
  background-image: radial-gradient(
    circle at 60% 40%,
    rgba(144, 202, 249, 0.1) 0%,
    rgba(30, 30, 40, 0.45) 80%
  );
`;

const VideoThumbButton = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 4px 18px 0 rgba(31, 38, 135, 0.18);
  border: 3px solid transparent;
  width: 54px;
  height: 54px;
  margin: 0 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.22s, transform 0.18s, border 0.22s;
  position: relative;
  background: transparent;
  &:hover,
  &:focus {
    box-shadow: 0 0 0 10px rgba(144, 202, 249, 0.18),
      0 4px 18px 0 rgba(31, 38, 135, 0.18);
    transform: scale(1.1);
    z-index: 2;
  }
  ${(props) =>
    props.selected &&
    `
      border: 3px solid #90caf9;
      box-shadow: 0 0 0 16px rgba(144,202,249,0.18), 0 4px 18px 0 rgba(31,38,135,0.18);
      transform: scale(1.13);
      z-index: 3;
    `}
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
  background: #222;
`;

// --- Background video data ---
const BACKGROUND_VIDEO_URL =
  "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/6859482-hd_1920_1080_30fps.mp4";

const WORDS = [
  {
    word: "Authority",
    definition: "A person or group with power to make decisions.",
  },
  { word: "Approach", definition: "A way of doing something." },
  { word: "Area", definition: "A space or part of a place." },
  {
    word: "Assess",
    definition: "To look at something and decide how good or bad it is.",
  },
  { word: "Assist", definition: "To help." },
  { word: "Attribute", definition: "A quality or feature of something." },
  {
    word: "Analysis",
    definition: "A careful study of something to understand it.",
  },
  { word: "Available", definition: "Ready to use or get." },
  { word: "Benefit", definition: "A good or helpful result." },
  { word: "Concept", definition: "An idea." },
  { word: "Consist", definition: "To be made of something." },
  {
    word: "Context",
    definition:
      "The situation or words around something that help you understand it.",
  },
  { word: "Constitute", definition: "To form or make up something." },
  { word: "Contract", definition: "A written agreement." },
  { word: "Data", definition: "Information, often in numbers." },
  { word: "Define", definition: "To explain the meaning of a word or idea." },
  { word: "Derive", definition: "To get something from something else." },
  { word: "Distribute", definition: "To give out to many people." },
  {
    word: "Economy",
    definition: "The system of money, jobs, and trade in a country.",
  },
  {
    word: "Environment",
    definition: "The world around us (nature, air, water, etc.).",
  },
  { word: "Establish", definition: "To start or create something." },
  { word: "Estimate", definition: "To guess a number or amount." },
  { word: "Evolve", definition: "To slowly change or develop." },
  { word: "Factor", definition: "One part that causes a result." },
  { word: "Finance", definition: "Money and how it is managed." },
  { word: "Format", definition: "The way something is arranged or organized." },
  { word: "Function", definition: "The job something does." },
  { word: "Income", definition: "Money you earn or receive." },
  { word: "Indicate", definition: "To show or point out." },
  { word: "Individual", definition: "One person." },
  {
    word: "Interpret",
    definition: "To explain or understand the meaning of something.",
  },
  {
    word: "Involve",
    definition: "To be a part of something or include something.",
  },
  { word: "Issue", definition: "A problem or important topic." },
  { word: "Labor", definition: "Work, usually hard physical work." },
  { word: "Legal", definition: "Allowed by law." },
  { word: "Legislate", definition: "To make laws." },
  { word: "Major", definition: "Very important or large." },
  { word: "Method", definition: "A way of doing something." },
  { word: "Occur", definition: "To happen." },
  {
    word: "Percent",
    definition: "A part of 100 (like 50% means 50 out of 100).",
  },
  { word: "Period", definition: "A length of time." },
  { word: "Principle", definition: "A basic rule or idea." },
  { word: "Process", definition: "A series of steps to do something." },
  {
    word: "Policy",
    definition: "A rule or plan made by a group or organization.",
  },
  { word: "Procedure", definition: "The steps to do something in order." },
  { word: "Require", definition: "To need or to make necessary." },
  {
    word: "Research",
    definition: "Careful study to learn more about something.",
  },
  { word: "Respond", definition: "To answer or react." },
  { word: "Role", definition: "A job or part a person plays." },
  { word: "Section", definition: "A part of something." },
  { word: "Sector", definition: "A part of the economy or a group of jobs." },
  { word: "Significant", definition: "Important or big enough to notice." },
  { word: "Similar", definition: "Almost the same." },
  { word: "Source", definition: "Where something comes from." },
  { word: "Specific", definition: "Clear and exact." },
  { word: "Structure", definition: "The way parts are organized or built." },
  { word: "Theory", definition: "An idea that explains something." },
  { word: "Vary", definition: "To be different or change." },
];

const API_BASE = `${backendDomain()}/word-game`;

function FeatureButtonPanel({ word }) {
  const [loading, setLoading] = useState("");
  const [result, setResult] = useState({});
  const [modal, setModal] = useState(null);

  // Reset modal and result when the word changes
  React.useEffect(() => {
    setModal(null);
    setResult({});
  }, [word]);

  // Helper to render word family fields safely
  function renderFamilyField(field) {
    if (Array.isArray(field)) {
      return field.join(", ");
    } else if (field && typeof field === "object") {
      return (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {Object.entries(field).map(([k, v]) => (
            <li key={k}>
              <b>{k}:</b> {v}
            </li>
          ))}
        </ul>
      );
    } else if (typeof field === "string" || typeof field === "number") {
      return field;
    } else {
      return "N/A";
    }
  }

  const features = [
    {
      key: "define",
      label: "📖 Define (Kid-Friendly)",
      handler: async () => {
        setLoading("define");
        const res = await fetch(`${API_BASE}/define`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        setResult({ define: await res.json() });
        setModal("define");
        setLoading("");
      },
    },
    {
      key: "sentence",
      label: "💬 Use in a Sentence",
      handler: async () => {
        setLoading("sentence");
        const res = await fetch(`${API_BASE}/sentence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        setResult({ sentence: await res.json() });
        setModal("sentence");
        setLoading("");
      },
    },
    {
      key: "visualize",
      label: "🎭 Visualize the Word",
      handler: async () => {
        setLoading("visualize");
        const res = await fetch(`${API_BASE}/visualize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        setResult({ visualize: await res.json() });
        setModal("visualize");
        setLoading("");
      },
    },
    {
      key: "translate",
      label: "🌐 Translate to Chinese",
      handler: async () => {
        setLoading("translate");
        // Use OpenAI for translation
        const res = await fetch(`${API_BASE}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, targetLanguage: "Chinese" }),
        });
        setResult({ translate: await res.json() });
        setModal("translate");
        setLoading("");
      },
    },
    // {
    //   key: "quiz",
    //   label: "🧠 Quiz Me",
    //   handler: async () => {
    //     setLoading("quiz");
    //     const res = await fetch(`${API_BASE}/quiz`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ word }),
    //     });
    //     setResult({ quiz: await res.json() });
    //     setModal("quiz");
    //     setLoading("");
    //   },
    // },
    {
      key: "fun-fact",
      label: "🎲 Fun Fact or Story",
      handler: async () => {
        setLoading("fun-fact");
        const res = await fetch(`${API_BASE}/fun-fact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        setResult({ funFact: await res.json() });
        setModal("fun-fact");
        setLoading("");
      },
    },
    // {
    //   key: "speak",
    //   label: "🪞 My Turn to Speak",
    //   handler: async () => {
    //     setLoading("speak");
    //     const res = await fetch(`${API_BASE}/speak`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ word }),
    //     });
    //     setResult({ speak: await res.json() });
    //     setModal("speak");
    //     setLoading("");
    //   },
    // },
    {
      key: "family",
      label: "🧵 Word Family",
      handler: async () => {
        setLoading("family");
        const res = await fetch(`${API_BASE}/family`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });
        setResult({ family: await res.json() });
        setModal("family");
        setLoading("");
      },
    },
    // {
    //   key: "context-challenge",
    //   label: "🧩 Context Challenge",
    //   handler: async () => {
    //     setLoading("context-challenge");
    //     const res = await fetch(`${API_BASE}/context-challenge`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ word }),
    //     });
    //     setResult({ context: await res.json() });
    //     setModal("context-challenge");
    //     setLoading("");
    //   },
    // },
  ];

  return (
    <div
      style={{
        margin: "32px 0 16px",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
      }}
    >
      {features.map((f) => (
        <button
          key={f.key}
          onClick={f.handler}
          disabled={loading === f.key}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1.5px solid #90caf9",
            background: loading === f.key ? "#e3f2fd" : "#fff",
            color: "#1a237e",
            fontWeight: 600,
            fontSize: 15,
            cursor: loading === f.key ? "wait" : "pointer",
            boxShadow: "0 1px 4px #0001",
            transition: "all 0.2s",
            minWidth: 120,
          }}
        >
          {loading === f.key ? "Loading..." : f.label}
        </button>
      ))}
      {/* Modal/inline result display */}
      {modal && (
        <div
          style={{
            width: "100%",
            marginTop: 24,
            background: "#fffbe7",
            border: "2.5px solid #ffe066",
            borderRadius: 16,
            padding: 24,
            color: "#333",
            fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
            boxShadow: "0 4px 16px #ffe06655",
          }}
        >
          <button
            onClick={() => setModal(null)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#888",
            }}
          >
            ✕
          </button>
          {modal === "define" && (
            <div>
              <b>Definition:</b> {result.define?.definition}{" "}
              {result.define?.rephrased && (
                <div style={{ color: "#888", marginTop: 8 }}>
                  Rephrased: {result.define.rephrased}
                </div>
              )}
            </div>
          )}
          {modal === "sentence" && (
            <div>
              <b>Sentence:</b> {result.sentence?.sentence}
            </div>
          )}
          {modal === "visualize" && (
            <div>
              <b>Visual:</b>{" "}
              <span style={{ fontSize: 32 }}>{result.visualize?.emoji}</span>{" "}
              <img
                src={result.visualize?.imageUrl}
                alt="visual"
                style={{ height: 60, verticalAlign: "middle", marginLeft: 8 }}
              />
            </div>
          )}
          {modal === "translate" && (
            <div>
              <b>Translation:</b> {result.translate?.translation}
            </div>
          )}
          {modal === "quiz" && (
            <div>
              <b>Quiz:</b>{" "}
              <div style={{ marginTop: 8 }}>{result.quiz?.quiz?.question}</div>
              <ul>
                {result.quiz?.quiz?.options?.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}
          {modal === "fun-fact" && (
            <div>
              <b>Fun Fact:</b> {result.funFact?.fact}
            </div>
          )}
          {modal === "speak" && (
            <div>
              <b>Pronunciation Feedback:</b> {result.speak?.feedback}
            </div>
          )}
          {modal === "family" && (
            <div>
              <b>Word Family:</b>
              <div>Root: {renderFamilyField(result.family?.root)}</div>
              <div>Related: {renderFamilyField(result.family?.related)}</div>
              <div>Synonyms: {renderFamilyField(result.family?.synonyms)}</div>
              <div>Antonyms: {renderFamilyField(result.family?.antonyms)}</div>
              <div>Forms: {renderFamilyField(result.family?.forms)}</div>
            </div>
          )}
          {modal === "context-challenge" && (
            <div>
              <b>Context Challenge:</b> <div>{result.context?.sentence}</div>
              <div style={{ color: "#888", marginTop: 8 }}>
                Hint: {result.context?.hint}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const AcademicWordGame = () => {
  // No video switching needed

  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (current < WORDS.length) {
      // Pick 3 random wrong definitions + 1 correct
      const wrong = shuffle(WORDS.filter((_, i) => i !== current)).slice(0, 3);
      const options = shuffle([
        WORDS[current],
        ...wrong.map((w) => ({ ...w, word: w.word, definition: w.definition })),
      ]);
      setChoices(options);
      setSelected(null);
      setShowAnswer(false);
    }
  }, [current]);

  const handleSelect = (choice) => {
    setSelected(choice.word);
    setShowAnswer(true);
    if (choice.word === WORDS[current].word) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current < WORDS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "2rem auto",
          textAlign: "center",
          // fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
        }}
      >
        <h2 style={{ fontSize: 36, color: "#ff9800", marginBottom: 16 }}>
          🎉 Game Finished! 🎉
        </h2>
        <p style={{ fontSize: 22, color: "#1976d2", marginBottom: 24 }}>
          Your score: <b>{score}</b> / {WORDS.length}
        </p>
        <button
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setFinished(false);
          }}
          style={{
            padding: "14px 32px",
            borderRadius: 16,
            background: "#4caf50",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: 22,
            outline: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px #4caf5055",
            marginTop: 12,
          }}
        >
          🔄 Play Again
        </button>
      </div>
    );
  }

  // Kid-friendly progress bar
  const progressPercent = ((current + 1) / WORDS.length) * 100;

  return (
    <MainContainer>
      {/* Single Background Video */}
      <BackgroundVideo
        key={BACKGROUND_VIDEO_URL}
        src={BACKGROUND_VIDEO_URL}
        autoPlay
        loop
        muted
        visible={true}
        style={{ opacity: 1 }}
      />
      {/* Glass Content Container */}
      <ContentContainer>
        {/* --- Place the rest of the game UI here --- */}
        {/* The following is the previous return content, except the outermost div is removed. */}
        {finished ? (
          <div
            style={{
              maxWidth: 500,
              margin: "2rem auto",
              textAlign: "center",
              fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
            }}
          >
            <h2 style={{ fontSize: 36, color: "#ff9800", marginBottom: 16 }}>
              🎉 Game Finished! 🎉
            </h2>
            <p style={{ fontSize: 22, color: "#1976d2", marginBottom: 24 }}>
              Your score: <b>{score}</b> / {WORDS.length}
            </p>
            <button
              onClick={() => {
                setCurrent(0);
                setScore(0);
                setFinished(false);
              }}
              style={{
                padding: "14px 32px",
                borderRadius: 16,
                background: "#4caf50",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                fontSize: 22,
                outline: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px #4caf5055",
                marginTop: 12,
              }}
            >
              🔄 Play Again
            </button>
          </div>
        ) : (
          <>
            <h2
              style={{
                textAlign: "center",
                color: "#1a237e",
                fontSize: 36,
                marginBottom: 8,
                fontWeight: 800,
                textShadow: "0 2px 8px #fff8",
              }}
            >
              🧠 Academic Word Game
            </h2>
            <div
              style={{
                width: "100%",
                height: 18,
                background: "#e3e8f0",
                borderRadius: 12,
                border: "2px solid #90caf9",
                margin: "16px 0 24px 0",
                overflow: "hidden",
                boxShadow: "0 2px 8px #90caf933",
              }}
            >
              <div
                style={{
                  width: `${((current + 1) / WORDS.length) * 100}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
                  borderRadius: 12,
                  transition: "width 0.4s",
                }}
              ></div>
            </div>
            <p
              style={{
                fontSize: 22,
                margin: "24px 0 8px",
                color: "#222",
                fontWeight: 700,
                textShadow: "0 1px 4px #fff8",
              }}
            >
              <b>Definition:</b> {WORDS[current].definition}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {choices.map((choice) => {
                const isCorrect =
                  selected && choice.word === WORDS[current].word;
                const isIncorrect =
                  selected &&
                  choice.word === selected &&
                  choice.word !== WORDS[current].word;
                return (
                  <button
                    key={choice.word}
                    onClick={() => handleSelect(choice)}
                    disabled={!!selected}
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      border: selected
                        ? isCorrect
                          ? "3px solid #388e3c"
                          : isIncorrect
                          ? "3px solid #d32f2f"
                          : "2px solid #1976d2"
                        : "2px solid #1976d2",
                      background: selected
                        ? isCorrect
                          ? "#388e3c"
                          : isIncorrect
                          ? "#d32f2f"
                          : "#fff"
                        : "#fff",
                      color: selected
                        ? isCorrect || isIncorrect
                          ? "#fff"
                          : "#1a237e"
                        : "#1a237e",
                      cursor: selected ? "default" : "pointer",
                      fontWeight: "bold",
                      fontSize: 22,
                      transition: "all 0.2s",
                      outline: "none",
                      boxShadow: "0 2px 8px #0002",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 0 0 4px #1976d2")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <span style={{ fontSize: 28 }}>🔤</span> {choice.word}
                  </button>
                );
              })}
            </div>
            {showAnswer && (
              <div style={{ marginTop: 32, textAlign: "center" }}>
                {selected === WORDS[current].word ? (
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      background: "#4caf50",
                      padding: "8px 28px",
                      borderRadius: 24,
                      border: "none",
                      fontSize: 26,
                      boxShadow: "0 2px 12px #4caf5055",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    🎉 Correct! Great job! 🎉
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      background: "#e53935",
                      padding: "8px 28px",
                      borderRadius: 24,
                      border: "none",
                      fontSize: 26,
                      boxShadow: "0 2px 12px #e5393555",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    😢 Oops! The answer is{" "}
                    <b style={{ margin: "0 6px" }}>{WORDS[current].word}</b>.
                  </span>
                )}
                <div style={{ marginTop: 24 }}>
                  <button
                    onClick={handleNext}
                    style={{
                      padding: "12px 32px",
                      borderRadius: 16,
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      fontSize: 20,
                      outline: "none",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #1976d255",
                    }}
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.target.style.boxShadow = "0 0 0 4px #1976d2")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    👉 Next
                  </button>
                </div>
              </div>
            )}
            <FeatureButtonPanel word={WORDS[current].word} />
            <div
              style={{
                marginTop: 32,
                textAlign: "center",
                color: "#888",
                fontSize: 18,
              }}
            >
              <span style={{ fontSize: 22 }}>🚦</span> Progress:{" "}
              <b>{current + 1}</b> / {WORDS.length}
            </div>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <a
                href="https://docs.google.com/document/d/1i5bvKOhK-yh2036nvw3pCUtxaVuCh2Gt-weAWZI1jk8/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: 18,
                  textDecoration: "underline",
                  borderRadius: 8,
                  padding: "6px 18px",
                  background: "#e3f2fd",
                  display: "inline-block",
                  marginTop: 8,
                  boxShadow: "0 1px 4px #90caf933",
                  transition: "background 0.2s",
                }}
              >
                📚 Credits & Word List Source
              </a>
            </div>
          </>
        )}
      </ContentContainer>
    </MainContainer>
  );
};

AcademicWordGame.displayName = "AcademicWordGame";

AcademicWordGame.prototype = undefined; // for hot reload

export default AcademicWordGame;
