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

const publicSpeakingCollection = [
  {
    name: "Pitch at MIT AI Venture",
    description:
      "This is the pitch where I present the idea of SPARK Journaling, an AI-powered companion designed to promote self-compassion.",
    link: "https://www.youtube.com/embed/8uddXOx3LLU",
  },
  {
    name: "Public Narrative at Harvard Kennedy School",
    description:
      "This is a public narrative presentation I had at Harvard Kennedy School where I talk about the high school bully.",
    link: "https://www.youtube.com/embed/GOc2CVToSbU",
  },
];

const PublicSpeaking = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>
          <Paragraph>
            Public speaking was never my strong suit. As a child, I struggled
            with stuttering, at one point even trying to speak with stones in my
            mouth. When I moved to Canada at 18, I worried people would judge my
            accent. Over time, I realized that what I say matters more than how
            I sound. I’ve also carried the weight of being bullied in high
            school, a story I only recently gained the courage to share. By
            opening up, I hope to encourage others to do the same. Storytelling
            is for everyone, and every voice deserves to be heard.
          </Paragraph>
        </PageTitle>

        <Grid container spacing={5} justifyContent="center">
          {publicSpeakingCollection.map((video, idx) => (
            <Grid item key={idx}>
              <MediaCard
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  textAlign: "center",
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
                  <Typography variant="body2">{video.description}</Typography>
                </CardContent>
              </MediaCard>
            </Grid>
          ))}
        </Grid>
      </ContentContainer>
    </MainContainer>
  );
};

export default PublicSpeaking;
