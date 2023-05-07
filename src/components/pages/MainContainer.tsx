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
  const [selectedCandidate, setSelectedCandidate] = useState<RTCIceCandidate>()
  const [selectedCandidateString, setSelectedCandidateString] = useState<string>()
  const pc = useRef<RTCPeerConnection>()

  useEffect(() => {
    const _init = async () => {
      if (!pc.current) {
        pc.current = new RTCPeerConnection(config);
      }
      if (!socket.current) {
        socket.current = io();
      }

      if (selectedCandidate) {
        pc.current.addIceCandidate(new RTCIceCandidate(selectedCandidate)).then()
      }

      pc.current.onicecandidate = (event) => {
        console.log("candidate event", event.candidate)
        if (event.candidate) {
          socket.current?.emit('icecandidate', event.candidate);
        }
      };

      socket.current!.on('offer', async (data) => {
        if (socket.current?.id === data.socketId) {
          if (pc.current) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            socket.current?.emit('answer', {socketId: socket.current?.id, answer});
          }
        }
      });

      socket.current!.on('answer', async (data) => {
        if (socket.current?.id === data.socketId) {
          if (pc.current) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        }
      });
    }

    _init().then()

    return () => {
      try {
        socket.current?.disconnect();
        pc?.current?.close();
        socket.current = undefined;
        pc.current = undefined;
      } catch (e) {
        console.log(e)
      }
    }
  }, [selectedCandidate, selectedCandidateString])

  return (
    <Flex className={inter.className}
          position={"relative"}
          textColor={"white"}
          alignItems={"center"}
          bg={"black"} w={"100vw"} h={"100vh"}>
      <SimpleGrid columns={{base: 1, md: 2}} w={"100%"}>
        <GridItem>
          <AvailableClients
            selectedCandidate={selectedCandidateString}
            handleCandidateSelect={(candidate, candidateString) => {
              setSelectedCandidate(candidate)
              setSelectedCandidateString(candidateString)
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