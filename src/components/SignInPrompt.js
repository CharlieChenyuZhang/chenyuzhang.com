import React from "react";
import styled from "styled-components";
import { Typography, Box, Button, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const VIDEO_SRC =
  "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/855432-hd_1840_1034_25fps.mp4";

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  opacity: 1;
`;

const FrostedContainer = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  background: rgba(20, 20, 30, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  padding: 36px 28px 28px 28px;
  margin: 0 auto;
  color: #f5f7fa;
  z-index: 2;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.28);

  & *,
  & a {
    color: #f5f7fa !important;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.28);
  }

  a,
  .MuiButton-textPrimary {
    color: #90caf9 !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }
`;

const CenteredBox = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const OrDivider = styled(Divider)`
  && {
    color: #bfc9d1;
    opacity: 0.7;
    margin: 24px 0 18px 0;
    font-weight: 600;
    letter-spacing: 0.08em;
    font-size: 1rem;
  }
`;

const GoogleButton = styled(Button)`
  && {
    background: #4285f4;
    color: #fff;
    font-weight: 700;
    font-size: 1.08rem;
    letter-spacing: 0.03em;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(66, 133, 244, 0.1);
    margin-bottom: 8px;
    margin-top: 8px;
    padding: 10px 0;
    text-transform: none;
    transition: background 0.18s;

    &,
    & span,
    & .MuiButton-label,
    & .MuiButton-startIcon,
    & .MuiButton-endIcon {
      color: #fff !important;
    }

    &:hover {
      background: #357ae8;
    }
    .MuiButton-startIcon {
      margin-right: 8px;
    }
  }
`;

const SignInPrompt = ({ title, children, onGoogleSignIn }) => (
  <>
    <BackgroundVideo src={VIDEO_SRC} autoPlay loop muted playsInline />
    <CenteredBox>
      <FrostedContainer>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 800,
            letterSpacing: 0.5,
            mb: 2,
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.32)",
          }}
        >
          {title}
        </Typography>
        <GoogleButton
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={onGoogleSignIn}
        >
          Sign in with Google
        </GoogleButton>
        <OrDivider>OR</OrDivider>
        {children}
      </FrostedContainer>
    </CenteredBox>
  </>
);

export default SignInPrompt;
