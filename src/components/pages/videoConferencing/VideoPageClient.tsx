import React, {useEffect, useRef} from 'react';
import {Inter} from "next/font/google";
import {Box, chakra} from "@chakra-ui/react";
import {io} from "socket.io-client";

const inter = Inter({subsets: ['latin']})

interface Props {
  pc: RTCPeerConnection | undefined,
}

function VideoPageClient({pc}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const socket = useRef(io())

  useEffect(() => {
    socket.current.on("connect", () => {
      console.log("Connected!!", socket.current.id);
    })
  }, [])

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
    </Box>
  );
}

export default VideoPageClient;