import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Music from "./components/Music";
import Project from "./components/Project";
import ProjectSmartV1 from "./components/ProjectSmart/ProjectSmartV1";
import ProjectSmartV2 from "./components/ProjectSmart/ProjectSmartV2";
import ProjectSmartV3 from "./components/ProjectSmart/ProjectSmartV3";
import ProjectSmartV4 from "./components/ProjectSmart/ProjectSmartV4";
import ProjectRelief from "./components/ProjectRelief/ProjectRelief";
import ProjectReliefWebcamTest from "./components/ProjectRelief/WebcamTest";
import ProjectReliefLearningVideo from "./components/ProjectRelief/LearningVideo";
import ProjectReliefLearningTasks from "./components/ProjectRelief/LearningTasks";
import ProjectReliefDebrief from "./components/ProjectRelief/Debrief";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";
import SinglePost from "./components/SinglePost";
import Icebreaking from "./components/ProjectSocialIntelligence/Icebreaking";
import InteractionDimensions3D from "./components/ProjectSocialIntelligence/InteractionDimensions3D";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppContainer from "./components/AppContainer"; // Import the AppContainer

const elementConstructor = (Component, showStars = false) => {
  return !showStars ? (
    <>
      <ResponsiveAppBar />
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
          path="/blog"
          element={elementConstructor(<Blog />, true)}
        />
        <Route
          exact
          path="/music"
          element={elementConstructor(<Music />, true)}
        />
        <Route
          exact
          path="/project"
          element={elementConstructor(<Project />, true)}
        />
        <Route
          exact
          path="/blog/:blogId"
          element={elementConstructor(<SinglePost />)}
        />

        {/* BELOW IS THE PROJECT PAGES */}
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
          path="/project/social-intelligence/dimensions-of-interactions"
          element={elementConstructor(<InteractionDimensions3D />)}
        />

        <Route
          exact
          path="/project/social-intelligence/icebreaking"
          element={elementConstructor(<Icebreaking />)}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
