import React from 'react';
import {Box} from "@chakra-ui/react";
import {Inter} from "next/font/google";
import VideoPageBroadcaster from "@/components/videoConferencing/VideoPageBroadcaster";
import VideoPageClient from "@/components/videoConferencing/VideoPageClient";


const inter = Inter({subsets: ['latin']})

function MainVideoConferencing() {
  return (
    <Box className={inter.className}
         position={"relative"}
         bg={"black"} w={"100vw"} h={"100vh"}>
      <VideoPageBroadcaster/>
      <VideoPageClient/>
    </Box>
  );
}

export default MainVideoConferencing;