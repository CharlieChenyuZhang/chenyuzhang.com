import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from "@mui/material";
import { backendDomain } from "../../utils";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const WhiteRadio = styled(Radio)({
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

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem 0;
  text-align: center;
`;

const Divider = styled.div`
  height: 30px;
`;

const WhiteSlider = styled(Slider)({
  color: "white",
  "& .MuiSlider-track": {
    color: "white",
  },
  "& .MuiSlider-rail": {
    color: "rgba(255, 255, 255, 0.3)", // Light gray rail
  },
  "& .MuiSlider-thumb": {
    color: "white",
    border: "2px solid white", // White thumb with border
  },
  "& .MuiSlider-mark": {
    color: "rgba(255, 255, 255, 0.7)", // Lighter white for marks
  },
});

const ProjectRelief = () => {
  const navigate = useNavigate();

  // State variables for each question and error messages
  const [mbtiType, setMbtiType] = useState("");
  const [email, setEmail] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [originGrewUp, setOriginGrewUp] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [schoolAffiliation, setSchoolAffiliation] = useState("");
  const [pythonComfort, setPythonComfort] = useState(3);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    sessionStorage.removeItem("mas630ResearchUserId"); // Remove any existing key
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!mbtiType) newErrors.mbtiType = "MBTI type is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required.";
    if (!ethnicity) newErrors.ethnicity = "Ethnicity selection is required.";
    if (!countryOfOrigin)
      newErrors.countryOfOrigin = "Country of origin is required.";
    if (!originGrewUp)
      newErrors.originGrewUp = "Please specify where you grew up.";
    if (!gender) newErrors.gender = "Gender selection is required.";
    if (!age || isNaN(age)) newErrors.age = "Valid age is required.";
    if (!schoolAffiliation)
      newErrors.schoolAffiliation = "School affiliation is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);
    const newUserId = uuidv4();
    const formData = {
      userId: newUserId,
      mbtiType,
      email,
      ethnicity,
      countryOfOrigin,
      originGrewUp,
      gender,
      age,
      schoolAffiliation,
      pythonComfort,
    };

    try {
      const response = await fetch(`${backendDomain()}/relief/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        sessionStorage.setItem("mas630ResearchUserId", newUserId); // Save userId to sessionStorage
        navigate("/project/relief/webcam-test");
      } else {
        alert("Something's wrong. Please contact the research team!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        {/* <PageTitle>Project Relief</PageTitle> */}
        <Box textAlign="center" marginBottom="1rem" sx={{ marginTop: "100px" }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to our Gen AI Python Tutor Study
          </Typography>
          <Typography variant="body1" color="inherit">
            To get started, please fill out the form below.
          </Typography>
        </Box>
        <ProjectContainer>
          <InputContainer>
            <StyledTextField
              label="MBTI Personality Type"
              fullWidth
              variant="outlined"
              value={mbtiType}
              onChange={(e) => {
                setMbtiType(e.target.value);
                setErrors((prev) => ({ ...prev, mbtiType: "" }));
              }}
              error={!!errors.mbtiType}
              helperText={errors.mbtiType}
            />
            <Divider />
            <StyledTextField
              label="Email Address"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={!!errors.email}
              helperText={errors.email}
            />
            <Divider />
            <Typography>What is your race/ethnicity?</Typography>
            <RadioGroup
              value={ethnicity}
              onChange={(e) => {
                setEthnicity(e.target.value);
                setErrors((prev) => ({ ...prev, ethnicity: "" }));
              }}
            >
              <FormControlLabel
                value="American Indian or Alaska Native"
                control={<WhiteRadio />}
                label="American Indian or Alaska Native"
              />
              <FormControlLabel
                value="East Asian (e.g., Chinese, Japanese, Korean)"
                control={<WhiteRadio />}
                label="East Asian (e.g., Chinese, Japanese, Korean)"
              />
              <FormControlLabel
                value="South Asian (e.g., Indian, Pakistani, Bangladeshi)"
                control={<WhiteRadio />}
                label="South Asian (e.g., Indian, Pakistani, Bangladeshi)"
              />
              <FormControlLabel
                value="Southeast Asian (e.g., Vietnamese, Thai, Filipino)"
                control={<WhiteRadio />}
                label="Southeast Asian (e.g., Vietnamese, Thai, Filipino)"
              />
              <FormControlLabel
                value="Central Asian (e.g., Kazakh, Uzbek)"
                control={<WhiteRadio />}
                label="Central Asian (e.g., Kazakh, Uzbek)"
              />
              <FormControlLabel
                value="Black or African American"
                control={<WhiteRadio />}
                label="Black or African American"
              />
              <FormControlLabel
                value="Hispanic or Latino"
                control={<WhiteRadio />}
                label="Hispanic or Latino"
              />
              <FormControlLabel
                value="Native Hawaiian or Other Pacific Islander"
                control={<WhiteRadio />}
                label="Native Hawaiian or Other Pacific Islander"
              />
              <FormControlLabel
                value="White"
                control={<WhiteRadio />}
                label="White"
              />
              <FormControlLabel
                value="Other"
                control={<WhiteRadio />}
                label="Other"
              />
            </RadioGroup>
            {errors.ethnicity && (
              <Typography color="error">{errors.ethnicity}</Typography>
            )}
            <Divider />
            <StyledTextField
              label="Country of Origin"
              fullWidth
              variant="outlined"
              value={countryOfOrigin}
              onChange={(e) => {
                setCountryOfOrigin(e.target.value);
                setErrors((prev) => ({ ...prev, countryOfOrigin: "" }));
              }}
              error={!!errors.countryOfOrigin}
              helperText={errors.countryOfOrigin}
            />
            <Divider />
            <StyledTextField
              label="If origin is X but grew up in Y"
              fullWidth
              variant="outlined"
              value={originGrewUp}
              onChange={(e) => {
                setOriginGrewUp(e.target.value);
                setErrors((prev) => ({ ...prev, originGrewUp: "" }));
              }}
              error={!!errors.originGrewUp}
              helperText={errors.originGrewUp}
            />
            <Divider />
            <Typography>What is your gender?</Typography>
            <RadioGroup
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setErrors((prev) => ({ ...prev, gender: "" }));
              }}
            >
              <FormControlLabel
                value="Male"
                control={<WhiteRadio />}
                label="Male"
              />
              <FormControlLabel
                value="Female"
                control={<WhiteRadio />}
                label="Female"
              />
              <FormControlLabel
                value="Non-binary/Third Gender"
                control={<WhiteRadio />}
                label="Non-binary/Third Gender"
              />
              <FormControlLabel
                value="Other"
                control={<WhiteRadio />}
                label="Other"
              />
            </RadioGroup>
            {errors.gender && (
              <Typography color="error">{errors.gender}</Typography>
            )}
            <Divider />
            <StyledTextField
              label="Age"
              fullWidth
              variant="outlined"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setErrors((prev) => ({ ...prev, age: "" }));
              }}
              error={!!errors.age}
              helperText={errors.age}
            />
            <Divider />
            <Typography>What is your school affiliation?</Typography>
            <RadioGroup
              value={schoolAffiliation}
              onChange={(e) => {
                setSchoolAffiliation(e.target.value);
                setErrors((prev) => ({ ...prev, schoolAffiliation: "" }));
              }}
            >
              <FormControlLabel
                value="MIT"
                control={<WhiteRadio />}
                label="MIT"
              />
              <FormControlLabel
                value="Harvard"
                control={<WhiteRadio />}
                label="Harvard"
              />
              <FormControlLabel
                value="Other"
                control={<WhiteRadio />}
                label="Other"
              />
            </RadioGroup>
            {errors.schoolAffiliation && (
              <Typography color="error">{errors.schoolAffiliation}</Typography>
            )}
            <Divider />
            <Typography>
              How comfortable are you with Python programming?
            </Typography>
            <WhiteSlider
              value={pythonComfort}
              onChange={(e, newValue) => setPythonComfort(newValue)}
              step={1}
              min={1}
              max={5}
              marks
              valueLabelDisplay="auto"
            />
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
    </MainContainer>
  );
};

export default ProjectRelief;
