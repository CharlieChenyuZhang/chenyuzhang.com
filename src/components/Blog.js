import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reading from "../images/reading.gif";
import markdownFiles from "../blog2show";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const BREAK_POINT = "1200px";
const maxLength = 100;

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
    // const loadMarkdownFiles = markdownFiles.map((fileName) => {
    //   const path = `/posts/${fileName}`; // Adjust the path based on your `public` folder structure
    //   return fetch(path)
    //     .then((res) => res.text())
    //     .then((content) => ({
    //       slug: fileName.replace(/\.md$/, ""), // Extract slug from file name
    //       content, // Markdown content
    //     }))
    //     .catch((err) => console.error("Error loading markdown file:", err));
    // });
    const loadMarkdownFiles = markdownFiles.map((fileName) => {
      const path = `posts/${fileName}`; // Adjust the path based on your `public` folder structure
      // return fetch(path)
      //   .then((res) => res.text())
      //   .then((content) => ({
      //     slug: fileName.replace(/\.md$/, ""), // Extract slug from file name
      //     content, // Markdown content
      //   }))
      //   .catch((err) => console.error("Error loading markdown file:", err));

      return import(`../md/${fileName}`).then((res) =>
        fetch(res.default)
          .then((response) => response.text())
          .then((content) => ({
            slug: fileName.replace(/\.md$/, ""), // Extract slug from file name
            content, // Markdown content
          }))
          .catch((err) => console.log(err))
      );
    });

    Promise.all(loadMarkdownFiles)
      .then((posts) => setPosts(posts))
      .catch((err) => console.error("Error setting posts:", err));
  }, []);

  const readMoreHandler = (post) => {
    // redirect to the new route /blog/:postId and postId is the slug name
    window.open(`/post/${post.slug}`, "_blank");
  };
  return (
    <MainContainer>
      <ContentContainer>
        {posts.map((post) => (
          <div key={post.slug}>
            <PageTitle>
              <img src={reading} alt="reading" width="100" height="100" />
              {/* Add title here if available */}
            </PageTitle>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.slug.replace(/-/g, " ").toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content.length > maxLength
                      ? `${post.content.substring(0, maxLength)}...`
                      : post.content}
                  </ReactMarkdown>
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => readMoreHandler(post)}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
