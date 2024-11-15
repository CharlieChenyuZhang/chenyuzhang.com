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
import ProjectSmartV5 from "./components/ProjectSmart/ProjectSmartV5";
import ProjectRelief from "./components/ProjectRelief/ProjectRelief";
import ProjectReliefWebcamTest from "./components/ProjectRelief/WebcamTest";
import ProjectReliefLearningVideo from "./components/ProjectRelief/LearningVideo";
import ProjectReliefLearningTasks from "./components/ProjectRelief/LearningTasks";
import ProjectReliefDebrief from "./components/ProjectRelief/Debrief";
import ResponsiveApBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";
import SinglePost from "./components/SinglePost";
import Icebreaking from "./components/ProjectIcebreaking";

import { BrowserRouter, Route, Routes } from "react-router-dom";

const elementConstructor = (Component) => {
  return (
    <>
      <ResponsiveApBar />
      {Component}
      <Footer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={elementConstructor(<Home />)} />
        <Route exact path="/blog" element={elementConstructor(<Blog />)} />
        <Route exact path="/music" element={elementConstructor(<Music />)} />
        <Route
          exact
          path="/project"
          element={elementConstructor(<Project />)}
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

        {/* AI Tutor API */}
        <Route
          exact
          path="/project/smart/v4"
          element={elementConstructor(<ProjectSmartV4 />)}
        />

        {/* chat style */}
        <Route
          exact
          path="/project/smart/v5"
          element={elementConstructor(<ProjectSmartV5 />)}
        />

        {/* BEGINNING of project relief */}
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
        {/* END of project relief */}

        <Route
          exact
          path="/project/icebreaking"
          element={elementConstructor(<Icebreaking />)}
        />
        <Route
          exact
          path="/blog/:blogId"
          element={elementConstructor(<SinglePost />)}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
