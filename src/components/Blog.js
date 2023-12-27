import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Markdown from "react-markdown";
import myMarkdownFile from "../blogs/2023/using-markdown-to-write-blog-posts.md";
import remarkGfm from "remark-gfm";

const BREAK_POINT = "1200px";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-top: 83px;
  margin-left: 60px;
  margin-right: 60px;
`;

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 5rem 0;
`;

const Blog = () => {
  // TODO: maridown = [{title: "", content: ""}, {...}]
  // TODO: dynamically grab all the contents from the folder and through useEffect
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(myMarkdownFile)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>Mind's Canvas</PageTitle>
        <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
