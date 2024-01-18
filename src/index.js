import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Music from "./components/Music";
import ResponsiveApBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";
import Post from "./components/Post";

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

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: elementConstructor(<Home />),
//   },
//   {
//     path: "/blog",
//     element: elementConstructor(<Blog />),
//   },
//   {
//     path: "/music",
//     element: elementConstructor(<Music />),
//   },
//   {
//     path: "/post/:postId", // Dynamic route for individual blog posts
//     element: elementConstructor(<Post />),
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={elementConstructor(<Home />)} />
        <Route exact path="/blog" element={elementConstructor(<Blog />)} />
        <Route exact path="/music" element={elementConstructor(<Music />)} />
        <Route
          exact
          path="/post/:postId"
          element={elementConstructor(<Post />)}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
