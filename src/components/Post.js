import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reading from "../images/reading.gif";
import { useParams } from "react-router-dom";

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
  let { postId } = useParams();
  const [post, setpost] = useState("");

  useEffect(() => {
    fetch(`/posts/${postId}.md`)
      .then((res) => res.text())
      .then((post) =>
        setpost({
          slug: postId,
          post, // Markdown post
        })
      )
      .catch((err) => console.error("Error loading markdown file:", err));
  }, []);

  return (
    <MainContainer>
      <ContentContainer>
        <div key={post.slug}>
          <PageTitle>
            <img src={reading} alt="reading" width="100" height="100" />
            {/* Add title here if available */}
          </PageTitle>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.post}</ReactMarkdown>
        </div>
      </ContentContainer>
    </MainContainer>
  );
};

export default Post;