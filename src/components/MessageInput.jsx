import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { Box, TextField, IconButton } from "@mui/material";
export const MessageInput = ({
  isAudioResponse,
  message,
  setMessage,
  handleSendMessage,
}) => {
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
      <TextField
        variant="outlined"
        fullWidth
        label="Type your message"
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <IconButton
        color="primary"
        onClick={() => handleSendMessage(isAudioResponse)}
        disabled={message.trim() === ""}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
