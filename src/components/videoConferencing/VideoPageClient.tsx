import React, {useEffect, useRef} from 'react';
import {Inter} from "next/font/google";
import {Box, chakra} from "@chakra-ui/react";
import {io} from "socket.io-client";

const inter = Inter({subsets: ['latin']})

function MainVideoPageBroadcaster() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef(io())

  useEffect(() => {
    socket.current.on("connect", () => {
      console.log("Connected!!", socket.current.id);
    })
  }, [])

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

export default MainVideoPageBroadcaster;