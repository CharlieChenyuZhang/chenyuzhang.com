import React from "react";
import styled from "styled-components";
import project from "../images/project-giphy.gif";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Modal,
} from "@mui/material";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  /* margin-top: 50px;
  margin-left: 60px;
  margin-right: 60px; */

  max-width: 67.2rem;
  margin: 50px auto;
`;

const PageTitle = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Paragraph = styled.div`
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 50rem;
  font-size: 1.125rem;
  line-height: 1.4;
  font-weight: 400;
  font-family: sans-serif;
  text-align: center;
`;

const PrinciplesContainer = styled.div`
  margin-top: 1rem;
`;

const PrincipleTitle = styled.div`
  margin: 0.5rem 0;
`;

const PrincipleDescription = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  margin: 0.5rem 0;
`;

const Project = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>
          <img src={project} alt="projects" width="80" height="80" />
          <Paragraph>Projects coming soon...</Paragraph>
          <Paragraph>
            "Funktionslust" is this awesome German word that means finding joy
            in doing what you’re best at. For me, building projects is all about
            curiosity, tinkering, and not being afraid to fail along the way. My
            approach boils down to four things: keeping it fun and exciting with
            new ideas, diving into tough challenges that push boundaries, making
            a positive impact by building fair, bias-free tools, and creating
            something useful for the community that others can enjoy and build
            on.
          </Paragraph>
        </PageTitle>
        <PrinciplesContainer></PrinciplesContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Project;
