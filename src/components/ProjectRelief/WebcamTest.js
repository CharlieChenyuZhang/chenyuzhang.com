import React from "react";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
`;

const WebcamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  color: #fff;
  border: 1px solid white;
`;

const VideoContainer = styled.div`
  background-color: #444;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const CaptureButton = styled(Button)`
  margin-top: 1.5rem !important;
  color: white !important;
  background-color: black !important;
  border: 1px solid white !important;

  &:hover {
    background-color: #888 !important;
  }
`;

const WebcamTest = () => {
  const navigate = useNavigate();

  return (
    <MainContainer>
      <WebcamContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Reminder
        </Typography>
        <Typography variant="body1" align="center" color="inherit">
          Please make sure you have opened Zoom and are sharing your screen.
          Ensure your face is clearly recorded on the screen.
          <br />
          <br />
          Click on the "LOOKS GOOD" button once you have completed the check.
        </Typography>

        <br />
        <CaptureButton
          onClick={() => {
            navigate("/project/relief/learning-video");
          }}
        >
          Looks good!
        </CaptureButton>
      </WebcamContainer>
    </MainContainer>
  );
};

export default WebcamTest;
