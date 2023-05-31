import React, { useState } from "react";
import "./App.css";
import { Container, IconButton } from "@mui/material";
import { API } from "aws-amplify";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import AudioControls from "./components/AudioControls";
import ResponseFormatToggle from "./components/ResponseFormatToggle";
import { useTheme } from "@emotion/react";
import { MessageInput } from "./components/MessageInput";
import { ThinkingBubble } from "./components/ThinkingBubble";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const mockMessages = [
  {
    role: "assistant",
    content: "Hello, how can I help you today?",
    text: "Hello, how can I help you today?",
  },
];

function filterMessageObjects(list) {
  return list.map(({ role, content }) => ({ role, content }));
}

function App() {
  const theme = useTheme();
  const [messages, setMessages] = useState(mockMessages);
  const [isAudioResponse, setIsAudioResponse] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      // Send the message to the chat

      // Add the new message to the chat area
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message, text: message, audio: null },
      ]);

      // Clear the input field
      setMessage("");

      // Add thinking bubble
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: (
            <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />
          ),
          text: <ThinkingBubble theme={theme} sx={{ marginBottom: "-5px" }} />,
          key: "thinking",
        },
      ]);

      // Create backend chat input
      let messageObjects = filterMessageObjects(messages);
      messageObjects.push({ role: "user", content: message });

      // Create endpoint for just getting the completion
      try {
        // Send the text message to the backend
        const response = await API.post("api", "/get-answer", {
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            text: message,
            messages: messageObjects,
            isAudioResponse,
          },
        });

        // Remove the thinking bubble
        setMessages((prevMessages) => {
          return prevMessages.filter((message) => message.key !== "thinking");
        });
      } catch (error) {
        console.error("Error sending text message:", error);
        alert(error);
      }
    }
  };

  const handleBackendResponse = (response, id = null) => {
    const generatedText = response.generated_text;
    const generatedAudio = response.generated_audio;
    const transcription = response.transcription;
    const audioElement = generatedAudio
      ? new Audio(`data:audio/mpeg;base64,${generatedAudio}`)
      : null;

    const AudioMessage = () => (
      <span>
        {generatedText}{" "}
        {audioElement && (
          <IconButton
            aria-label="play-message"
            onClick={() => {
              audioElement.play();
            }}
          >
            <VolumeUpIcon style={{ cursor: "pointer" }} fontSize="small" />
          </IconButton>
        )}
      </span>
    );

    if (id) {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) => {
          if (message.id && message.id === id) {
            return {
              ...message,
              content: transcription,
            };
          }
          return message;
        });
        return [
          ...updatedMessages,
          {
            role: "assistant",
            content: generatedText,
            audio: audioElement,
            text: <AudioMessage />,
          },
        ];
      });
    } else {
      // Simply add the response when no messageId is involved
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: generatedText,
          audio: audioElement,
          text: <AudioMessage />,
        },
      ]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      <ChatHeader />
      <ChatMessages messages={messages} />
      <AudioControls
        isAudioResponse={isAudioResponse}
        filterMessageObjects={filterMessageObjects}
        messages={messages}
        setMessages={setMessages}
        handleBackendResponse={handleBackendResponse}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        isAudioResponse={isAudioResponse}
        handleSendMessage={handleSendMessage}
      />
      <ResponseFormatToggle
        isAudioResponse={isAudioResponse}
        setIsAudioResponse={setIsAudioResponse}
      />
    </Container>
  );
}

export default App;
