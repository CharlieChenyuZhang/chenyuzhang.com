import React from "react";
import styled from "styled-components";
import { Grid, Card, CardContent, Typography } from "@mui/material";

// Styled Components
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

const MediaCard = styled(Card)`
  width: 313px;
  height: 500px;
`;

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

// Data Collection
const singingCollection = [
  {
    name: "City of Stars | La La Land Cover",
    description:
      "\ud83d\udccd Location: Toronto, Canada\n \ud83d\udcc5 Date: December 10, 2022",
    link: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/singing/city-of-stars.MOV",
    poster:
      "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/singing/IMG_6556.jpg",
  },
  {
    name: "Somewhere Over the Rainbow",
    description:
      "\ud83d\udccd Location: Toronto, Canada\n \ud83d\udcc5 Date: August 11, 2022",
    link: "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/singing/somewhere-over-the-rainbow.mov",
    poster:
      "https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/singing/IMG_6555.jpg",
  },
  {
    name: "Have Yourself a Merry Little Christmas",
    description:
      "\ud83d\udccd Location: Toronto, Canada\n \ud83d\udcc5 Date: January 6, 2022",
    link: "https://www.youtube.com/embed/4Yk2SSxiQSY?si=xM0nb0LPDFU9CxDN",
  },
];

// Singing Component
const Singing = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>
          <Paragraph>
            Back in high school, I fell in love with Bel canto and trained in
            the art of classical singing. Fast forward to 2022, I decided to mix
            things up and explore pop singing with a fantastic teacher from
            Berklee College of Music. Performing on stage is my happy
            place—there’s nothing like the rush of movement and connection. That
            said, hearing my own voice in videos? Awkward! (Anyone else cringe
            at playback?) Still, I hope you enjoy these moments as much as I did
            creating them. 🎵
          </Paragraph>
        </PageTitle>

        <Grid container spacing={5} justifyContent="center">
          {singingCollection.map((video, idx) => (
            <Grid item key={idx}>
              <MediaCard
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  textAlign: "center",
                }}
              >
                {video.link.includes("youtube") ? (
                  <iframe
                    width="313"
                    height="315"
                    src={video.link}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    width="313"
                    height="315"
                    controls
                    src={video.link}
                    style={{ backgroundColor: "black" }}
                    poster={video?.poster}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {video.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {video.description}
                  </Typography>
                </CardContent>
              </MediaCard>
            </Grid>
          ))}
        </Grid>
      </ContentContainer>
    </MainContainer>
  );
};

export default Singing;
