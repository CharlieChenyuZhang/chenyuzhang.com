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

const Disclaimer = styled.div`
  font-style: italic;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 50rem;
  font-size: 1rem;
  line-height: 150%;
  font-weight: 400;
  font-family: sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const HireMeLink = styled.a`
  color: #ffd700;
  font-weight: 700;
  font-size: 1.125rem;
  text-decoration: underline;
  margin-left: 0.5em;
  transition: color 0.2s;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #ffc107;
    text-decoration: underline;
  }
`;

const MiniHome = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <Paragraph>
          Hello there, and welcome to my little corner of the internet!
        </Paragraph>

        <Paragraph>
          I'm Chenyu Zhang—a cross-disciplinary educator, AI researcher,
          full-stack software engineer, and certified Designing Your Life coach
          from Stanford d.school. I'm also an ICF-accredited Co-Active Coach,
          trained to support individuals in navigating life's transitions with
          clarity, purpose, and agency.
          <HireMeLink href="mailto:contact@chenyuzhang.com" target="_blank">
            Hire me <span aria-hidden="true">↗</span>
          </HireMeLink>
        </Paragraph>

        <Paragraph>
          With {new Date().getFullYear() - 2015}+ years of programming
          experience and a Master's in Learning Design, Innovation, and
          Technology from Harvard, I blend deep technical expertise with a
          human-centered approach to growth. My passion lies in building tools
          and communities at the intersection of AI and education—projects that
          spark creativity, deepen connection, and encourage lifelong learning.
        </Paragraph>

        <Paragraph>
          As a first-generation immigrant and university graduate, I care deeply
          about access, equity, and empowering others to thrive. I've coached
          and mentored learners and professionals from all walks of life—from
          first-time coders to startup founders—helping them gain confidence,
          clarify direction, and make courageous moves.
        </Paragraph>

        <Paragraph>
          Outside of work, I believe in living life with curiosity and courage.
          I'm a level 10 pianist and a proud cat parent to my buddy Lucky. I've
          explored EDM music production, hip hop dance, horseback riding,
          motorcycle cruising, and even skydiving—because life's too short to
          stay in one lane.
        </Paragraph>

        <Paragraph>
          If you're interested in connecting, collaborating, or chatting about
          bold ideas and real-world projects, feel free to reach out at
          contact[at]chenyuzhang[dot]com. Let's build the future—and enjoy the
          ride while we're at it.
        </Paragraph>

        <Paragraph>Warmly,</Paragraph>
        <Paragraph>Chenyu Zhang</Paragraph>

        <Disclaimer>
          Disclaimer: I am actively working on improving the web accessibility
          of my website in accordance with the Americans with Disabilities Act
          (ADA) and best practices for screen reader compatibility. I
          acknowledge that some pages may currently be missing ARIA labels and
          some images may lack alt text. I am in the process of addressing these
          issues. If you encounter any accessibility concerns, please feel free
          to report them by emailing me at contact [at] chenyuzhang [dot] com.
          Your feedback is greatly appreciated!
        </Disclaimer>
      </ContentContainer>
    </MainContainer>
  );
};

export default MiniHome;
