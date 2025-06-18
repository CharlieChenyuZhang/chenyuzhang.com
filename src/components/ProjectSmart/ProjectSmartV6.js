import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Switch,
} from "@mui/material";
import { backendDomain } from "../../utils";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import fallbackThumb from "../../images/reading.gif";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(20, 30, 20, 0.7), rgba(20, 30, 20, 0.7)),
    url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80")
      no-repeat center center fixed;
  background-size: cover;
  color: #fff;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  background: rgba(30, 30, 40, 0.35);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  padding: 32px 24px;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  height: 50vh;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  background: rgba(40, 40, 60, 0.25);
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const AiIcon = styled.div`
  font-size: 1.5rem;
  margin-top: -4px;
  margin-right: ${(props) => (props.isUser ? "0" : "8px")};
  margin-left: ${(props) => (props.isUser ? "8px" : "0")};
`;

const SpeakerIcon = styled.div`
  font-size: 1.5rem;
  margin-top: -4px;
  cursor: pointer;
  margin-right: ${(props) => (props.isUser ? "8px" : "0")};
  margin-left: ${(props) => (props.isUser ? "0" : "8px")};
  color: ${(props) => (props.isUser ? "#fff" : "#ccc")};
`;

const MessageBubble = styled.div`
  background: ${(props) =>
    props.isUser ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.10)"};
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 12px 18px;
  max-width: 75%;
  white-space: pre-line;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-direction: column;
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
  width: 100%;
`;

const ButtonGroup = styled.div``;

// Language toggle styles
const LanguageToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const LanguageOption = styled.span`
  cursor: pointer;
  padding: 4px 12px;
  margin: 0 2px;
  border-radius: 6px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  color: ${(props) => (props.selected ? "#111" : "#fff")};
  background: ${(props) => (props.selected ? "#fff" : "transparent")};
  border: 1px solid ${(props) => (props.selected ? "#fff" : "transparent")};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${(props) => (props.selected ? "#fff" : "#222")};
    color: #fff;
  }
`;

const SideBySideContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
`;

// Fallback thumbnail: blurred neutral background with a video icon overlay
const FallbackThumbWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(120deg, #444 40%, #888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;
const FallbackThumbIcon = styled(VideoLibraryIcon)`
  color: #fff;
  font-size: 2.2rem !important;
  opacity: 0.7;
`;

const VideoSwitcherContainer = styled(Box)`
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(30, 30, 40, 0.45);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  padding: 18px 28px 8px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  max-width: 98vw;
  animation: fadeInSwitcher 0.7s cubic-bezier(0.4, 1.4, 0.6, 1) 1;
  background-image: radial-gradient(
    circle at 60% 40%,
    rgba(144, 202, 249, 0.1) 0%,
    rgba(30, 30, 40, 0.45) 80%
  );
  @keyframes fadeInSwitcher {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }
  @media (max-width: 600px) {
    top: 4px;
    padding: 8px 2vw 4px 2vw;
    border-radius: 1.2rem;
    min-width: 0;
    max-width: 100vw;
  }
`;

const ThumbnailsRow = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 0;
  margin-bottom: 2px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: thin;
  scrollbar-color: #444 #222;
  @media (max-width: 600px) {
    padding-bottom: 1px;
    margin-bottom: 1px;
  }
`;

