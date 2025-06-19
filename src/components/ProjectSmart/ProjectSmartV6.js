import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Switch,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { backendDomain } from "../../utils";
import fallbackThumb from "../../images/reading.gif";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ModeIcon from "@mui/icons-material/Mode";
import LogoutIcon from "@mui/icons-material/Logout";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { auth, provider } from "../../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import SignInPrompt from "../SignInPrompt";
import html2canvas from "html2canvas";

// Import all translations
const translations = {
  ar: require("../../i18n/ar.json"),
  cs: require("../../i18n/cs.json"),
  da: require("../../i18n/da.json"),
  de: require("../../i18n/de.json"),
  el: require("../../i18n/el.json"),
  en: require("../../i18n/en.json"),
  es: require("../../i18n/es.json"),
  fi: require("../../i18n/fi.json"),
  fr: require("../../i18n/fr.json"),
  hi: require("../../i18n/hi.json"),
  hu: require("../../i18n/hu.json"),
  id: require("../../i18n/id.json"),
  it: require("../../i18n/it.json"),
  ja: require("../../i18n/ja.json"),
  ko: require("../../i18n/ko.json"),
  nl: require("../../i18n/nl.json"),
  no: require("../../i18n/no.json"),
  pl: require("../../i18n/pl.json"),
  pt: require("../../i18n/pt.json"),
  ro: require("../../i18n/ro.json"),
  ru: require("../../i18n/ru.json"),
  sv: require("../../i18n/sv.json"),
  tr: require("../../i18n/tr.json"),
  uk: require("../../i18n/uk.json"),
  vi: require("../../i18n/vi.json"),
  zh: require("../../i18n/zh.json"),
};

// Language names in their native form
const languageNames = {
  ar: "العربية",
  cs: "Čeština",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  es: "Español",
  fi: "Suomi",
  fr: "Français",
  hi: "हिन्दी",
  hu: "Magyar",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  no: "Norsk",
  pl: "Polski",
  pt: "Português",
  ro: "Română",
  ru: "Русский",
  sv: "Svenska",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  zh: "中文",
};

// Styled components
const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 100px;
  background-size: cover;
  color: #fff;
  position: relative;

  @media (max-width: 600px) {
    padding: 12px;
    padding-top: 80px;
  }
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
  margin: 0 auto;
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
  position: relative;
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
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
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
  z-index: -1;
  pointer-events: none;
  transition: opacity 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  opacity: ${(props) => (props.visible ? 1 : 0)};
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

// Update LanguageToggleContainer styles for the new dropdown
const StyledFormControl = styled(FormControl)`
  min-width: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  & .MuiOutlinedInput-root {
    color: white;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &.Mui-focused fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }
  & .MuiSelect-icon {
    color: rgba(255, 255, 255, 0.7);
  }
  & .MuiMenuItem-root {
    min-height: 32px;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

// Add a list of available videos
const backgroundVideos = [
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/855432-hd_1840_1034_25fps.mp4",
    label: "Rain",
    thumb:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/3145794-uhd_3840_2160_25fps.mp4",
    label: "Forest",
    thumb:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/2960875-hd_1920_1080_30fps.mp4",
    label: "Lake",
    thumb:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/6549976-uhd_3840_2160_25fps.mp4",
    label: "Library",
    thumb:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/4216161-uhd_3840_2160_25fps.mp4",
    label: "Sunrise",
    thumb:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/2260458-uhd_3840_2160_25fps.mp4",
    label: "Field",
    thumb:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/6859482-hd_1920_1080_30fps.mp4",
    label: "City",
    thumb:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/3874730-hd_1920_1080_30fps.mp4",
    label: "Street",
    thumb:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/6448156-hd_1920_1080_25fps.mp4",
    label: "Blue Lake",
    thumb:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=40",
  },
  {
    src: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/journaling-videos/5594635-uhd_3840_2160_30fps.mp4",
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
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%)
    translateY(${(props) => (props.isHidden ? "-100%" : "12px")});
  background: rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  width: 90%;
  max-width: 800px;
  overflow-x: auto;
  opacity: ${(props) => (props.isHidden ? 0 : 1)};
  transition: all 0.3s ease-in-out;
  pointer-events: ${(props) => (props.isHidden ? "none" : "auto")};
  z-index: 20;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 600px) {
    padding: 8px;
    border-radius: 1rem;
    width: 90%;
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
  transition: transform 0.18s;
  flex-shrink: 0;

  &:hover,
  &:focus {
    transform: scale(1.08);
    z-index: 2;
  }
  ${(props) =>
    props.selected &&
    `
      border: 2.5px solid #90caf9;
      transform: scale(1.13);
      z-index: 3;
      &::after {
        content: '✓';
        position: absolute;
        top: -8px;
        right: -8px;
        width: 22px;
        height: 22px;
        background: #90caf9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        animation: scaleIn 0.2s ease-out;
      }
      
      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
    `}
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    margin: 0 3px;
    flex-shrink: 0;
    border-width: 2px;
    ${(props) =>
      props.selected &&
      `
        &::after {
          width: 18px;
          height: 18px;
          font-size: 12px;
          top: -6px;
          right: -6px;
        }
      `}
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
  ${(props) =>
    props.selected &&
    `
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
        pointer-events: none;
      }
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

const BackgroundToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 16px;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }

  ${(props) =>
    props.hasSelectedAmbiance &&
    `
    background: rgba(144, 202, 249, 0.15);
    border-color: rgba(144, 202, 249, 0.4);
    
    &:hover {
      background: rgba(144, 202, 249, 0.2);
      border-color: rgba(144, 202, 249, 0.5);
    }
  `}

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 36px;
    font-size: 0.85rem;

    span {
      display: none;
    }
  }
`;

const IconStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px !important;
    opacity: 0.9;
    color: white;
  }

  @media (max-width: 768px) {
    svg {
      font-size: 18px !important;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -32px -24px 24px -24px;
  padding: 16px 24px;
  width: calc(100% + 48px);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 12px 16px;
    margin: -32px -24px 20px -24px;
  }
`;

const HeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 20px;
    padding-top: 12px;
  }
`;

const FooterIconButton = styled(IconButton)`
  color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    color: #ffffff;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px 6px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 4px 12px 4px 4px;
    gap: 8px;

    img {
      width: 28px;
      height: 28px;
    }
  }
`;

const UserName = styled(Typography)`
  color: #fff;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const StyledButton = styled(Button)`
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 8px 16px;
  height: 40px;
  min-width: 100px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  text-transform: none;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 4px 12px 0 rgba(31, 38, 135, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.25);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }

  span {
    background: linear-gradient(90deg, #fff 30%, rgba(255, 255, 255, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    padding: 0;
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;
    justify-content: center;

    span {
      display: none;
    }

    svg {
      margin: 0;
    }
  }
`;

const AuthButton = styled(Button)`
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 8px 16px;
  height: 40px;
  width: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  text-transform: none;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 4px 12px 0 rgba(31, 38, 135, 0.15);
  margin-top: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.25);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }

  span {
    background: linear-gradient(90deg, #fff 30%, rgba(255, 255, 255, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    height: 36px;
    font-size: 0.85rem;
  }
`;

const TextLink = styled(Button)`
  color: #90caf9;
  text-transform: none;
  font-size: 0.9rem;
  padding: 8px;
  margin-top: 8px;

  &:hover {
    background: rgba(144, 202, 249, 0.1);
  }
`;

const ShareButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
  background: rgba(144, 202, 249, 0.2);
  padding: 12px;

  &:hover {
    color: white;
    background: rgba(144, 202, 249, 0.3);
    transform: scale(1.05);
  }

  svg {
    font-size: 20px;
  }
`;

const ShareableMessageContainer = styled.div`
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 40, 0.95),
    rgba(20, 20, 30, 0.95)
  );
  border-radius: 16px;
  padding: 32px;
  margin: 24px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(144, 202, 249, 0.2);

  @media (max-width: 768px) {
    padding: 24px;
    margin: 16px 0;
  }
`;

const ShareableContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-right: 48px; // Make space for the share button
`;

const MessageLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MessageText = styled(Typography)`
  color: white;
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-left: 32px;
  margin-top: 12px;

  @media (max-width: 768px) {
    margin-left: 24px;
    margin-top: 10px;
  }
`;

const ActionButton = styled(IconButton)`
  color: #ffffff;
  background: rgba(255, 255, 255, 0.13);
  padding: 10px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0px);
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 22px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 8px;
    svg {
      font-size: 20px;
    }
  }
