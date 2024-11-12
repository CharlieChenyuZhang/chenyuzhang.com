import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setThought(e.target.value);
  };

  const isComplete = thought.trim() !== "";

  const handleSubmit = async () => {
    const inputText = `Thought: ${thought}`;

    setLoading(true); // Start loading spinner
    try {
      // Step 1: Generate the image
      const response = await fetch(`${backendDomain()}/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      setApiResponse(data);

      // Step 2: Perform sentiment analysis
      const sentimentResponse = await fetch(`${backendDomain()}/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const sentimentData = await sentimentResponse.json();
      setSentimentAnalysis(sentimentData.emotions);
    } catch (error) {
      console.error("Error fetching the image:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const showPlaceholder = !apiResponse && !loading;

  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>PoC</PageTitle>
        <Paragraph>
          Solution 1 <br />
          TTS: speak-tts
          <br />
          STT: react-speech-recognition <br />
          Pros: free npm packages <br />
          Cons: quality. Doesn't work with React@18, this would need an older
          versino of React@16. <br />
          Conclusion: not recommended unless you want to build a prototype.
        </Paragraph>

        <Paragraph>
          Solution 2 <br />
          TTS: OpenAI Audio API
          <br />
          STT: OpenAI Audio API <br />
          Pros: quality. <br />
          Cons: not free <br />
          Conclusion: recommended.
        </Paragraph>

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
                show={isComplete}
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
            </Box>
          </InputContainer>

          <ImageContainer>
            {loading ? (
              <>
                <CircularProgress color="inherit" />
                <Typography align="center" mt={2}>
                  Generating image...
                </Typography>
              </>
            ) : showPlaceholder ? (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  Your generated image will appear here!
                </Typography>
                <Typography align="center">
                  Fill out the prompt and click submit to see your personalized
                  image.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  (AI Detected) Emotions
                </Typography>
                <Typography align="center" sx={{ marginBottom: "20px" }}>
                  {sentimentAnalysis
                    ? sentimentAnalysis
                    : "No emotions detected"}
                </Typography>

                <Typography variant="h6" align="center" gutterBottom>
                  (AI Generated) Image Prompt
                </Typography>
                <Typography align="center">{apiResponse.prompt}</Typography>
                <img
                  src={apiResponse.imageUrl}
                  alt="Generated Illustration"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    marginTop: "1rem",
                  }}
                />
              </>
            )}
          </ImageContainer>
        </ProjectContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ProjectSmart;
