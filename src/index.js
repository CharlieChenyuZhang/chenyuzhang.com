import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Music from "./components/Music";
import Project from "./components/Project";
import ProjectSmart from "./components/ProjectSmart";
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
          path="/project/smart"
          element={elementConstructor(<ProjectSmart />)}
        />
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
