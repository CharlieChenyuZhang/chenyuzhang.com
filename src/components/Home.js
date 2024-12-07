import React from "react";
import styled from "styled-components";
import profile from "../images/chenyu-profile.png";

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

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 5rem 0;
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

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 8rem;
  /* justify-content: center; */
  text-align: center;
  align-items: center;
`;

const Image = styled.img`
  border-radius: 50%;
  width: 150px; /* Adjust the size as desired */
  height: 150px;
  object-fit: cover;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  a svg {
    stroke: white; /* Initial stroke color */
    transition: stroke 0.3s ease;

    &:hover {
      stroke: grey; /* Hover stroke color */
    }
  }
`;

const MiniHome = () => {
  return (
    <MainContainer>
      <HeaderContainer>
        <Image src={profile}></Image>
        <SocialIcons>
          <a
            href="https://github.com/CharlieChenyuZhang"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          <a
            href="https://x.com/_chenyu_zhang"
            target="_blank"
            rel="noopener noreferrer"
            title="X.com"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/CharlieChenyuZhang"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </SocialIcons>
      </HeaderContainer>

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
