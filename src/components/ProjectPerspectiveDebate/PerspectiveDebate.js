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

const PerspectiveDebate = () => {
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setUserStatement(newMessage);
    setNewMessage("");
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
            <p>{agentSayings[0 % agentSayings.length]}</p>
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
              <p>{agentSayings[index % agentSayings.length]}</p>
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
      </div>
    );
  };

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
