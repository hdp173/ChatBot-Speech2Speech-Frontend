import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTheme } from "@emotion/react";
import { API } from "aws-amplify";

import { Grid, Button } from "@mui/material";
import { ThinkingBubble } from "./ThinkingBubble";

export const SendButton = ({
  audioFile,
  isAudioResponse,
  filterMessageObjects,
  messages,
  setMessages,
  handleBackendResponse,
}) => {
  const theme = useTheme();
  const uploadAudio = async () => {
    if (!audioFile) {
      console.log("No audio file to upload");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result;

        // Add a unique id to the message to be able to update it later
        const messageId = new Date().getTime();

        // Create the message objects
        let messageObjects = filterMessageObjects(messages);

        // Add user's audio message to the messages array
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "user",
            content: "🎤 Audio Message",
            audio: new Audio(base64Audio),
            text: "🎤 Audio Message",
            id: messageId,
          },
        ]);

        // Add thinking bubble
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: (
              <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />
            ),
            text: (
              <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />
            ),
            key: "thinking",
          },
        ]);

        const response = await API.post("api", "/get-answer", {
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            audio: base64Audio,
            messages: messageObjects,
            isAudioResponse,
          },
        });

        // Remove the thinking bubble
        setMessages((prevMessages) => {
          return prevMessages.filter((message) => message.key !== "thinking");
        });
        handleBackendResponse(response);
      };
      reader.readAsDataURL(audioFile);
    } catch (error) {
      console.error("Error uploading audio file:", error);
      alert(error);
    }
  };

  return (
    <Grid item xs="auto">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={uploadAudio}
        disabled={!audioFile}
        startIcon={<CloudUploadIcon />}
      >
        Upload Audio
      </Button>
    </Grid>
  );
};
