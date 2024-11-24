import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: #000;
  color: #fff;
  font-family: "Roboto", sans-serif;
`;

const JournalContainer = styled.div`
  flex: 2;
  padding: 20px;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #000;
`;

const JournalHeader = styled.h1`
  margin-bottom: 10px;
  font-size: 24px;
  color: #fff;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  flex-grow: 1;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  font-size: 16px;
  line-height: 40px; /* Matches the line spacing in the background */
  resize: none;
  color: #fff;
  background-color: #000;
  background: repeating-linear-gradient(to bottom, #000, #000 28px, #333 30px);
  outline: none;
  overflow-y: auto;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  padding: 20px;
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
  overflow-y: auto;
  background-color: #111;
  margin-bottom: 20px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 10px 15px;
  border-radius: 12px;
  background-color: ${(props) => (props.isUser ? "#333" : "#222")};
  color: #fff;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
  & .MuiInputBase-root {
    color: #fff;
  }
  & .MuiOutlinedInput-root fieldset {
    border-color: #444;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProjectSmart = () => {
  const [thought, setThought] = useState("");
  const [conversation, setConversation] = useState([]);
  const [journalEntry, setJournalEntry] = useState("");

  const handleJournalChange = (e) => {
    setJournalEntry(e.target.value);
  };

  const handleSubmit = async () => {
    if (!thought.trim()) return;

    const newConversation = [...conversation, { text: thought, isUser: true }];
    setConversation(newConversation);
    setThought("");

    // Simulated AI Response
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          text: "This is an AI-generated response to your thought.",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <MainContainer>
      {/* Journal Section */}
      <JournalContainer>
        <JournalHeader>Your Journal</JournalHeader>
        <StyledTextarea
          value={journalEntry}
          onChange={handleJournalChange}
          placeholder="Write your thoughts here..."
        />
      </JournalContainer>

      {/* Chat Section */}
      <ChatContainer>
        <ChatMessages>
          {conversation.map((msg, idx) => (
            <MessageContainer key={idx} isUser={msg.isUser}>
              <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
            </MessageContainer>
          ))}
        </ChatMessages>
        <InputContainer>
          <StyledTextField
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Ask for insights or inspiration..."
            variant="outlined"
            fullWidth
          />
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!thought.trim()}
              style={{
                backgroundColor: "#444",
                color: "#fff",
              }}
            >
              Submit
            </Button>
          </ButtonGroup>
        </InputContainer>
      </ChatContainer>
    </MainContainer>
  );
};

export default ProjectSmart;
