import React from "react";
import styled from "styled-components";
import ResponsiveApBar from "./ResponsiveAppBar";

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
  padding: 5rem 0;
`;

const Blog = () => {
  return (
    <MainContainer>
      <ResponsiveApBar />
      <ContentContainer>
        <PageTitle>Mind's Canvas</PageTitle>
        coming soon...
      </ContentContainer>
    </MainContainer>
  );
};

export default Blog;