const VideoThumbButton = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 4px 18px 0 rgba(31, 38, 135, 0.18);
  border: 3px solid transparent;
  width: 72px;
  height: 72px;
  overflow: visible;
  transition: box-shadow 0.22s, transform 0.18s, border 0.22s;
  position: relative;
  background: transparent;
  margin: 0 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover,
  &:focus {
    box-shadow: 0 0 0 10px rgba(144, 202, 249, 0.18),
      0 4px 18px 0 rgba(31, 38, 135, 0.18);
    transform: scale(1.1);
    z-index: 2;
  }
  ${(props) =>
    props.selected &&
    `
      border: 3px solid #90caf9;
      box-shadow: 0 0 0 16px rgba(144,202,249,0.18), 0 4px 18px 0 rgba(31,38,135,0.18);
      animation: borderPulse 1.2s infinite alternate;
      @keyframes borderPulse {
        0% { border-color: #90caf9; box-shadow: 0 0 0 16px rgba(144,202,249,0.18), 0 4px 18px 0 rgba(31,38,135,0.18); }
        100% { border-color: #fff; box-shadow: 0 0 0 22px rgba(144,202,249,0.10), 0 4px 18px 0 rgba(31,38,135,0.18); }
      }
      transform: scale(1.13);
      z-index: 3;
    `}
  @media (max-width: 600px) {
    width: 48px;
    height: 48px;
    margin: 0 5px;
    border-width: 2px;
  }
`;

const ThumbImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
  background: #222;
`;

const ThumbGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 60%,
    rgba(30, 30, 40, 0.38) 100%
  );
  pointer-events: none;
`;

const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  opacity: 0;
  font-size: 2rem;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
  pointer-events: none;
  transition: opacity 0.18s;
  ${VideoThumbButton}:hover &,
  ${VideoThumbButton}:focus & {
    opacity: 0.85;
  }
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const LabelsRow = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 0;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  margin-top: 2px;
`;

const ThumbLabel = styled.div`
  color: #fff;
  font-size: 1rem;
  text-align: center;
  margin-top: 2px;
  max-width: 80px;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  padding: 2px 12px;
  border-radius: 999px;
  background: ${(props) =>
    props.selected
      ? "linear-gradient(90deg, #e3f2fd 0%, #b3e5fc 100%)"
      : "transparent"};
  color: ${(props) => (props.selected ? "#1976d2" : "#fff")};
  box-shadow: ${(props) =>
    props.selected ? "0 2px 8px 0 rgba(144,202,249,0.18)" : "none"};
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  cursor: pointer;
  &:hover {
    background: ${(props) =>
      props.selected
        ? "linear-gradient(90deg, #b3e5fc 0%, #e3f2fd 100%)"
        : "rgba(255,255,255,0.10)"};
    color: #90caf9;
  }
  @media (max-width: 600px) {
    font-size: 0.78rem;
    margin-top: 1px;
    max-width: 54px;
    padding: 2px 6px;
  }
`;

const translations = {
  en: {
    placeholder: "What's on your mind today? Reflect freely...",
    send: "Send",
    startRecording: "◉ start Recording",
    stopRecording: "🔴 stop recording",
    embody: "Embody",
    reframe: "Reframe",
    mentalModel: "Mental Model",
    language: "English",
    languageToggle: "中文",
    processing: "Processing...",
    support: "Support",
  },
  zh: {
    placeholder: "你今天在想什么？请自由反思……",
    send: "发送",
    startRecording: "◉ 开始录音",
    stopRecording: "🔴 停止录音",
    embody: "具象化",
    reframe: "重新表述",
    mentalModel: "心智模型",
    language: "中文",
    languageToggle: "English",
    processing: "处理中……",
    support: "支持",
  },
};

// Add a list of available videos
const backgroundVideos = [
  {
    src: require("../../videos/855432-hd_1840_1034_25fps.mp4"),
    label: "Rain",
    thumb:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/3145794-uhd_3840_2160_25fps.mp4"),
    label: "Forest",
    thumb:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/2960875-hd_1920_1080_30fps.mp4"),
    label: "Lake",
    thumb:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/6549976-uhd_3840_2160_25fps.mp4"),
    label: "Library",
    thumb:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/4216161-uhd_3840_2160_25fps.mp4"),
    label: "Sunrise",
    thumb:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/2260458-uhd_3840_2160_25fps.mp4"),
    label: "Field",
    thumb:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/6859482-hd_1920_1080_30fps.mp4"),
    label: "City",
    thumb:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/3874730-hd_1920_1080_30fps.mp4"),
    label: "Street",
    thumb:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/6448156-hd_1920_1080_25fps.mp4"),
    label: "Blue Lake",
    thumb:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: require("../../videos/5594635-uhd_3840_2160_30fps.mp4"),
    label: "Clouds",
    thumb:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=200&q=40",
  },
];

