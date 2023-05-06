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
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>(io())
  const currentIceCandidate = useRef<RTCIceCandidate>()
  const [selectedCandidate, setSelectedCandidate] = useState<RTCIceCandidate>()
  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(config))

  useEffect(() => {
    if (selectedCandidate) {
      if (currentIceCandidate.current?.candidate !== selectedCandidate?.candidate) {
        // close previous connection if candidate has been switched.
        try {
          socket.current?.disconnect();
          pc?.current?.close();
        } catch (e) {
          console.log(e)
        }
        pc.current = new RTCPeerConnection(config)
        socket.current = io();

        pc.current.addIceCandidate(new RTCIceCandidate(selectedCandidate)).then()

        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('icecandidate', event.candidate);
          }
        };

        socket.current.on('offer', async (data) => {
          if (socket.current.id === data.socketId) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            socket.current.emit('answer', {socketId: socket.current.id, answer});
          }
        });

        socket.current.on('answer', async (data) => {
          if (socket.current.id === data.socketId) {
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        });
      }
    }
  }, [selectedCandidate])

  return (
    <Flex className={inter.className}
          position={"relative"}
          textColor={"white"}
          alignItems={"center"}
          bg={"black"} w={"100vw"} h={"100vh"}>
      <SimpleGrid columns={{base: 1, md: 2}}>
        <GridItem>
          <AvailableClients handleCandidateSelect={setSelectedCandidate}/>
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