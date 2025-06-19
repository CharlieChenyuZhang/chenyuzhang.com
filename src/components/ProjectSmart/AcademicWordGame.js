import React, { useState } from "react";

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
      <div style={{ marginTop: 32, textAlign: "center", color: "#888" }}>
        Progress: {current + 1} / {WORDS.length}
      </div>
    </div>
  );
};

export default AcademicWordGame;