// Helper for fallback
function getThumbSrc(video) {
  return video.thumb || null;
}

// Define a color palette for backgrounds
const videoColors = [
  "#90caf9", // Rain
  "#a5d6a7", // Forest
  "#b39ddb", // Lake
  "#ffe082", // Library
  "#ffab91", // Sunrise
  "#80cbc4", // Field
  "#f48fb1", // City
  "#ce93d8", // Street
  "#4dd0e1", // Blue Lake
  "#bcaaa4", // Clouds
];

const CompactSwitcherContainer = styled(Box)`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(30, 30, 40, 0.38);
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.13);
  padding: 6px 10px 6px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  max-width: 98vw;
  @media (max-width: 600px) {
    top: 2px;
    padding: 3px 2vw 3px 2vw;
    border-radius: 0.7rem;
    min-width: 0;
    max-width: 100vw;
  }
`;

const CompactThumbButton = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.1);
  border: 2.5px solid transparent;
  width: 44px;
  height: 44px;
  margin: 0 5px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  transition: box-shadow 0.18s, border 0.18s, transform 0.15s;
  flex-shrink: 0;
  &:hover,
  &:focus {
    box-shadow: 0 0 0 6px rgba(144, 202, 249, 0.13),
      0 2px 8px 0 rgba(31, 38, 135, 0.1);
    transform: scale(1.07);
    z-index: 2;
  }
  ${(props) =>
    props.selected &&
    `
      border: 2.5px solid #1976d2;
      box-shadow: 0 0 0 8px rgba(25,118,210,0.13), 0 2px 8px 0 rgba(31,38,135,0.10);
      transform: scale(1.12);
      z-index: 3;
    `}
  @media (max-width: 600px) {
    width: 34px;
    height: 34px;
    margin: 0 2px;
    border-width: 2px;
  }
`;

const CompactThumbCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${(props) => props.bgcolor || "#90caf9"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CompactPlayIcon = styled(VideoLibraryIcon)`
  color: #fff;
  font-size: 1.3rem !important;
  opacity: 0.92;
  margin-bottom: 0.5px;
  @media (max-width: 600px) {
    font-size: 1rem !important;
  }
`;

const CompactThumbLabel = styled.div`
  color: #fff;
  font-size: 0.78rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1px;
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  @media (max-width: 600px) {
    font-size: 0.68rem;
    margin-top: 0px;
  }
`;

// Apple-style frosted glass container
const AppleSwitcherContainer = styled(Box)`
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  padding: 8px 16px 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  max-width: 98vw;
  overflow-x: auto;
  transition: box-shadow 0.25s, background 0.25s;
  @media (max-width: 600px) {
    top: 2px;
    padding: 4px 2vw 4px 2vw;
    border-radius: 1rem;
    min-width: 0;
    max-width: 100vw;
  }
`;

const AppleThumbButton = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  margin: 0 8px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
  flex-shrink: 0;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
  &:hover,
  &:focus {
    box-shadow: 0 0 0 10px rgba(120, 180, 255, 0.13),
      0 2px 8px 0 rgba(31, 38, 135, 0.1);
    transform: scale(1.08);
    z-index: 2;
  }
  ${(props) =>
    props.selected &&
    `
      box-shadow: 0 0 0 16px rgba(120,180,255,0.18), 0 2px 8px 0 rgba(31,38,135,0.10);
      border: 2.5px solid #1976d2;
      transform: scale(1.13);
      z-index: 3;
    `}
  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    margin: 0 3px;
    border-width: 2px;
  }
`;

const AppleThumbCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${(props) => props.bgcolor || "#90caf9"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08) inset;
  ${(props) =>
    props.selected &&
    `
      box-shadow: 0 0 16px 2px rgba(120,180,255,0.18), 0 2px 8px 0 rgba(0,0,0,0.08) inset;
    `}
`;

const ApplePlayIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  svg {
    width: 22px;
    height: 22px;
    display: block;
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.18));
  }
  @media (max-width: 600px) {
    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const AppleThumbLabel = styled.div`
  color: #fff;
  font-size: 0.92rem;
  font-family: "SF Pro Display", "San Francisco", "Segoe UI", "Roboto", "Arial",
    sans-serif;
  font-weight: 600;
  text-align: center;
  margin-top: 2px;
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  background: linear-gradient(90deg, #fff 0%, #e3f2fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: color 0.18s, background 0.18s;
  @media (max-width: 600px) {
    font-size: 0.68rem;
    margin-top: 0px;
  }
`;

// Add a label above the switcher
const SwitcherLabel = styled.div`
  width: 100%;
  text-align: center;
  font-family: "SF Pro Display", "San Francisco", "Segoe UI", "Roboto", "Arial",
    sans-serif;
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  letter-spacing: 0.01em;
  margin-bottom: 8px;
  opacity: 0.82;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.18);
  @media (max-width: 600px) {
    font-size: 0.92rem;
    margin-bottom: 4px;
  }
