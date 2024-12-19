import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const ContentContainer = styled.div`
  margin-top: 83px;
  margin-left: 60px;
  margin-right: 60px;
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

const MiniHome = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <Paragraph>
          Hello there, and welcome to my little corner of the internet!
        </Paragraph>

        <Paragraph>
          I'm Chenyu Zhang—a full-stack software engineer with{" "}
          {new Date().getFullYear() - 2015}+ years of programming experience, AI
          researcher, and lifelong learner. My passion lies in bringing bold,
          forward-thinking ideas to life, blending technology with creativity to
          transform how we learn, connect, and grow.
        </Paragraph>

        <Paragraph>
          I'm currently deep into projects at the intersection of AI and
          education, building hands-on tools designed to spark creativity,
          foster real connections, and encourage lifelong learning. It's not
          just about the tech for me; it's about crafting experiences that
          inspire curiosity and bring a sense of fulfillment to people.
        </Paragraph>

        <Paragraph>
          Outside of work, I'm all about living life to the fullest. I'm a level
          10 pianist, a proud cat parent to my buddy Lucky, and a creator at
          heart—I'm currently learning to sketch and can't wait to share my
          drawings of Lucky soon. My curiosity has taken me from producing EDM
          music to learning hip hop dance, horseback riding, cruising on a
          motorcycle, and even skydiving. Life's too short to stick to one lane!
        </Paragraph>

        <Paragraph>
          If you're interested in connecting, collaborating, or chatting about
          bold ideas and real-world projects, feel free to reach out at
          contact[at]chenyuzhang[dot]com. Let's build the future, together—and
          enjoy the journey while we're at it.
        </Paragraph>

        <Paragraph>Warmly,</Paragraph>
        <Paragraph>Chenyu Zhang</Paragraph>
      </ContentContainer>
    </MainContainer>
  );
};

export default MiniHome;
