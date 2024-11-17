import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import * as faceapi from "face-api.js";
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setLoading(false);
    };

    loadModels();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Ensure canvas matches video dimensions after video metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          adjustCanvasSize();
          detectFace();
        };
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      // Stop the webcam stream
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setFaceDetected(false);
      setConfidence(null);

      // Remove the video source to show the grey background
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Clear the canvas to remove the bounding box
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const adjustCanvasSize = () => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.offsetWidth;
      canvasRef.current.height = videoRef.current.offsetHeight;
    }
  };

  const detectFace = async () => {
    if (!videoRef.current) return;

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512 });
    setInterval(async () => {
      const result = await faceapi.detectSingleFace(videoRef.current, options);

      if (result) {
        setFaceDetected(true);
        setConfidence(result.score.toFixed(2)); // Update confidence score
        drawBox(result); // Draw box around the detected face
      } else {
        setFaceDetected(false);
        setConfidence(null);
      }
    }, 1000);
  };

  const drawBox = (detection) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const displaySize = {
      width: video.offsetWidth,
      height: video.offsetHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);

    const resizedDetection = faceapi.resizeResults(detection, displaySize);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding box with precise alignment
    const box = resizedDetection.box;
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y - 100, box.width, box.height);
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
          <i>Make sure the face detection confidence score is >= 0.8.</i>
          <br />
          <br />
          Click on the "LOOKS GOOD" button once you have completed the camera
          check below.
        </Typography>

        <VideoContainer>
          <Video ref={videoRef} autoPlay playsInline muted />
          <Canvas ref={canvasRef} />
        </VideoContainer>

        <br />
        {faceDetected ? (
          <Typography variant="body1" align="center" color="inherit">
            Face Detected with Confidence: {confidence ?? 0}
          </Typography>
        ) : (
          <Typography variant="body1" align="center" color="inherit">
            No face detected.
          </Typography>
        )}

        {!mediaStream ? (
          <CaptureButton onClick={startWebcam}>
            {loading ? "Loading Models..." : "Start Webcam"}
          </CaptureButton>
        ) : (
          <CaptureButton onClick={stopWebcam}>Looks good!</CaptureButton>
        )}
      </WebcamContainer>
    </MainContainer>
  );
};

export default WebcamTest;
