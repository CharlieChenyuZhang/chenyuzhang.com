import React, { useState } from "react";
import axios from "axios";
import "./PerspectiveDebate.css";
import { backendDomain } from "../../utils";

const PerspectiveDebate = () => {
  const [scenario, setScenario] = useState("");
  const [perspectives, setPerspectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    // Handle door click based on the option
    console.log(`Selected option: ${option}`);
    // Add your navigation or modal logic here
  };

  return (
    <div className="perspective-debate">
      <h1>Project "Perspective Debate"</h1>
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
                onClick={() => handleDoorClick(option.type)}
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
    </div>
  );
};

export default PerspectiveDebate;
