import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";

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
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const Canvas = styled.canvas`
  display: none;
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

const LearningVideo = () => {
  return (
    <MainContainer>
      <WebcamContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Learning Task
        </Typography>
        <Typography variant="body1" align="center" color="inherit">
          First, please watch the video below to familiarize yourself with the
          concept of Big-O Notation. You will then be directed to complete a
          programming task related to the concept.
          <br />
          <br />
          Please click on the “Next” button once you finish the video,
        </Typography>

        <VideoContainer>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/__vX2sjlpXU?si=TNHNystJtEKO5G0W"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </VideoContainer>

        <CaptureButton onClick={() => alert("next!!!")}>Next</CaptureButton>
      </WebcamContainer>
    </MainContainer>
  );
};

export default LearningVideo;