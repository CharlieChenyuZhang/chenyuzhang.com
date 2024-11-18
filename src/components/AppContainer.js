// AppContainer.js
import React from "react";
import styled, { keyframes } from "styled-components";

// Twinkle animation for stars
const twinkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
`;

// Main container with a dark background and stars
const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
  position: relative;
  overflow: hidden;
`;

// Container for stars
const StarsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Individual star component with a glow effect
const Star = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  animation: ${twinkle} ${({ duration }) => duration}s infinite ease-in-out;
  opacity: ${({ opacity }) => opacity};
  box-shadow: 0 0 ${({ size }) => size * 4}px rgba(255, 255, 255, 0.6);
`;

// Generate stars with random positions, sizes, and brightness
const generateStars = (count) => {
  return Array.from({ length: count }).map((_, index) => ({
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.4,
    key: index,
  }));
};

const AppContainer = ({ children }) => {
  const stars = generateStars(30); // Adjust number of stars as desired

  return (
    <MainContainer>
      {/* Render the stars */}
      <StarsContainer>
        {stars.map((star) => (
          <Star
            key={star.key}
            size={star.size}
            top={star.top}
            left={star.left}
            duration={star.duration}
            opacity={star.opacity}
          />
        ))}
      </StarsContainer>
      {/* Render the rest of the app's content */}
      {children}
    </MainContainer>
  );
};

export default AppContainer;
