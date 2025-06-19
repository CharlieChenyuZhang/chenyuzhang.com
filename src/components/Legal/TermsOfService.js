import React from "react";
import styled from "styled-components";

const LegalContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  padding: 40px 20px;
`;

const LegalContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.6;

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #90caf9;
  }

  h2 {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
    color: #90caf9;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const TermsOfService = () => {
  return (
    <LegalContainer>
      <LegalContent>
        <h1>Terms of Service</h1>
        <p>Last Updated: June 19, 2025</p>

        <h2>1. Use of the Service</h2>
        <p>
          You may use the app only if you are 13 years or older and legally
          capable of entering into a contract.
        </p>

        <h2>2. Your Content</h2>
        <ul>
          <li>
            Ownership: You retain full ownership of the journal entries and
            content you create.
          </li>
          <li>
            License: You grant us a limited, non-exclusive license to store and
            process your content.
          </li>
          <li>
            AI Processing: Some features involve processing your text using
            third-party AI APIs.
          </li>
        </ul>

        <h2>3. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>
            Use the Service in accordance with applicable laws and regulations.
          </li>
          <li>
            Refrain from using the Service to post harmful or unlawful content.
          </li>
          <li>Keep your account credentials secure.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, branding, and design elements of the Service are the
          intellectual property of Chenyu Zhang or its licensors.
        </p>

        <h2>Contact</h2>
        <p>📧 contact [at] chenyuzhang [dot] com</p>
        <p>© 2025 Chenyu Zhang. All rights reserved.</p>
      </LegalContent>
    </LegalContainer>
  );
};

export default TermsOfService;
