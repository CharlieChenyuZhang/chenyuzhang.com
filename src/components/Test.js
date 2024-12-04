import React, { useRef, useState } from "react";

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Webcam not supported by your browser.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/mp4",
    });
    mediaRecorderRef.current = mediaRecorder;

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/mp4" });
      setVideoBlob(videoBlob);
      videoRef.current.srcObject = null; // Stop streaming from webcam
      stream.getTracks().forEach((track) => track.stop()); // Stop webcam
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const saveVideo = () => {
    if (!videoBlob) return;
    const videoURL = URL.createObjectURL(videoBlob);
    const link = document.createElement("a");
    link.href = videoURL;
    link.download = "recorded-video.mp4";
    link.click();
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: "400px" }}></video>
      <div>
        {!recording && (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {recording && <button onClick={stopRecording}>Stop Recording</button>}
        {videoBlob && <button onClick={saveVideo}>Save Video</button>}
      </div>
    </div>
  );
};

export default VideoRecorder;
