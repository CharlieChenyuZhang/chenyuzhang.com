import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { backendDomain } from "../utils";

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
  min-height: 300px; /* Ensures it has a visible height */
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

const ProjectRelief = () => {
  const [morningAnswers, setMorningAnswers] = useState({
    grateful: "",
    great: "",
    affirmation: "",
  });
  const [eveningAnswers, setEveningAnswers] = useState({
    highlights: "",
    learn: "",
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (section, field) => (e) => {
    const setAnswers =
      section === "morning" ? setMorningAnswers : setEveningAnswers;
    setAnswers((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isMorningComplete = Object.values(morningAnswers).every(
    (answer) => answer !== ""
  );
  const isEveningComplete = Object.values(eveningAnswers).every(
    (answer) => answer !== ""
  );

  // mode: m - morning; e - evening
  const handleSubmit = async (mode = "m") => {
    const inputText =
      mode === "m"
        ? `
      Grateful: ${morningAnswers.grateful}
      Great: ${morningAnswers.great}
      Affirmation: ${morningAnswers.affirmation}
    `
        : `
      Highlights: ${eveningAnswers.highlights}
      Learn: ${eveningAnswers.learn}`;

    setLoading(true); // Start loading spinner
    try {
      // step 1: generate the image
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
        <PageTitle>Project Relief</PageTitle>

        <ProjectContainer>
          <InputContainer>
            <Box>
              <QuestionBox>
                <PageTitle>Welcome to our Gen AI Python Tutor Study</PageTitle>
                To get started, please enter the unique participant ocde that
                was assigned to you below.
              </QuestionBox>
              <SubmitButton
                show={isMorningComplete}
                onClick={() => handleSubmit("m")}
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
        </ProjectContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default ProjectRelief;
