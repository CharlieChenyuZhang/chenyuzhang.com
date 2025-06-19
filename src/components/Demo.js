import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const projectRoutes = [
  { label: "Project Landing Page", path: "/project" },
  { label: "How to Learn Anything", path: "/project/how-to-learn-anything" },
  { label: "Self Compassion", path: "/project/self-compassion" },
  { label: "Smart V1", path: "/project/smart/v1" },
  { label: "Smart V2", path: "/project/smart/v2" },
  { label: "Smart V3", path: "/project/smart/v3" },
  { label: "Smart V4", path: "/project/smart/v4" },
  { label: "Smart V5", path: "/project/smart/v5" },
  { label: "Smart V6", path: "/project/smart/v6" },
  { label: "Glowing Star - reframing", path: "/glowingstar" },
  { label: "Word Game", path: "/project/word-game" },
  { label: "Relief", path: "/project/relief" },
  { label: "Relief Webcam Test", path: "/project/relief/webcam-test" },
  { label: "Relief Learning Video", path: "/project/relief/learning-video" },
  { label: "Relief Learning Tasks", path: "/project/relief/learning-tasks" },
  { label: "Relief Debrief", path: "/project/relief/debrief" },
  {
    label: "Social Intelligence: Dimensions V1",
    path: "/project/social-intelligence/dimensions-of-interactions/v1",
  },
  {
    label: "Social Intelligence: Dimensions V2",
    path: "/project/social-intelligence/dimensions-of-interactions/v2",
  },
  {
    label: "Social Intelligence: Dimensions V3",
    path: "/project/social-intelligence/dimensions-of-interactions/v3",
  },
  {
    label: "Social Intelligence: Icebreaking",
    path: "/project/social-intelligence/icebreaking",
  },
  {
    label: "PRG Persona LLM Eval V1",
    path: "/project/prg/persona-llm-eval/v1",
  },
  {
    label: "PRG Persona LLM Eval V2",
    path: "/project/prg/persona-llm-eval/v2",
  },
  { label: "Recording Testing", path: "/project/recording-testing" },
];

const Demo = () => {
  const [selected, setSelected] = useState(projectRoutes[0].path);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(selected);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Project Route Demo</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      >
        {projectRoutes.map((route) => (
          <option key={route.path} value={route.path}>
            {route.label}
          </option>
        ))}
      </select>
      <button onClick={handleRedirect} style={{ width: "100%", padding: 10 }}>
        Redirect
      </button>
    </div>
  );
};

export default Demo;
