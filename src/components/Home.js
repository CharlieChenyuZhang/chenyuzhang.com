import React from "react";
import styled from "styled-components";
import greeting from "../images/greeting.gif";
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

const Paragraph = styled.div`
  margin-bottom: 1rem;
`;

const Home = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle>
          <img src={greeting} alt="greeting" width="100" height="100" />
        </PageTitle>
        <Paragraph>Hello there,</Paragraph>
        <Paragraph>
          Welcome to my blog! My name is (Charlie) Chenyu Zhang, a full stack
          software engineer with {new Date().getFullYear() - 2015}+ years of
          programming experience and a strong passion in AI and web3.
        </Paragraph>
        <Paragraph>
          I founded my first startup in 2016 in the space of AI. Many things
          have changed in the tech industry since then. The only thing that
          didn't change is my passion of sharing my knowledge with the tech
          community. I hope you enjoy all you read as much as I enjoyed writing
          it. If you have any questions or have a career opportunity that you'd
          like to talk to me about, please feel free to drop me a line.
        </Paragraph>
        <Paragraph>
          If you don't get an answer immediately, I might just be writing new
          blogs. I will get back to you as soon as I can. That's a promise!
          Please reach me at
        </Paragraph>
        <Paragraph>contact[at]chenyuzhang[dot]com</Paragraph>
        <Paragraph>Best,</Paragraph>
        <Paragraph>Chenyu Zhang</Paragraph>
      </ContentContainer>
    </MainContainer>
  );
};

export default Home;
