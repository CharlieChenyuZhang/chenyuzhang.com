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

const PrivacyPolicy = () => {
  return (
    <LegalContainer>
      <LegalContent>
        <h1>Privacy Policy</h1>
        <p>Last Updated: June 19, 2025</p>

        <h2>Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, store, and
          protect your information when you use our journaling app ("we," "us,"
          or "our").
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect the following types of information, solely to provide and
          improve our services:
        </p>
        <ul>
          <li>
            Account Information: Email address or login credentials used for
            authentication.
          </li>
          <li>
            Journal Entries & Conversations: Content you write or generate using
            our AI features.
          </li>
          <li>
            Preferences & Settings: Language, theme, and personalization
            settings.
          </li>
          <li>
            Device and Usage Information: Technical data and interaction
            patterns.
          </li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>We use your information to:</p>
        <ul>
          <li>
            Authenticate your identity and provide access to your account.
          </li>
          <li>Store and display your journal entries securely.</li>
          <li>Personalize your experience based on your preferences.</li>
          <li>
            Improve our AI and product features through anonymized usage
            analytics.
          </li>
        </ul>

        <h2>3. Data Storage and Security</h2>
        <p>
          All data is encrypted in transit and at rest. We use trusted
          third-party providers to securely store your data.
        </p>

        <h2>Contact Us</h2>
        <p>📧 contact [at] chenyuzhang [dot] com</p>
        <p>© 2025 Chenyu Zhang. All rights reserved.</p>
      </LegalContent>
    </LegalContainer>
  );
};

export default PrivacyPolicy;
