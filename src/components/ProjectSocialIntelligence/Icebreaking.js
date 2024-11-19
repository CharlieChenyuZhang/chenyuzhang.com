import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Typography,
  Button as MuiButton,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";

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

const ProfilesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileContainer = styled.div`
  width: 45%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 80%;
  }
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

const StyledButton = styled(MuiButton)``;

const DisplayContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #111;
  border: 1px solid white;
  border-radius: 4px;
  font-size: 1em;
  line-height: 1.5em;
  white-space: pre-wrap;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(CircularProgress)`
  color: #fff;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  border: white 1px solid;
  margin: 0 auto;
`;

const QuestionBox = styled(Box)`
  margin-bottom: 1.5rem;
  width: 100%;
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

export default function IceBreaking() {
  const [profile1, setProfile1] = useState({
    name: "",
    offer: "",
    lookingFor: "",
  });
  const [profile2, setProfile2] = useState({
    name: "",
    offer: "",
    lookingFor: "",
  });
  const [displayInfo, setDisplayInfo] = useState({
    similarities: "",
    iceBreakingQuestions1: [],
    explanations1: [],
    iceBreakingQuestions2: [],
    explanations2: [],
  });
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    const payload = { profiles: [profile1, profile2] };

    console.log("process.env.REACT_APP_BACKEND", process.env.REACT_APP_BACKEND);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/generate_icebreaking_questions`,
        payload
      )
      .then((response) => {
        const data = JSON.parse(response.data.result);
        setDisplayInfo({
          similarities: data?.similarities,
          iceBreakingQuestions1:
            data["iceBreakingQuestions (profile 1 to profile 2)"],
          explanations1: data["explanations (profile 1 to profile 2)"],
          iceBreakingQuestions2:
            data["iceBreakingQuestions (profile 2 to profile 1)"],
          explanations2: data["explanations (profile 2 to profile 1)"],
        });
      })
      .catch((error) =>
        console.error("Error generating icebreaking questions:", error)
      )
      .finally(() => setLoading(false));
  };

  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>PoC: Social Intelligence</PageTitle>
        <Paragraph>
          If each persona could either be a human or an AI agent, then, this
          relationship could be
          <br />
          a. Human - Human <br />
          b. Human - AI Agent <br /> c. AI Agent - AI Agent
        </Paragraph>

        <ProjectContainer>
          <ProfilesContainer>
            <ProfileContainer>
              <Typography variant="h6" align="center">
                Persona 1 (Human / AI Agent)
              </Typography>

              <QuestionBox>
                <Typography>Name</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile1.name}
                  onChange={(e) =>
                    setProfile1({ ...profile1, name: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>

              <QuestionBox>
                <Typography>What can you offer?</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile1.offer}
                  onChange={(e) =>
                    setProfile1({ ...profile1, offer: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>

              <QuestionBox>
                <Typography>What are you looking for?</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile1.lookingFor}
                  onChange={(e) =>
                    setProfile1({ ...profile1, lookingFor: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>
            </ProfileContainer>

            {displayInfo.similarities && (
              <DisplayContainer>
                <div>
                  <b>Similarities:</b> {displayInfo.similarities}
                </div>
                <br />

                {displayInfo.iceBreakingQuestions1.map((question, idx) => (
                  <div key={idx}>
                    <b>Question:</b> {question}
                    <br />
                    <b>Explanation:</b> {displayInfo.explanations1[idx]}
                    <br />
                    <br />
                  </div>
                ))}
              </DisplayContainer>
            )}
          </ProfilesContainer>

          {loading ? (
            <Spinner />
          ) : (
            <StyledButton
              onClick={handleGenerate}
              sx={{
                color: "white",
                backgroundColor: "black",
                border: "white 1px solid",
                "&:hover": {
                  backgroundColor: "grey",
                },
                width: "fit-content",
                margin: "0 auto",
              }}
            >
              Break the ice!
            </StyledButton>
          )}

          <ProfilesContainer>
            <ProfileContainer>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  marginTop: "40px",
                }}
              >
                Persona 2 (Human / AI Agent)
              </Typography>

              <QuestionBox>
                <Typography>Name</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile2.name}
                  onChange={(e) =>
                    setProfile2({ ...profile2, name: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>

              <QuestionBox>
                <Typography>What can you offer?</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile2.offer}
                  onChange={(e) =>
                    setProfile2({ ...profile2, offer: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>

              <QuestionBox>
                <Typography>What are you looking for?</Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={profile2.lookingFor}
                  onChange={(e) =>
                    setProfile2({ ...profile2, lookingFor: e.target.value })
                  }
                  disabled={loading}
                />
              </QuestionBox>
            </ProfileContainer>

            {displayInfo.similarities && (
              <DisplayContainer>
                <div>
                  <b>Similarities:</b> {displayInfo.similarities}
                </div>

                {displayInfo.iceBreakingQuestions2.map((question, idx) => (
                  <div key={idx}>
                    <b>Question:</b> {question}
                    <b>Explanation:</b> {displayInfo.explanations2[idx]}
                  </div>
                ))}
              </DisplayContainer>
            )}
          </ProfilesContainer>
        </ProjectContainer>
      </ContentContainer>
    </MainContainer>
  );
}
