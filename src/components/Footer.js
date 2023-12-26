import React from "react";
import styled from "styled-components";

const BottomImageTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BottomTextContainer = styled.div`
  max-width: 800px;
  margin-top: 20px;
  margin-bottom: 100px;
  text-align: center;
`;

const Footer = () => {
  return (
    <BottomImageTextContainer>
      <BottomTextContainer>
        All rights reserved. © {new Date().getFullYear()} Chenyu Zhang
      </BottomTextContainer>
    </BottomImageTextContainer>
  );
};

export default Footer;
