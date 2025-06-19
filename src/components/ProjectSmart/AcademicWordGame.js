import React, { useState } from "react";
import { backendDomain } from "../../utils";

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
            border: "1.5px solid #bbb",
            background: loading === f.key ? "#eee" : "#f8f9fa",
            color: "#222",
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
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  React.useEffect(() => {
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
      <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
        <h2>Game Finished!</h2>
        <p>
          Your score: {score} / {WORDS.length}
        </p>
        <button
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setFinished(false);
          }}
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#000" }}>Academic Word Game</h2>
      <p style={{ fontSize: 18, margin: "24px 0 8px", color: "#000" }}>
        <b>Definition:</b> {WORDS[current].definition}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {choices.map((choice) => {
          const isCorrect = selected && choice.word === WORDS[current].word;
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
                padding: 12,
                borderRadius: 8,
                border: selected
                  ? isCorrect
                    ? "2px solid #15803d" // muted modern green
                    : isIncorrect
                    ? "2px solid #b91c1c" // muted modern red
                    : "1px solid #000"
                  : "1px solid #000",
                background: selected
                  ? isCorrect
                    ? "#15803d"
                    : isIncorrect
                    ? "#b91c1c"
                    : "#fff"
                  : "#fff",
                color: selected
                  ? isCorrect
                    ? "#fff"
                    : isIncorrect
                    ? "#fff"
                    : "#000"
                  : "#000",
                cursor: selected ? "default" : "pointer",
                fontWeight: "bold",
                fontSize: 16,
                transition: "all 0.2s",
                outline: "none",
                boxShadow:
                  selected && (isCorrect || isIncorrect)
                    ? isCorrect
                      ? "0 2px 8px rgba(21,128,61,0.10)"
                      : "0 2px 8px rgba(185,28,28,0.10)"
                    : "none",
              }}
              tabIndex={0}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1976d2")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            >
              {choice.word}
            </button>
          );
        })}
      </div>
      {showAnswer && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          {selected === WORDS[current].word ? (
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
                background: "#15803d",
                padding: "4px 18px",
                borderRadius: 16,
                border: "none",
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(21,128,61,0.10)",
              }}
            >
              Correct!
            </span>
          ) : (
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
                background: "#b91c1c",
                padding: "4px 18px",
                borderRadius: 16,
                border: "none",
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(185,28,28,0.10)",
              }}
            >
              Incorrect. The answer is <b>{WORDS[current].word}</b>.
            </span>
          )}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={handleNext}
              style={{
                padding: "8px 24px",
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                fontSize: 16,
                outline: "none",
              }}
              tabIndex={0}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #1976d2")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <FeatureButtonPanel word={WORDS[current].word} />
      <div style={{ marginTop: 32, textAlign: "center", color: "#888" }}>
        Progress: {current + 1} / {WORDS.length}
      </div>
    </div>
  );
};

export default AcademicWordGame;
