import React, {useEffect, useRef} from 'react';
import {Inter} from "next/font/google";
import {Box, chakra} from "@chakra-ui/react";
import {io} from "socket.io-client";


const inter = Inter({subsets: ['latin']})

const config = {
  iceServers: [
    {
      // Google's default STUN servers. Used to relay info about clients behind NATs.
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

function MainVideoPageBroadcaster() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection>();

  useEffect(() => {
    const socket = io();

    socket.on("offer", async (id, description) => {
      peerConnection.current = new RTCPeerConnection(config);
      await peerConnection.setRemoteDescription(description)
      const sdp = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(sdp)
      socket.emit("answer", id, peerConnection.localDescription);

      if (videoRef.current) {
        peerConnection.ontrack = event => {
          videoRef.current.srcObject = event.streams[0];
        };
      }
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });

    socket.on("candidate", (id, candidate) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });

    socket.on("connect", () => {
      socket.emit("watcher");
    });

    socket.on("broadcaster", () => {
      socket.emit("watcher");
    });

    return () => {
      // close connection if component unmounts.
      socket.close();
      peerConnection?.current?.close()
    }
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