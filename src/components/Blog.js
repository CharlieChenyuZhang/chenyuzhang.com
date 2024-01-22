import React, { useEffect, useState } from "react";
import styled from "styled-components";
import reading from "../images/reading.gif";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { backendDomain } from "../utils";

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
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${backendDomain()}/blog/all`);
        const data = await response.json();

        // Transform the data into an array
        const postsArray = Object.entries(data).map(([slug, post]) => ({
          slug,
          ...post,
        }));

        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const readMoreHandler = (post) => {
    // redirect to the new route /blog/:postId and postId is the slug name
    navigate(`/post/${post.slug}`);
  };

  return (
    <MainContainer>
      <ContentContainer>
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post.slug}>
                <PageTitle>
                  <img src={reading} alt="reading" width="100" height="100" />
                  {/* Add title here if available */}
                </PageTitle>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {post.data.title}
                    </Typography>
                    <Typography variant="body2">
                      {post.data.subtitle}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => readMoreHandler(post)}>
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))
          : "Coming soon..."}
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
