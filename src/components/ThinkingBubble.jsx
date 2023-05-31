import React from "react";
import { keyframes, styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { Box, TextField, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTheme } from "@emotion/react";

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ThinkingBubbleStyled = styled(MoreHorizIcon)`
  animation: ${pulse} 1.2s ease-in-out infinite;
  margin-bottom: -5px;
`;

export const ThinkingBubble = () => {
  const theme = useTheme();
  return <ThinkingBubbleStyled theme={theme} sx={{ marginBottom: "-5px" }} />;
};
