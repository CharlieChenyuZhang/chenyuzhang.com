import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./PerspectiveDebate.css";
import { backendDomain } from "../../utils";

const agentSayings = [
  "I think we should focus on the community.",
  "What about the financial costs?",
  "Let's consider the ethical implications.",
  "The environmental impact is my main concern.",
  "From a legal standpoint, we need to be careful.",
  "I'm thinking about the long-term strategy.",
];

const CORRECT_PASSWORD = "123xyz"; // TODO: Use a more secure method for password handling.

const PerspectiveDebate = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [scenario, setScenario] = useState("");
  const [perspectives, setPerspectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDebateView, setShowDebateView] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [userStatement, setUserStatement] = useState(
    "This is you. Join the conversation!"
  );

  const [chatHistory, setChatHistory] = useState([]);
  const [agentResponses, setAgentResponses] = useState({});
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isAgentThinking, setIsAgentThinking] = useState(null);
  const [debateStarted, setDebateStarted] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const getAgentResponse = async (agent, currentHistory) => {
    setIsAgentThinking(agent.name);
    try {
      const response = await fetch(
        `${backendDomain()}/api/perspectives/debate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            perspectives,
            chatHistory: currentHistory,
            currentPerspectiveName: agent.name,
            scenario,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get agent response");
      }

      const data = await response.json();
      const newResponse = { author: agent.name, message: data.argument };

      setAgentResponses((prev) => ({ ...prev, [agent.name]: data.argument }));
      setChatHistory((prev) => [...prev, newResponse]);

      const agents = participants.filter((p) => p.id !== "user");
      setCurrentTurnIndex((prevIndex) => (prevIndex + 1) % agents.length);
    } catch (err) {
      console.error("Error fetching agent response:", err);
      setAgentResponses((prev) => ({
        ...prev,
        [agent.name]: "I'm having trouble thinking right now...",
      }));
    } finally {
      setIsAgentThinking(null);
    }
  };

  const handleNextTurn = async () => {
    if (!debateStarted) {
      setDebateStarted(true);
    }
    const agents = participants.filter((p) => p.id !== "user");
    if (agents.length === 0) return;

    const agentToAsk = agents[currentTurnIndex];
    await getAgentResponse(agentToAsk, chatHistory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${backendDomain()}/api/perspectives/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario,
          }),
        }
      );
      const data = await response.json();
      setPerspectives(data.perspectives);
    } catch (err) {
      setError("Failed to generate perspectives. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDoorClick = (option) => {
    setSelectedDoor(option);
    setShowDebateView(true);

    setChatHistory([]);
    setAgentResponses({});
    setCurrentTurnIndex(0);
    setIsAgentThinking(null);
    setDebateStarted(false);
    setUserStatement("This is you. Join the conversation!");

    // Initialize participants based on the debate type
    const baseParticipants = perspectives.map((p, index) => ({
      id: index,
      name: p.name,
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      perspective: p.perspective,
    }));

    switch (option.type) {
      case "watch":
        setParticipants(baseParticipants);
        break;
      case "group":
        setParticipants([
          {
            id: "user",
            name: "You",
            avatar: `https://i.pravatar.cc/150?img=0`,
          },
          ...baseParticipants,
        ]);
        break;
      case "one-on-one":
        setParticipants([
          {
            id: "user",
            name: "You",
            avatar: `https://i.pravatar.cc/150?img=0`,
          },
          baseParticipants[Math.floor(Math.random() * baseParticipants.length)],
        ]);
        break;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || selectedDoor?.type === "watch") return;

    const userMessage = { author: "You", message: newMessage };
    const newHistory = [...chatHistory, userMessage];

    setChatHistory(newHistory);
    setUserStatement(newMessage);
    setNewMessage("");

    const agents = participants.filter((p) => p.id !== "user");
    if (agents.length > 0) {
      const nextAgent = agents[currentTurnIndex % agents.length];
      await getAgentResponse(nextAgent, newHistory);
    }
  };

  const renderChatCircle = () => {
    const centerX = 250;
    const centerY = 250;
    const radius = 200;

    const agents = participants.filter((p) => p.id !== "user");
    const userParticipant = participants.find((p) => p.id === "user");

    // 1. One-on-one debate: Vertically align the two participants.
    if (
      selectedDoor?.type === "one-on-one" &&
      userParticipant &&
      agents.length === 1
    ) {
      const agent = agents[0];
      return (
        <div className="chat-circle">
          {/* Agent at the top, centered on the circle line */}
          <div
            key={agent.id}
            className="agent-card"
            style={{
              left: `${centerX - 80}px`,
              top: `${centerY - radius - 50}px`, // Center card on the circle
              transitionDelay: "0ms",
            }}
          >
            <strong>{agent.name}</strong>
            {isAgentThinking === agent.name ? (
              <div className="thinking-indicator"></div>
            ) : (
              <p>{agentResponses[agent.name] || agent.perspective}</p>
            )}
          </div>

          {/* User at the bottom, centered on the circle line */}
          <div
            key={userParticipant.id}
            className="agent-card user-card"
            style={{
              left: `${centerX - 80}px`,
              top: `${centerY + radius - 50}px`, // Center card on the circle
              transitionDelay: "100ms",
            }}
          >
            <strong>{userParticipant.name}</strong>
            <p>{userStatement}</p>
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <button
              onClick={handleNextTurn}
              className="debate-control-button"
              disabled={isAgentThinking !== null}
            >
              {isAgentThinking
                ? `${isAgentThinking} is thinking...`
                : debateStarted
                ? "Next Argument"
                : "Start Debate"}
            </button>
          </div>
        </div>
      );
    }

    // 2. Group/Watch debate: Align the "You" card with the circle path.
    const numAgents = agents.length || 1;
    const arc = 1.2 * Math.PI;
    const startAngle = 1.5 * Math.PI - arc / 2;

    return (
      <div className="chat-circle">
        {agents.map((participant, index) => {
          const angle =
            numAgents > 1
              ? startAngle + (arc * index) / (numAgents - 1)
              : 1.5 * Math.PI; // Center single agent at the top
          const x = centerX + radius * Math.cos(angle) - 80;
          const y = centerY + radius * Math.sin(angle) - 50;

          return (
            <div
              key={participant.id}
              className="agent-card"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <strong>{participant.name}</strong>
              {isAgentThinking === participant.name ? (
                <div className="thinking-indicator"></div>
              ) : (
                <p>
                  {agentResponses[participant.name] || participant.perspective}
                </p>
              )}
            </div>
          );
        })}

        {userParticipant && (
          <div
            key={userParticipant.id}
            className="agent-card user-card"
            style={{
              left: `${centerX - 80}px`,
              top: `${centerY + radius - 50}px`, // Center the card on the circle line
              transitionDelay: `${agents.length * 100}ms`,
            }}
          >
            <strong>{userParticipant.name}</strong>
            <p>{userStatement}</p>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleNextTurn}
            className="debate-control-button"
            disabled={isAgentThinking !== null}
          >
            {isAgentThinking
              ? `${isAgentThinking} is thinking...`
              : debateStarted
              ? "Next Argument"
              : "Start Debate"}
          </button>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="password-overlay">
        <div className="password-modal">
          <h1>Perspective Debate</h1>
          <form onSubmit={handlePasswordSubmit} style={{ marginTop: "2rem" }}>
            <input
              type="password"
              className="password-input"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter code"
              required
            />
            <button type="submit" className="password-button">
              Unlock
            </button>
          </form>
          {authError && <p className="error-message">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="perspective-debate">
      <h1>Project Perspective Debate</h1>
      <div className="scenario-input">
        <form onSubmit={handleSubmit}>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Enter your conflict scenario or life dilemma here..."
            rows={4}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Perspectives"}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {perspectives.length > 0 && (
        <>
          <div className="perspectives-container">
            <h2>Different Perspectives</h2>
            <div className="perspectives-grid">
              {perspectives.map((p, index) => (
                <div key={index} className="perspective-card">
                  <h3>{p.name}</h3>
                  <p>{p.perspective}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="doors-container">
            {[
              { label: "Watch Debate", type: "watch" },
              { label: "Join Debate (Group)", type: "group" },
              { label: "Join Debate (1-on-1)", type: "one-on-one" },
            ].map((option, index) => (
              <div
                key={index}
                className="door-option"
                onClick={() => handleDoorClick(option)}
              >
                <div className="door-frame" />
                <div className="door">
                  <div className="door-window" />
                  <div className="door-knob" />
                </div>
                <div className="door-label">{option.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {showDebateView && (
        <div className={`debate-view ${showDebateView ? "visible" : ""}`}>
          {/* Mobile-only back button */}
          <button
            className="back-button"
            onClick={() => setShowDebateView(false)}
          >
            ←
          </button>

          {/* Desktop door column */}
          <div className="debate-door-column">
            <div className="door-option">
              <div className="door-frame" />
              <div className="door">
                <div className="door-window" />
                <div className="door-knob" />
              </div>
              <div className="door-label">
                {{
                  watch: "Watching Debate",
                  group: "Group Debate",
                  "one-on-one": "1-on-1 Debate",
                }[selectedDoor?.type] || selectedDoor?.label}
              </div>
            </div>
            <button
              className="leave-room-button"
              onClick={() => setShowDebateView(false)}
            >
              Leave Room
            </button>
          </div>

          <div className="debate-circle-column">{renderChatCircle()}</div>
          <div className="chat-input-container">
            <form onSubmit={handleSendMessage}>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={selectedDoor?.type === "watch"}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={selectedDoor?.type === "watch"}
                >
                  →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerspectiveDebate;