`;

// iOS-style minimal SVG icons for each background
const bgIcons = [
  // Rain
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="10"
        rx="7"
        ry="5"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <line
        x1="7"
        y1="16"
        x2="7"
        y2="19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="16"
        x2="11"
        y2="19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="16"
        x2="15"
        y2="19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  // Forest
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="11,4 15,12 7,12"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <rect
        x="9.5"
        y="12"
        width="3"
        height="5"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
    </svg>
  ),
  // Lake
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="14"
        rx="7"
        ry="3"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <ellipse
        cx="11"
        cy="8"
        rx="4"
        ry="2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
    </svg>
  ),
  // Library
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="12"
        height="10"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <line x1="8" y1="6" x2="8" y2="16" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="6" x2="14" y2="16" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
  // Sunrise
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11"
        cy="14"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <line
        x1="11"
        y1="4"
        x2="11"
        y2="8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="10"
        x2="7"
        y2="12"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="10"
        x2="15"
        y2="12"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  // Field
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="15"
        rx="7"
        ry="2.5"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M4 15 Q7 10 11 13 Q15 16 18 12"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  ),
  // City
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="10"
        width="3"
        height="6"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="7"
        width="3"
        height="9"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="12"
        width="3"
        height="4"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  ),
  // Street
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9"
        y="6"
        width="4"
        height="10"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <line x1="11" y1="6" x2="11" y2="16" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
  // Blue Lake
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="14"
        rx="7"
        ry="3"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <ellipse
        cx="11"
        cy="8"
        rx="4"
        ry="2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <circle cx="11" cy="11" r="1.5" fill={color} />
    </svg>
  ),
  // Clouds
  (color) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="11"
        cy="13"
        rx="7"
        ry="3"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      />
      <ellipse
        cx="8"
        cy="12"
        rx="2"
        ry="1"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
      <ellipse
        cx="14"
        cy="12"
        rx="2"
        ry="1"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  ),
];

// Helper to determine icon color (white for dark, black for light backgrounds)
function iconColor(bg) {
  // Use luminance to decide
  if (!bg) return "#fff";
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7 ? "#222" : "#fff";
}

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null); // Ref for audio playback
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [loadingTTSIds, setLoadingTTSIds] = useState(new Set());
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("smart-journaling-language") || "en";
  });
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const t = translations[language];

  // Persist language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("smart-journaling-language", language);
  }, [language]);

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
      setThought(data.text ?? "");
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleChange = (e) => {
    setThought(e.target.value ?? "");
  };

  const handleReframeSubmit = async () => {
    if (!thought.trim()) return;

    const inputText = `Thought: ${thought}`;
    setLoading(true);

    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const tutorResponse = await fetch(`${backendDomain()}/reframe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText, language }),
      });

      const tutorData = await tutorResponse.json();
      setConversation((prev) => [
        ...prev,
        { text: tutorData.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching the tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handlePlayTTS = async (what2Speak, messageId) => {
    if (what2Speak) {
      setLoadingTTSIds((prev) => new Set([...prev, messageId]));
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-tts",
            voice: "coral",
            input: what2Speak,
            instructions: "Speak in a calm, soothing, and reassuring tone.",
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
      } finally {
        setLoadingTTSIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }
    }
  };

  return (
    <>
      {/* Background Video */}
      <BackgroundVideo
        src={backgroundVideos[selectedVideoIdx].src}
        autoPlay
        loop
        muted
      />
      <AppleSwitcherContainer>
        {backgroundVideos.map((video, idx) => (
          <AppleThumbButton
            key={video.label}
            selected={selectedVideoIdx === idx}
            onClick={() => setSelectedVideoIdx(idx)}
            aria-label={video.label}
            title={video.label}
          >
            <AppleThumbCircle
              bgcolor={videoColors[idx % videoColors.length]}
              selected={selectedVideoIdx === idx}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {bgIcons[idx % bgIcons.length](
                  iconColor(videoColors[idx % videoColors.length])
                )}
              </span>
            </AppleThumbCircle>
          </AppleThumbButton>
        ))}
      </AppleSwitcherContainer>
      <MainContainer>
        <ContentContainer>
          {/* Language Toggle */}
          <LanguageToggleContainer>
            <LanguageOption
              selected={language === "en"}
              onClick={() => setLanguage("en")}
            >
              English
            </LanguageOption>
            <LanguageOption
              selected={language === "zh"}
              onClick={() => setLanguage("zh")}
            >
              中文
            </LanguageOption>
          </LanguageToggleContainer>
          {/* <Typography variant="h4" align="center" gutterBottom>
            SMART Journaling
          </Typography> */}
          <ChatContainer ref={chatContainerRef}>
            {conversation.map((msg, index) => (
              <MessageContainer key={index} isUser={msg.isUser}>
                {!msg.isUser && <AiIcon>✧₊⁺</AiIcon>}{" "}
                {/* AI icon next to message */}
                <MessageBubble isUser={msg.isUser}>
                  {msg.text && <span>{msg.text}</span>}
                </MessageBubble>
                {!msg.isUser && msg.text && (
                  <SpeakerIcon onClick={() => handlePlayTTS(msg.text, index)}>
                    {loadingTTSIds.has(index) ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      "၊၊||၊"
                    )}
                  </SpeakerIcon>
                )}
              </MessageContainer>
            ))}

            {loading && (
              <MessageContainer isUser={false}>
                <AiIcon>✧₊⁺</AiIcon>
                <MessageBubble>
                  <CircularProgress size={20} color="inherit" /> {t.processing}
                </MessageBubble>
              </MessageContainer>
            )}
          </ChatContainer>

          <InputContainer>
            <StyledTextField
              placeholder={t.placeholder}
              variant="outlined"
              value={thought}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{ marginRight: "10px" }}
            />

            <ButtonGroup>
              {/* record button */}
              <Button
                variant="outlined"
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": { backgroundColor: "grey" },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {isRecording ? <>{t.stopRecording}</> : <>{t.startRecording}</>}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReframeSubmit}
                disabled={!thought.trim()}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": { backgroundColor: "grey" },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {t.reframe}
              </Button>
            </ButtonGroup>

            <audio ref={audioRef} />
          </InputContainer>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default ProjectSmart;
