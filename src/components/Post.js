import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reading from "../images/reading.gif";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { DOMAIN } from "../constants";

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

const Post = () => {
  const mdFileName = window.location.href.split("/").pop();

  const [post, setPost] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // FIXME: update this after deployment
        const response = await fetch(`${DOMAIN}/blog/${mdFileName}`);
        const data = await response.json();
        // Transform the data into an array
        setPost(data.content);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
  }, []);

  return (
    <MainContainer>
      <ContentContainer>
        <div key={mdFileName}>
          <PageTitle>
            <img src={reading} alt="reading" width="100" height="100" />
            {/* Add title here if available */}
          </PageTitle>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {post}
          </ReactMarkdown>
        </div>
      </ContentContainer>
    </MainContainer>
  );
};

export default Post;
