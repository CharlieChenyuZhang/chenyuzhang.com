import React from "react";
import styled from "styled-components";
import { Grid, Card, CardContent, Typography } from "@mui/material";

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

const danceCollection = [
  {
    name: "Duet Dance Practice",
    description:
      "\ud83d\udccd Location: Toronto, Canada\n \ud83d\udcc5 Date: December 2021",
    link: "https://www.youtube.com/embed/BQHPiXvFktM?si=p6dqpmQD-6wOC_Tr",
  },
  {
    name: "Live Performance at DanceX Studio",
    description:
      "\ud83d\udccd Location: Toronto, Canada\n \ud83d\udcc5 Date: December 11, 2021",
    link: "https://www.youtube.com/embed/EsUGIoVMJFo?si=u6s2_4ww8S2UOfZB",
  },
];

const Dance = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>
          <Paragraph>
            In 2021, I decided to step out of my comfort zone and see if I could
            dance. Spoiler alert: I started as a complete beginner, but with
            practice and determination, I’ve come a long way! Check out the
            videos below to see my progress—it’s been such a rewarding journey.
            I may not be a professional dancer yet, but I’ve discovered the joy
            of movement and how much fun it can be to keep improving!
          </Paragraph>
        </PageTitle>

        <Grid container spacing={5} justifyContent="center">
          {danceCollection.map((video, idx) => (
            <Grid item key={idx}>
              <MediaCard
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                }}
              >
                <iframe
                  width="313"
                  height="315"
                  src={video.link}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
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

export default Dance;
