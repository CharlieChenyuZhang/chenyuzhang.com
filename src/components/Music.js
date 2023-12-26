import React, { useState } from "react";
import styled from "styled-components";
import ResponsiveApBar from "./ResponsiveAppBar";

import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Modal,
} from "@mui/material";

const BREAK_POINT = "1200px";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const musicCollection = [
  {
    name: "Exotic Dreams",
    description:
      "In the era of the pandemic, we couldn't travel far but why not let your mind wander to an exotic place where you can try a new dish, learn a foreign language and meet new friends from all over the world? ",
    link: "https://www.youtube.com/embed/DwhYip4cLcc?si=1WCOUb97E7Egpl_F",
  },
  {
    name: "Deep Space",
    description:
      "When traveling in the deep space, what would you hear, what would you think, what would you see, what would you feel? This original music might have the answer for you.",
    link: "https://www.youtube.com/embed/DSpVvy-jmZ0?si=zFXSVkvBH5xZvno1",
  },
  {
    name: "Jasmine Flowers",
    description:
      "This song, Mo Li Hua or Jasmine Flowers, is and will remain one of my favourite Chinese folk songs of all time. ",
    link: "https://www.youtube.com/embed/oqZS5srPAB8?si=4ilrcxhy8L2SisbE",
  },
  {
    name: "High Fashion",
    description: "picture yourself in a high fashion show",
    link: "https://www.youtube.com/embed/X7CDIZWsdVI?si=ifFHYNJBYCMK_4_n",
  },
  {
    name: "SpaceX",
    description: "a music inspired by Space and its rocket launch",
    link: "https://www.youtube.com/embed/zs-nqryR71I?si=NwgpuCXRl9Z8_DB5",
  },
];

const ContentContainer = styled.div`
  margin-top: 83px;
  margin-left: 60px;
  margin-right: 60px;
`;

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 5rem 0;
`;

const MediaCard = styled(Card)`
  width: 313px;
  height: 500px;
`;

const TeamPage = () => {
  return (
    <MainContainer>
      <ResponsiveApBar />
      <ContentContainer>
        <PageTitle>From My Soul to Sound</PageTitle>
        <Grid container spacing={5}>
          {musicCollection.map((music, idx) => (
            <Grid item key={idx}>
              <MediaCard onClick={() => {}}>
                <iframe
                  width="313"
                  height="315"
                  src={music.link}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {music.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {music.description}
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

export default TeamPage;
