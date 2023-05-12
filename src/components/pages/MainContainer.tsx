import React, {useEffect, useRef, useState} from 'react';
import {Box, Flex, GridItem, SimpleGrid} from "@chakra-ui/react";
import {Inter} from "next/font/google";
import AvailableClients from "@/components/pages/availableClients/AvailableClients";
import {io, Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import VideoPageBroadcaster from "@/components/pages/videoConferencing/VideoPageBroadcaster";
import VideoPageClient from "@/components/pages/videoConferencing/VideoPageClient";

const config = {
  iceServers: [
    {
      // Google's default STUN servers. Used to relay info about clients behind NATs.
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const inter = Inter({subsets: ['latin']})

function MainContainer() {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>()
  const [selectedCandidateString, setSelectedCandidateString] = useState<string>()
  const selectedCandidateRef = useRef("");
  const pc = useRef<RTCPeerConnection>()
  const [availableClientsKey, setAvailableClientsKey] = useState(0);

  useEffect(() => {
    socket.current = io();
    pc.current = new RTCPeerConnection(config)

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('icecandidate', {socketId: socket.current?.id, candidate: event.candidate});
      }
    };

    socket.current!.on('offer', async (data) => {
      console.log(`We have received an offer from ${data.socketId}. Current id: ${socket.current?.id}`);
      await pc.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.current?.createAnswer();
      await pc.current?.setLocalDescription(answer);

      // we re-send the socketId here so that the client initiating the connection knows
      // which client was selected when connection was initiated.
      socket.current?.emit('answer', {socketId: socket.current?.id, answer});
    });

    // If the answer is from the currently selected socketId, we accept the answer and try to establish
    // the peer-to-peer connection.
    socket.current!.on('answer', async (data) => {
      console.log(`We have received an answer from ${data.socketId}. Current id: ${selectedCandidateRef.current}`);
      if (selectedCandidateRef.current === data.socketId) {
        if (pc.current) {
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          setAvailableClientsKey(oldVal => oldVal + 1)
        }
      }
    });

    socket.current!.on('icecandidate', async (data) => {
      if (selectedCandidateRef.current === socket.current?.id) {
        await pc.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.current?.on("connect", () => {
      console.log(`Socket connection established. id: ${socket.current?.id}`)
      setAvailableClientsKey(oldVal => oldVal + 1)
    })
    return () => {
      try {
        socket.current?.disconnect();
        pc.current?.close();
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  const handleClientSelect = async (candidateString: string) => {
    // initiate offer connection
    if (candidateString) {
      if (pc.current) {
        const offer = await pc.current!.createOffer()
        await pc.current!.setLocalDescription(offer)
        setSelectedCandidateString(candidateString)
        selectedCandidateRef.current = candidateString
        socket.current?.emit("offer", {
          socketId: candidateString,
          offer
        })
      }
    }
  }

  return (
    <Flex className={inter.className}
          position={"relative"}
          textColor={"white"}
          alignItems={"center"}
          bg={"black"} w={"100vw"} h={"100vh"}>
      <SimpleGrid columns={{base: 1, md: 2}} w={"100%"}>
        <GridItem>
          <AvailableClients
            key={availableClientsKey}
            currentSocketId={socket.current?.id || ""}
            selectedCandidate={selectedCandidateString}
            handleCandidateSelect={(candidateString) => {
              handleClientSelect(candidateString).then()
            }}/>
        </GridItem>
        <GridItem>
          <Box position={"relative"}
               textColor={"black"}
               bg={"black"} w={"100%"} h={"100%"}>
            <VideoPageBroadcaster pc={pc.current}/>
            <VideoPageClient pc={pc.current}/>
          </Box>
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
}

export default MainContainer;