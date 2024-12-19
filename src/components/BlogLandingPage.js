import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { backendDomain } from "../utils";
import universe from "../images/project-giphy.gif";
import Chip from "@mui/material/Chip";

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
  padding-bottom: 1rem;
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

const BlogLandingPage = () => {
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
        // sort by ID
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

  const readMoreHandler = (blog) => {
    navigate(`/blog/${blog.slug}`);
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
        <PageTitle>
          <Paragraph>
            Welcome to the place where I share my thoughts and lessons on
            technology, stories, takeaways, and life. If even one person finds
            inspiration or learns something from my writing, it would mean the
            world to me. Let’s learn, grow, and connect—one post at a time!
          </Paragraph>
        </PageTitle>
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post.slug}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Column on small screens, row on larger
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    minWidth: 275,
                    maxWidth: 800,
                    margin: "2rem auto",
                    border: "1px white solid",
                    height: { sm: "300px", xs: "auto" }, // Fixed height on larger screens, auto on mobile
                  }}
                >
                  {/* Left Content */}
                  <CustomCardContent
                    onClick={() => readMoreHandler(post)}
                    sx={{
                      flex: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                      padding: { xs: "1rem", sm: "1.5rem" }, // Smaller padding on mobile
                    }}
                  >
                    {post?.data?.chips && post?.data?.chips?.length > 0 && (
                      <div>
                        {post.data.chips.map((chip, index) => (
                          <Chip
                            key={index}
                            label={chip}
                            sx={{
                              marginBottom: "0.5rem",
                              marginRight: "0.5rem",
                              border: "1px solid white",
                              color: "white",
                            }}
                            variant="outlined"
                          />
                        ))}
                      </div>
                    )}
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                    >
                      {post.data.title}
                    </Typography>
                    <br />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {post.data.subtitle}
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      Date: {post.data.date} | Author: Chenyu Zhang
                    </Typography>
                  </CustomCardContent>

                  {/* Right Image */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={post.data.thumbnail || universe}
                      alt="thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderTop: { xs: "1px solid white", sm: "none" }, // Add a border on mobile
                        borderLeft: { xs: "none", sm: "1px solid white" },
                      }}
                    />
                  </div>
                </Card>
              </div>
            ))
          : "Coming soon..."}
      </ContentContainer>
    </MainContainer>
  );
};

export default BlogLandingPage;
