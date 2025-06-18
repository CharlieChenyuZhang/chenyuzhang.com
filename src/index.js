import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import ProjectLandingPage from "./components/ProjectLandingPage";
import BlogLandingPage from "./components/BlogLandingPage";
import Music from "./components/Music";
import PublicSpeaking from "./components/PublicSpeaking";
import Dance from "./components/Dance";
import Singing from "./components/Singing";
import ProjectBetterTogether from "./components/ProjectSmart/ProjectSmartV4-better-together";
import ProjectHow2Learn from "./components/ProjectSmart/ProjectSmartV4-how2learn";
import ProjectSmartV1 from "./components/ProjectSmart/ProjectSmartV1";
import ProjectSmartV2 from "./components/ProjectSmart/ProjectSmartV2";
import ProjectSmartV3 from "./components/ProjectSmart/ProjectSmartV3";
import ProjectSmartV4 from "./components/ProjectSmart/ProjectSmartV4";
import ProjectSmartV5 from "./components/ProjectSmart/ProjectSmartV5";
import ProjectSmartV6 from "./components/ProjectSmart/ProjectSmartV6";
import ProjectRelief from "./components/ProjectRelief/ProjectRelief";
import ProjectReliefWebcamTest from "./components/ProjectRelief/WebcamTest";
import ProjectReliefLearningVideo from "./components/ProjectRelief/LearningVideo";
import ProjectReliefLearningTasks from "./components/ProjectRelief/LearningTasks";
import ProjectReliefDebrief from "./components/ProjectRelief/Debrief";
import ResponsiveAppBar from "./components/ResponsiveProfileBar";
import Footer from "./components/Footer";
import SinglePost from "./components/SinglePost";
import Icebreaking from "./components/ProjectSocialIntelligence/Icebreaking";
import EvalV1 from "./components/ProjectPersonalLlmEval/EvalV1";
import EvalV2 from "./components/ProjectPersonalLlmEval/EvalV2";
import Test from "./components/Test";
import InteractionDimensions3DV1 from "./components/ProjectSocialIntelligence/InteractionDimensions3DV1";
import InteractionDimensions3DV2 from "./components/ProjectSocialIntelligence/InteractionDimensions3DV2";
import InteractionDimensions3DV3 from "./components/ProjectSocialIntelligence/InteractionDimensions3DV3";
import Demo from "./components/Demo";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppContainer from "./components/AppContainer"; // Import the AppContainer

// NOTE: assumption, no stars, no profile pictures and navigations
const elementConstructor = (Component, showStars = false) => {
  return !showStars ? (
    <>
      {Component}
      <Footer />
    </>
  ) : (
    <AppContainer>
      <ResponsiveAppBar />
      {Component}
      <Footer />
    </AppContainer>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={elementConstructor(<Home />, true)} />
        <Route
          exact
          path="/project"
          element={elementConstructor(<ProjectLandingPage />, true)}
        />
        <Route
          exact
          path="/blog"
          element={elementConstructor(<BlogLandingPage />, true)}
        />
        <Route
          exact
          path="/music"
          element={elementConstructor(<Music />, true)}
        />
        <Route
          exact
          path="/speaking"
          element={elementConstructor(<PublicSpeaking />, true)}
        />
        <Route
          exact
          path="/dance"
          element={elementConstructor(<Dance />, true)}
        />
        <Route
          exact
          path="/singing"
          element={elementConstructor(<Singing />, true)}
        />
        <Route
          exact
          path="/project/:projectId"
          element={elementConstructor(<SinglePost isProject={true} />)}
        />

        <Route
          exact
          path="/blog/:blogId"
          element={elementConstructor(<SinglePost isProject={false} />)}
        />

        {/* %%%%%%%%%%%%%%% BELOW IS THE PROJECT PAGES %%%%%%%%%%%%%%% */}
        <Route
          exact
          path="/project/how-to-learn-anything"
          element={elementConstructor(<ProjectHow2Learn />)}
        />
        <Route
          exact
          path="/project/self-compassion"
          element={elementConstructor(<ProjectBetterTogether />)}
        />
        <Route
          exact
          path="/project/smart/v1"
          element={elementConstructor(<ProjectSmartV1 />)}
        />
        <Route
          exact
          path="/project/smart/v2"
          element={elementConstructor(<ProjectSmartV2 />)}
        />
        <Route
          exact
          path="/project/smart/v3"
          element={elementConstructor(<ProjectSmartV3 />)}
        />
        <Route
          exact
          path="/project/smart/v4"
          element={elementConstructor(<ProjectSmartV4 />)}
        />
        <Route
          exact
          path="/project/smart/v5"
          element={elementConstructor(<ProjectSmartV5 />)}
        />
        <Route
          exact
          path="/project/smart/v6"
          element={elementConstructor(<ProjectSmartV6 />)}
        />

        {/* Project Relief Routes */}
        <Route exact path="/project/relief" element={<ProjectRelief />} />
        <Route
          exact
          path="/project/relief/webcam-test"
          element={<ProjectReliefWebcamTest />}
        />
        <Route
          exact
          path="/project/relief/learning-video"
          element={<ProjectReliefLearningVideo />}
        />
        <Route
          exact
          path="/project/relief/learning-tasks"
          element={<ProjectReliefLearningTasks />}
        />
        <Route
          exact
          path="/project/relief/debrief"
          element={<ProjectReliefDebrief />}
        />

        {/* Project social intellignece */}
        <Route
          exact
          path="/project/social-intelligence/dimensions-of-interactions/v1"
          element={elementConstructor(<InteractionDimensions3DV1 />)}
        />
        <Route
          exact
          path="/project/social-intelligence/dimensions-of-interactions/v2"
          element={elementConstructor(<InteractionDimensions3DV2 />)}
        />
        <Route
          exact
          path="/project/social-intelligence/dimensions-of-interactions/v3"
          element={elementConstructor(<InteractionDimensions3DV3 />)}
        />

        <Route
          exact
          path="/project/social-intelligence/icebreaking"
          element={elementConstructor(<Icebreaking />)}
        />

        {/* MIT Personal Robots Group PoC */}
        <Route
          exact
          path="/project/prg/persona-llm-eval/v1"
          element={elementConstructor(<EvalV1 />)}
        />
        <Route
          exact
          path="/project/prg/persona-llm-eval/v2"
          element={elementConstructor(<EvalV2 />)}
        />

        {/* TEST ROUTES */}
        <Route
          exact
          path="/project/recording-testing"
          element={elementConstructor(<Test />)}
        />

        <Route
          exact
          path="/demo"
          element={elementConstructor(<Demo />, true)}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
