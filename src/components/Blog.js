import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { backendDomain } from "../utils";
import universe from "../images/universe.gif";

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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageSubTitle = styled.div`
  font-size: 1rem;
  padding-bottom: 5rem;
`;

// Custom styled CardContent with black background and white font color
const CustomCardContent = styled(CardContent)`
  background-color: black;
  color: white;

  transition: background-color 0.3s ease;
  &:hover {
    cursor: pointer;
    background-color: grey;
  }
`;

const CustomCardActions = styled(CardActions)`
  background-color: black;
  color: white;
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

        postsArray.sort((a, b) => {
          return b.data.id - a.data.id;
        });

        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const readMoreHandler = (post) => {
    navigate(`/post/${post.slug}`);
  };

  const Paragraph = styled.div`
    margin-bottom: 1rem;

    margin-left: auto;
    margin-right: auto;
    max-width: 50rem;
    font-size: 1.125rem;
    line-height: 150%;
    font-weight: 400;
    font-family: sans-serif;
  `;

  return (
    <MainContainer>
      <ContentContainer>
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post.slug}>
                <PageTitle>
                  <img src={universe} alt="reading" width="100" height="100" />
                  <Paragraph>
                    Here’s a list of music I’ve created. Enjoy!
                  </Paragraph>
                </PageTitle>

                <Card sx={{ minWidth: 275, border: "1px white solid" }}>
                  <CustomCardContent onClick={() => readMoreHandler(post)}>
                    <Typography variant="h5" component="div">
                      {post.data.title}
                    </Typography>
                    <br />
                    <Typography variant="body2">
                      {post.data.subtitle}
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      Date: {post.data.date} | Author: Chenyu Zhang
                    </Typography>
                  </CustomCardContent>
                </Card>
              </div>
            ))
          : "Coming soon..."}
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
