import React, { useState, useRef } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { backendDomain } from "../../utils";

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
  margin-top: 83px;
  margin-left: 60px;
  margin-right: 60px;
  width: 100%;
`;

const ProjectContainer = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  border: white 1px solid;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  max-width: 500px;
  width: 100%;
  padding-right: 2rem;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  width: 100%;
  padding: 1rem;
  border: 1px solid white;
  background-color: #111;
  min-height: 300px;
`;

const QuestionBox = styled(Box)`
  margin-bottom: 1.5rem;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    color: #fff;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #fff;
    }
    &:hover fieldset {
      border-color: #ccc;
    }
    &.Mui-focused fieldset {
      border-color: #fff;
    }
  }
  & .MuiInputLabel-root {
    color: #fff;
  }
`;

const SubmitButton = styled(Button)`
  display: ${(props) => (props.show ? "block" : "none")};
`;

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Paragraph = styled.div`
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 50rem;
  font-size: 1.125rem;
  line-height: 150%;
  font-weight: 400;
  font-family: sans-serif;
`;

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [sentimentAnalysisTutor, setSentimentAnalysisTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null); // Ref for audio playback

  const handleChange = (e) => {
    setThought(e.target.value);
  };

  const handleSubmit = async () => {
    const inputText = `Thought: ${thought}`;
    setLoading(true);

    try {
      const tutorResponse = await fetch(`${backendDomain()}/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const tutorData = await tutorResponse.json();
      setApiResponse(tutorData);

      // Play TTS immediately after receiving the tutor response
      // handlePlayTTS(tutorData);

      const sentimentResponse = await fetch(`${backendDomain()}/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const sentimentData = await sentimentResponse.json();

      const sentimentResponseTutor = await fetch(
        `${backendDomain()}/sentiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputText: tutorData.response }),
        }
      );

      const sentimentDataTutor = await sentimentResponseTutor.json();
      setSentimentAnalysis(sentimentData.emotions);
      setSentimentAnalysisTutor(sentimentDataTutor.emotions);
    } catch (error) {
      console.error("Error fetching the tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTTS = async () => {
    if (apiResponse && apiResponse.response) {
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            voice: "alloy",
            input: apiResponse.response,
          }),
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error with TTS:", error);
      }
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) =>
        audioChunks.push(event.data);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await handleTranscribe(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      setThought(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>PoC</PageTitle>
        <Paragraph>Using OpenAI's Real Time API.</Paragraph>
        <ProjectContainer>
          <InputContainer>
            <Box>
              <QuestionBox>
                <Typography>What's on your mind today?</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={thought}
                  onChange={handleChange}
                />
              </QuestionBox>
              <SubmitButton
                show={thought.trim() !== ""}
                onClick={handleSubmit}
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  border: "white 1px solid",
                  width: "fit-content",
                }}
              >
                Submit
              </SubmitButton>

              <SubmitButton
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                sx={{
                  color: "white",
                  backgroundColor: isRecording ? "red" : "black",
                  border: "white 1px solid",
                  marginLeft: "10px",
                }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </SubmitButton>
            </Box>
          </InputContainer>

          <ImageContainer>
            {loading ? (
              <>
                <CircularProgress color="inherit" />
                <Typography align="center" mt={2}>
                  Processing request...
                </Typography>
              </>
            ) : (
              apiResponse && (
                <>
                  <Typography variant="h6" align="center" gutterBottom>
                    Detected Human's Emotions
                  </Typography>
                  <Typography align="center" sx={{ marginBottom: "20px" }}>
                    {sentimentAnalysis
                      ? sentimentAnalysis
                      : "No emotions detected"}
                  </Typography>

                  <Typography variant="h6" align="center" gutterBottom>
                    Detected AI Tutor's Emotions
                  </Typography>
                  <Typography align="center" sx={{ marginBottom: "20px" }}>
                    {sentimentAnalysisTutor
                      ? sentimentAnalysisTutor
                      : "No emotions detected"}
                  </Typography>

                  <Typography variant="h6" align="center" gutterBottom>
                    Tutor Response
                  </Typography>
                  <Typography align="center">{apiResponse.response}</Typography>
                  <SubmitButton
                    onClick={handlePlayTTS}
                    sx={{
                      color: "white",
                      backgroundColor: "black",
                      border: "white 1px solid",
                      marginTop: "10px",
                      width: "fit-content",
                    }}
                  >
                    Play TTS
                  </SubmitButton>
                  <audio ref={audioRef} />
                </>
              )
            )}
          </ImageContainer>
        </ProjectContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ProjectSmart;
