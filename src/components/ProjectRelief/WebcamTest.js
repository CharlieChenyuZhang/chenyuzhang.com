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

const WebcamTest = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  return (
    <MainContainer>
      <WebcamContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Test your webcam
        </Typography>
        <Typography variant="body1" align="center" color="inherit">
          Since our study includes the collection of video data, please ensure
          you are in a well-lit room. Click on the "START WEBCAM" button to
          check your video.
          <br />
          <br />
          Click on the "LOOKS GOOD" button once you have completed the camera
          check below.
        </Typography>

        <VideoContainer>
          <Video ref={videoRef} autoPlay playsInline muted />

          <Canvas ref={canvasRef} />
        </VideoContainer>

        {!mediaStream ? (
          <CaptureButton onClick={startWebcam}>Start Webcam</CaptureButton>
        ) : (
          <CaptureButton onClick={stopWebcam}>Looks good!</CaptureButton>
        )}
      </WebcamContainer>
    </MainContainer>
  );
};

export default WebcamTest;
