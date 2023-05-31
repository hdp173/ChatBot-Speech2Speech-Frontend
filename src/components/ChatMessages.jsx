import React, { useState, useRef, useEffect } from "react";
import {
  Box, // Add to imports
  Container,
  Grid,
  IconButton, // Add to imports
  List, // Add to imports
  ListItem, // Add to imports
  ListItemText, // Add to imports
  Paper, // Add to imports
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const UserMessage = styled("div", {
  shouldForwardProp: (prop) => prop !== "audio",
})`
  position: relative;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(1, 2)};
  padding-right: ${({ theme, audio }) =>
    audio ? theme.spacing(6) : theme.spacing(2)};
  border-radius: 1rem;
  border-top-right-radius: 0;
  align-self: flex-end;
  max-width: 80%;
  word-wrap: break-word;
`;

const AgentMessage = styled("div")`
  position: relative;
  background-color: ${({ theme }) => theme.palette.grey[300]};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border-radius: 1rem;
  border-top-left-radius: 0;
  align-self: flex-end;
  max-width: 80%;
  word-wrap: break-word;
`;

const MessageWrapper = styled("div")`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  justify-content: ${({ align }) =>
    align === "user" ? "flex-end" : "flex-start"};
`;

const ChatMessages = ({ messages }) => {
  const theme = useTheme();
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      if (typeof bottomRef.current.scrollIntoViewIfNeeded === "function") {
        bottomRef.current.scrollIntoViewIfNeeded({ behavior: "smooth" });
      } else {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          mt: 4,
          minHeight: "650px",
          maxHeight: "650px",
          overflow: "auto",
        }}
      >
        <Paper elevation={0} sx={{ padding: 2 }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                <ListItemText
                  sx={{ margin: 0 }}
                  primary={
                    <MessageWrapper align={message.role}>
                      {message.role === "user" ? (
                        <>
                          <UserMessage theme={theme} audio={message.audio}>
                            {message.text}
                            {message.audio && (
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  right: 8,
                                  transform: "translateY(-50%)",
                                }}
                                onClick={() => message.audio.play()}
                              >
                                <VolumeUpIcon fontSize="small" />
                              </IconButton>
                            )}
                          </UserMessage>
                        </>
                      ) : (
                        <AgentMessage theme={theme}>
                          {message.text}
                        </AgentMessage>
                      )}
                    </MessageWrapper>
                  }
                />
              </ListItem>
            ))}
            <div ref={bottomRef} />
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChatMessages;
