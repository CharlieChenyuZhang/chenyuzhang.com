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
  padding-top: 5rem;
`;

const PageSubTitle = styled.div`
  font-size: 1rem;
  padding-bottom: 5rem;
`;

const Blog = () => {
  // TODO: maridown = [{title: "", content: ""}, {...}]
  // TODO: dynamically grab all the contents from the folder and through useEffect
  // TODO: I hope in the futre, I can simply add a new .md file to /2023 or /2024 folder and commit that .md file
  // it will automatically get organized and published in a reverse chronological order - latest post first
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
        <PageSubTitle>
          Why do I want to start writing blogs?
          <br />
          1. I want to share my thoughts with people even there's only one
          person in this world who find it useful. It would be enough.
          <br />
          2. Life is short. I want to leave something behind.
        </PageSubTitle>
        {/* <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown> */}
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
