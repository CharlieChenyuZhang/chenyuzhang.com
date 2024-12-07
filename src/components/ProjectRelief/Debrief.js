import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { backendDomain } from "../../utils";

// Reusable styles
const Divider = styled.div`
  height: 30px;
`;

const WhiteCheckbox = styled(Checkbox)({
  color: "white",
  "&.Mui-checked": {
    color: "white",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
});

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  border: white 1px solid;
  background-color: #111;
`;

const InputContainer = styled.div`
  width: 100%;
  padding-top: 1rem;
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
    &.Mui-focused {
      color: #fff;
    }
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const Debrief = () => {
  // State variables for Tutor AI
  const [tutorEmotions, setTutorEmotions] = useState([]);
  const [tutorEmotionExplanation, setTutorEmotionExplanation] = useState("");
  const [tutorImpact, setTutorImpact] = useState([]);
  const [tutorAiAssistance, setTutorAiAssistance] = useState("");
  const [tutorSuggestions, setTutorSuggestions] = useState("");

  // State variables for Intervention AI
  const [interventionEmotions, setInterventionEmotions] = useState([]);
  const [interventionEmotionExplanation, setInterventionEmotionExplanation] =
    useState("");
  const [interventionImpact, setInterventionImpact] = useState([]);
  const [interventionAiAssistance, setInterventionAiAssistance] = useState("");
  const [interventionSuggestions, setInterventionSuggestions] = useState("");

  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      tutor: {
        emotions: tutorEmotions,
        emotionExplanation: tutorEmotionExplanation,
        impact: tutorImpact,
        aiAssistance: tutorAiAssistance,
        suggestions: tutorSuggestions,
      },
      intervention: {
        emotions: interventionEmotions,
        emotionExplanation: interventionEmotionExplanation,
        impact: interventionImpact,
        aiAssistance: interventionAiAssistance,
        suggestions: interventionSuggestions,
      },
    };

    try {
      const response = await fetch(`${backendDomain()}/relief/track/debrief`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId:
            sessionStorage.getItem("mas630ResearchUserId") || "unknownUser",
        }),
      });

      // TODO: for testing purpose
      if (true || response.ok) {
        setConfirmationMessage(`
          This is the end of the study.

          We would like to take this opportunity to explain the purpose of the study and what was happening throughout the tasks.

          The main goal of this research was to understand how people respond emotionally and behaviorally when faced with a challenging learning experience, particularly during moments of frustration. To achieve this, we intentionally designed a difficult programming task to observe your reactions and how you managed feelings of challenge or frustration.

          During the study, we collected data in several ways, including your performance on the task, facial expressions, and any verbal responses (if applicable). This data helps us better understand the emotional and behavioral patterns that occur when learners encounter difficult situations. Additionally, we explored how AI-driven interventions could potentially help improve persistence.

          For example, if you clicked the "Frustrated" button at any point, our system delivered supportive messages to acknowledge your frustration and encourage you to continue. These interventions were designed to test whether emotional support, delivered in real-time, could influence your decision to persist through a challenging task.

          Our study is focused on how non-verbal behaviors, emotional reactions, and AI interventions can influence learning persistence. The insights from this research could contribute to improving online learning environments by making them more adaptive to the emotional needs of students during difficult tasks.

          If you have any questions about the study or would like to know more about how your data will be used, feel free to reach out to the research team. We truly appreciate your time and participation. You have been entered into the drawing for one of the $100 gift cards as a token of our appreciation!

          RIGHTS OF STUDY PARTICIPANTS:
          You are not waiving any legal claims, rights, or remedies because of your participation in this research study. If you feel you have been treated unfairly, or you have questions regarding your rights as a study participant, you may contact the Chairman of the Committee on the Use of Humans as Experimental Subjects, M.I.T., Room E25-143B, 77 Massachusetts Ave, Cambridge, MA 02139, phone 1-617-253-6787.

          Research Team Contact: Chenyu Zhang, chenyuzh@mit.edu
          COUHES Contact: couhes@mit.edu or call 617-253-6787
          
          You can close the browser now.
        `);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmotionQuestion = (title, emotions, setEmotions) => (
    <>
      <Typography>{title}</Typography>
      {[
        "joy",
        "curiosity",
        "frustration",
        "confidence",
        "confusion",
        "relief",
        "excitement",
      ].map((emotion) => (
        <FormControlLabel
          key={emotion}
          control={
            <WhiteCheckbox
              checked={emotions.includes(emotion)}
              onChange={() => handleCheckboxChange(setEmotions, emotion)}
            />
          }
          label={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
        />
      ))}
      <Divider />
    </>
  );

  const renderImpactQuestion = (impact, setImpact) => (
    <>
      <Typography>
        How would you describe the impact of the AI on your overall experience?
      </Typography>
      {[
        "It made the experience easier.",
        "It enhanced my understanding.",
        "It saved me time.",
        "It made me feel supported.",
        "It didn't help much.",
      ].map((label) => (
        <FormControlLabel
          key={label}
          control={
            <WhiteCheckbox
              checked={impact.includes(label)}
              onChange={() => handleCheckboxChange(setImpact, label)}
            />
          }
          label={label}
        />
      ))}
      <StyledTextField
        label="Other (Please specify)"
        fullWidth
        variant="outlined"
        onChange={(e) => setImpact([...impact, e.target.value])}
      />
      <Divider />
    </>
  );

  const renderTextQuestion = (label, value, setter) => (
    <StyledTextField
      label={label}
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => setter(e.target.value)}
    />
  );

  return (
    <MainContainer>
      {!confirmationMessage ? (
        <ContentContainer>
          <Box
            textAlign="center"
            marginBottom="1rem"
            sx={{ marginTop: "100px" }}
          >
            <Typography variant="h5" fontWeight="bold">
              Debriefing / Post-Research Questionnaire
            </Typography>
          </Box>
          <ProjectContainer>
            <InputContainer>
              {/* Tutor AI Section */}
              <Typography variant="h6">Tutor AI</Typography>
              {renderEmotionQuestion(
                "What emotions did you experience during your interaction with the Tutor AI?",
                tutorEmotions,
                setTutorEmotions
              )}
              {renderTextQuestion(
                "Please explain your emotional experience with the Tutor AI:",
                tutorEmotionExplanation,
                setTutorEmotionExplanation
              )}
              <Divider />
              {renderImpactQuestion(tutorImpact, setTutorImpact)}
              {renderTextQuestion(
                "How did the Tutor AI assist you during the experience?",
                tutorAiAssistance,
                setTutorAiAssistance
              )}
              <Divider />
              {renderTextQuestion(
                "What could the Tutor AI have done better to improve your experience?",
                tutorSuggestions,
                setTutorSuggestions
              )}
              <Divider />

              {/* Intervention AI Section */}
              <Typography variant="h6">Intervention AI</Typography>
              {renderEmotionQuestion(
                "What emotions did you experience during your interaction with the Intervention AI?",
                interventionEmotions,
                setInterventionEmotions
              )}
              {renderTextQuestion(
                "Please explain your emotional experience with the Intervention AI:",
                interventionEmotionExplanation,
                setInterventionEmotionExplanation
              )}
              <Divider />
              {renderImpactQuestion(interventionImpact, setInterventionImpact)}
              {renderTextQuestion(
                "How did the Intervention AI assist you during the experience?",
                interventionAiAssistance,
                setInterventionAiAssistance
              )}
              <Divider />
              {renderTextQuestion(
                "What could the Intervention AI have done better to improve your experience?",
                interventionSuggestions,
                setInterventionSuggestions
              )}
              <Divider />

              <SubmitButton
                disabled={loading}
                onClick={handleSubmit}
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  border: "white 1px solid",
                }}
              >
                Submit
              </SubmitButton>
              {loading && <CircularProgress color="inherit" />}
            </InputContainer>
          </ProjectContainer>
        </ContentContainer>
      ) : (
        <Box textAlign="center" margin="4rem" maxWidth={"800px"}>
          <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
            {confirmationMessage}
          </Typography>
        </Box>
      )}
    </MainContainer>
  );
};

export default Debrief;
