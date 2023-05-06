import React, {useEffect, useRef} from 'react';
import {Inter} from "next/font/google";
import {Box, chakra} from "@chakra-ui/react";

const inter = Inter({subsets: ['latin']})

interface Props {
  pc: RTCPeerConnection,
}

function VideoPageClient({pc}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };
  }, [pc])

  return (
    <Box className={inter.className}
         position={"relative"}
         bg={"black"} w={"100px"} h={"200px"}>
      <chakra.video
        transform={"scaleX(-1)" /*For purposes of ensuring the incoming livestream behaves like a mirror (flipped)*/}
        width={"100%"} height={"100%"} objectFit={"contain"} ref={videoRef} autoPlay={true}>
      </chakra.video>
    </Box>
  );
}

export default VideoPageClient;