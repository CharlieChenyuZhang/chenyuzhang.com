import React, { useState } from "react";
import styled from "styled-components";
import { Typography, CircularProgress } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
`;

const ContentContainer = styled.div`
  margin: 20px;
  width: 100%;
  max-width: 960px;
  padding: 2rem;
`;

export default function IceBreaking() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Your existing logic for handleGenerate
  };

  return (
    <MainContainer>
      <ContentContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Dimensions of Interactions
        </Typography>

        <Canvas
          camera={{ position: [6, 6, 6], fov: 45 }}
          style={{ height: "500px" }}
        >
          <InteractionDimensions3D />
          <OrbitControls enableZoom={true} maxDistance={15} minDistance={5} />
        </Canvas>
      </ContentContainer>
    </MainContainer>
  );
}

function InteractionDimensions3D() {
  return (
    <>
      {/* Axis lines */}
      <mesh>
        {/* Y-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, 5, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>

        {/* X-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 5, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>

        {/* Z-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, 0, 5])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>
      </mesh>

      {/* Y-Axis Labels and Ticks */}
      <TickWithLabel position={[0, 1, 0]} label="Signals" />
      <TickWithLabel position={[0, 2, 0]} label="Behaviors & Acts" />
      <TickWithLabel position={[0, 3, 0]} label="Events" />
      <TickWithLabel position={[0, 4, 0]} label="Situations" />
      <TickWithLabel position={[0, 5, 0]} label="Networks" />

      {/* X-Axis Labels and Ticks */}
      <TickWithLabel position={[1, 0, 0]} label="Monad" horizontal />
      <TickWithLabel position={[2, 0, 0]} label="Dyad" horizontal />
      <TickWithLabel position={[3, 0, 0]} label="Multi-Party" horizontal />

      {/* Z-Axis Labels and Ticks */}
      <TickWithLabel position={[0, 0, 1]} label="Moment" horizontal />
      <TickWithLabel position={[0, 0, 2]} label="Short-Term" horizontal />
      <TickWithLabel position={[0, 0, 3]} label="Life-Long" horizontal />

      {/* Axis Titles */}
      <Text position={[0, 5.5, 0]} fontSize={0.3} color="lightgreen">
        Hierarchical Social Units
      </Text>
      <Text position={[5.5, 0, 0]} fontSize={0.3} color="lightgreen">
        Interaction Structures
      </Text>
      <Text position={[0, 0, 5.5]} fontSize={0.3} color="lightgreen">
        Temporal Scale
      </Text>
    </>
  );
}

function TickWithLabel({ position, label, horizontal = false, depth = false }) {
  // Define the tick length and offset for the label
  const tickLength = 0.2;
  const offset = 0.3;

  return (
    <>
      {/* Draw tick */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={
              horizontal
                ? new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0],
                    position[1] - tickLength,
                    position[2],
                  ])
                : depth
                ? new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0] - tickLength,
                    position[1],
                    position[2],
                  ])
                : new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0],
                    position[1],
                    position[2] - tickLength,
                  ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="white" />
      </line>

      {/* Label positioned beside tick */}
      <Text
        position={
          horizontal
            ? [position[0], position[1] - offset, position[2]]
            : depth
            ? [position[0] - offset, position[1], position[2]]
            : [position[0], position[1], position[2] - offset]
        }
        fontSize={0.2}
        color="white"
      >
        {label}
      </Text>
    </>
  );
}
