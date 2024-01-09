import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reading from "../images/reading.gif";

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
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const importAll = (r) => {
      return r.keys().map((fileName) => {
        // Use the file name directly as provided by require.context
        const path = r(fileName);
        return {
          slug: fileName.substr(2).replace(/\.md$/, ""), // Extract slug from file name
          path, // Path to the actual file content
        };
      });
    };

    // The path here is relative to this script file
    const markdownFiles = require.context("../blogs", true, /\.md$/);
    const blogs = importAll(markdownFiles);

    Promise.all(
      blogs.map((blog) => {
        console.log("blog", blog);
        return fetch(blog.path)
          .then((res) => res.text())
          .then((text) => ({
            ...blog,
            content: text,
          }))
          .catch((err) => console.error("Error loading markdown file:", err));
      })
    )
      .then((posts) => setPosts(posts))
      .catch((err) => console.error("Error setting posts:", err));
  }, []);

  return (
    <MainContainer>
      <ContentContainer>
        {posts.map(
          (post) =>
            !post?.slug?.startsWith("_") && (
              <div key={post.slug}>
                <PageTitle>
                  <img src={reading} alt="reading" width="100" height="100" />
                  {/* Add title here if available */}
                </PageTitle>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            )
        )}
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
