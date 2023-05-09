import React, {useEffect, useRef} from 'react';
import {Inter} from "next/font/google";
import {Box, chakra, Text} from "@chakra-ui/react";

const inter = Inter({subsets: ['latin']})

interface Props {
  pc: RTCPeerConnection | undefined,
}

function VideoPageClient({pc}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (pc) {
      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };
    }
  }, [pc])

  return (
    <Box className={inter.className}
         position={"absolute"}
         right={"5px"}
         bottom={"5px"}
         borderRadius={"10px"}
         overflow={"hidden"}
         bg={"white"} w={"100px"} h={"150px"}>
      <chakra.video
        transform={"scaleX(-1)" /*For purposes of ensuring the incoming livestream behaves like a mirror (flipped)*/}
        width={"100%"} height={"100%"} objectFit={"contain"} ref={videoRef} autoPlay={true}>
      </chakra.video>
      {!videoRef?.current?.srcObject
        && <Text
          top={"5px"}
          left={"5px"}
          position={"absolute"}>Client video will appear here</Text>}
    </Box>
  );
}

export default VideoPageClient;