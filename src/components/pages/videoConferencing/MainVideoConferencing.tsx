import React from 'react';
import {Box} from "@chakra-ui/react";
import VideoPageBroadcaster from "@/components/pages/videoConferencing/VideoPageBroadcaster";
import VideoPageClient from "@/components/pages/videoConferencing/VideoPageClient";


function MainVideoConferencing() {
  return (
    <Box position={"relative"}
         bg={"black"} w={"100%"} h={"100%"}>
      <VideoPageBroadcaster/>
      <VideoPageClient/>
    </Box>
  );
}

export default MainVideoConferencing;