`;

// Update the tooltips style
const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 8px 12px;
    font-size: 0.8rem;
    border-radius: 8px;
    letter-spacing: 0.3px;
  }
`;

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [language, setLanguage] = useState(() => {
    const initialLang = localStorage.getItem("app-language");
    return initialLang && translations[initialLang] ? initialLang : "en";
  });
  const t = translations[language] || translations["en"];
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [nextVideoReady, setNextVideoReady] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSwitcherHidden, setIsSwitcherHidden] = useState(true);

  // Persist language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setThought(e.target.value ?? "");
  };

  const handleReframeSubmit = async () => {
    if (!thought.trim()) return;

    setLoading(true);

    // Add the user's new message to the conversation
    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    try {
      const response = await fetch(`${backendDomain()}/reframe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversations: newConversation,
          user_id: user.uid,
          language,
        }),
      });

      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        { text: data.response, isUser: false },
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

  // When user selects a new video
  const handleVideoSwitch = (idx) => {
    if (idx === currentVideoIdx) return;
    setSelectedVideoIdx(idx);
    setNextVideoReady(false);
    setIsSwitching(true);
  };

  // When the new video is ready, fade in and set as current
  const handleNextVideoReady = () => {
    setNextVideoReady(true);
    setTimeout(() => {
      setCurrentVideoIdx(selectedVideoIdx);
      setIsSwitching(false);
    }, 400); // match fade duration
  };

  // Sign in with Google
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Sign out failed: " + error.message);
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleShareImage = async (originalText, reframedText) => {
    // Create a temporary container for the content to be shared
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    // Create and style the content
    const content = document.createElement("div");
    content.style.width = "600px";
    content.style.padding = "32px";
    content.style.background =
      "linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.95))";
    content.style.borderRadius = "16px";
    content.style.color = "white";
    content.style.fontFamily = "Arial, sans-serif";

    content.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="color: white; font-size: 16px; line-height: 1.5;">${originalText}</div>
      </div>
      <div>
        <div style="color: white; font-size: 16px; line-height: 1.5;">${reframedText}</div>
      </div>
    `;

    tempContainer.appendChild(content);

    try {
      // Generate the image
      const canvas = await html2canvas(content, {
        backgroundColor: null,
        scale: 2,
      });

      // Convert to image and download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "reframed-thought.png";
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  };

  const handleLinkedInShare = async (originalText, reframedText) => {
    try {
      // Generate the image first
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      const content = document.createElement("div");
      content.style.width = "600px";
      content.style.padding = "32px";
      content.style.background =
        "linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.95))";
      content.style.borderRadius = "16px";
      content.style.color = "white";
      content.style.fontFamily = "Arial, sans-serif";

      content.innerHTML = `
        <div style="margin-bottom: 24px;">
          <div style="color: white; font-size: 16px; line-height: 1.5;">${originalText}</div>
        </div>
        <div>
          <div style="color: white; font-size: 16px; line-height: 1.5;">${reframedText}</div>
        </div>
      `;

      tempContainer.appendChild(content);

      const canvas = await html2canvas(content, {
        backgroundColor: null,
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");

      // Clean up
      document.body.removeChild(tempContainer);

      // Open LinkedIn sharing dialog
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}&title=${encodeURIComponent(
        "Reframed Perspective"
      )}&summary=${encodeURIComponent(`${originalText}\n\n${reframedText}`)}`;
      window.open(linkedInUrl, "_blank", "width=600,height=600");
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error);
    }
  };

  if (!user) {
    return (
      <SignInPrompt
        title="Please sign in to continue"
        onGoogleSignIn={handleSignIn}
      >
        <form onSubmit={handleEmailAuth} style={{ width: "100%" }}>
          <TextField
            label={t.email}
            type="email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t.password}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            required
          />
          {authError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {authError}
            </Typography>
          )}
          <AuthButton type="submit" fullWidth>
            <span>{isRegister ? t.register : t.signInWithEmail}</span>
          </AuthButton>
          <TextLink onClick={() => setIsRegister((prev) => !prev)} fullWidth>
            {isRegister ? t.alreadyHaveAccount : t.dontHaveAccount}
          </TextLink>
        </form>
      </SignInPrompt>
    );
  }

  return (
    <>
      {/* Background Videos for crossfade */}
      <BackgroundVideo
        key={backgroundVideos[currentVideoIdx].src}
        src={backgroundVideos[currentVideoIdx].src}
        autoPlay
        loop
        muted
        visible={!isSwitching || !nextVideoReady}
        style={{
          opacity: !isSwitching || !nextVideoReady ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
        }}
      />
      {(isSwitching || selectedVideoIdx !== currentVideoIdx) && (
        <BackgroundVideo
          key={backgroundVideos[selectedVideoIdx].src}
          src={backgroundVideos[selectedVideoIdx].src}
          autoPlay
          loop
          muted
          visible={nextVideoReady}
          onCanPlay={handleNextVideoReady}
          style={{
            opacity: nextVideoReady ? 1 : 0,
            transition: "opacity 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          }}
        />
      )}
      <AppleSwitcherContainer isHidden={isSwitcherHidden}>
        {backgroundVideos.map((video, idx) => (
          <AppleThumbButton
            selected={selectedVideoIdx === idx}
            onClick={() => handleVideoSwitch(idx)}
            aria-label={video.label}
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
          <HeaderContainer>
            <HeaderLeftSection>
              <StyledFormControl variant="outlined" size="small">
                <Select
                  labelId="language-select-label"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label={t.language}
                >
                  {Object.keys(translations)
                    .sort()
                    .map((langCode) => (
                      <MenuItem key={langCode} value={langCode}>
                        {languageNames[langCode]}
                      </MenuItem>
                    ))}
                </Select>
              </StyledFormControl>
              <BackgroundToggleButton
                onClick={() => setIsSwitcherHidden(!isSwitcherHidden)}
                hasSelectedAmbiance={selectedVideoIdx !== 0}
              >
                <IconStyled>
                  <VideoLibraryIcon />
                </IconStyled>
                <span>
                  {isSwitcherHidden ? t.showAmbiance : t.hideAmbiance}
                </span>
              </BackgroundToggleButton>
            </HeaderLeftSection>
            <HeaderRightSection>
              <StyledButton onClick={handleSignOut}>
                <IconStyled>
                  <LogoutIcon />
                </IconStyled>
                <span>{t.signOut}</span>
              </StyledButton>
            </HeaderRightSection>
          </HeaderContainer>
          <ChatContainer ref={chatContainerRef}>
            {conversation.map((msg, index, array) => {
              const isUserMessage = msg.isUser;
              const nextMessage = array[index + 1];
              const showActions =
                isUserMessage && nextMessage && !nextMessage.isUser;

              return (
                <React.Fragment key={index}>
                  <MessageContainer isUser={msg.isUser}>
                    {!msg.isUser && <AiIcon>✧₊⁺</AiIcon>}
                    <MessageBubble isUser={msg.isUser}>
                      {msg.text && <span>{msg.text}</span>}
                    </MessageBubble>
                  </MessageContainer>

                  {showActions && nextMessage && (
                    <ActionButtonsContainer>
                      <StyledTooltip
                        title="Download as Image"
                        arrow
                        placement="top"
                      >
                        <ActionButton
                          onClick={() =>
                            handleShareImage(msg.text, nextMessage.text)
                          }
                        >
                          <DownloadIcon />
                        </ActionButton>
                      </StyledTooltip>
                      <StyledTooltip
                        title="Share on LinkedIn"
                        arrow
                        placement="top"
                      >
                        <ActionButton
                          onClick={() =>
                            handleLinkedInShare(msg.text, nextMessage.text)
                          }
                          linkedIn
                        >
                          <LinkedInIcon />
                        </ActionButton>
                      </StyledTooltip>
                    </ActionButtonsContainer>
                  )}
                </React.Fragment>
              );
            })}

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
              <Button
                variant="outlined"
                onClick={handleReframeSubmit}
                disabled={!thought.trim()}
                sx={{
                  color: "white",
                  borderColor: "white",
                  marginTop: "16px",
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
          </InputContainer>

          <FooterContainer>
            <Tooltip title="Privacy Policy" arrow placement="top">
              <FooterIconButton
                component="a"
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PrivacyTipIcon />
              </FooterIconButton>
            </Tooltip>
            <Tooltip title="Terms of Service" arrow placement="top">
              <FooterIconButton
                component="a"
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GavelIcon />
              </FooterIconButton>
            </Tooltip>
          </FooterContainer>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default ProjectSmart;
