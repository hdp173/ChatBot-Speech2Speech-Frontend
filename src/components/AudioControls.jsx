import React, { useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MicIcon from "@mui/icons-material/Mic";
import {
  Button, // Add to imports
  Container,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { SendButton } from "./SendButton";

const AudioControls = ({
  isAudioResponse,
  filterMessageObjects,
  messages,
  setMessages,
  handleBackendResponse,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [player, setPlayer] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const startRecording = async () => {
    const newRecorder = new MicRecorder({ bitRate: 128 });

    try {
      await newRecorder.start();
      setIsRecording(true);
      setRecorder(newRecorder);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;

    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      const audioFile = new File(buffer, "voice-message.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });
      setPlayer(new Audio(URL.createObjectURL(audioFile)));
      setIsRecording(false);
      setAudioFile(audioFile); // Add this line
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  const playRecording = () => {
    if (player) {
      player.play();
    }
  };

  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} md>
            <IconButton
              color="primary"
              aria-label="start recording"
              onClick={startRecording}
              disabled={isRecording}
            >
              <MicIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md>
            <IconButton
              color="secondary"
              aria-label="stop recording"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              <FiberManualRecordIcon />
            </IconButton>
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              disableElevation
              onClick={playRecording}
              disabled={isRecording}
            >
              Play Recording
            </Button>
          </Grid>
          <Grid item xs="auto">
            <SendButton
              audioFile={audioFile}
              isAudioResponse={isAudioResponse}
              filterMessageObjects={filterMessageObjects}
              messages={messages}
              setMessages={setMessages}
              handleBackendResponse={handleBackendResponse}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AudioControls;
