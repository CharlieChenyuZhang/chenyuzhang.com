import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reading from "../images/reading.gif";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { backendDomain } from "../utils";

const BREAK_POINT = "1200px";

const MainContainer = styled.div`
  margin-top: 10%;
  margin-bottom: 10%;
  height: 100%;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-top: 83px;
  margin-left: 30rem;
  margin-right: 30rem;
`;

const Date = styled.div`
  text-align: center;
  margin-bottom: 0.79625rem;
`;

const Title = styled.div`
  font-size: 4rem;
  max-width: 62.5rem;
  text-align: center;
  margin: 0 auto;
  font-size: 4.5rem;
  line-height: 110%;
  letter-spacing: -0.02em;
  font-weight: 400;
`;

const SubTitle = styled.div`
margin-top: 1.41875rem;
  text-align: center;e
  font-size: 1.125rem;
  line-height: 150%;
  font-weight: 400;
`;

const SinglePost = () => {
  const mdFileName = window.location.href.split("/").pop();

  const [post, setPost] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${backendDomain()}/blog/${mdFileName}`);
        const data = await response.json();
        // Transform the data into an array
        setPost(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
  }, []);

  const CustomImage = (props) => {
    let style = {};

    // Apply different styles based on the image 'alt' text or 'src'
    if (props.alt === "book cover") {
      style = { maxWidth: "250px" };
    }

    return <img {...props} style={style} />;
  };

  return (
    <MainContainer>
      <Date>{post?.data?.date}</Date>
      <Title>{post?.data?.title}</Title>
      <SubTitle>{post?.data?.subtitle}</SubTitle>
      <ContentContainer>
        <div key={mdFileName}>
          <ReactMarkdown
            className="markdown-content"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: CustomImage,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </ContentContainer>
    </MainContainer>
  );
};

export default SinglePost;
