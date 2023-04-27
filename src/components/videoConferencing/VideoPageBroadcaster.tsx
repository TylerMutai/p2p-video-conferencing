import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Inter} from "next/font/google";
import {Box, Button, chakra, Flex, Text} from "@chakra-ui/react";
import ButtonIcon from "@/components/videoConferencing/ButtonIcon";
import {MdOutlineCameraswitch} from "react-icons/md";
import {BsStopFill} from "react-icons/bs";
import FacingModeTypes from "@/types/facingModes";
import {io} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {Socket} from "socket.io";


const inter = Inter({subsets: ['latin']})

const config = {
  iceServers: [
    {
      // Google's default STUN servers. Used to relay info about clients behind NATs.
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};


function VideoPageBroadcaster() {
  const [isStreamStarted, setIsStreamStarted] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")
  const facingMode = useRef<FacingModeTypes>("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket<DefaultEventsMap, ListenEvents>>();
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  useEffect(() => {
    socket.current = io();
  }, [])

  const getWebcamStream = useCallback(async () => {
    // We'll use this to obtain the camera feed.
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode.current
        }
      });
      if (videoStream && videoRef.current) {
        // set this video stream to our video stream object.
        videoRef.current.srcObject = videoStream
        setIsStreamStarted(true);

        // broadcast this stream.
        socket.emit("broadcaster");

        // add listeners to our socket.io object
        socket.on("watcher", async id => {
          const peerConnection = new RTCPeerConnection(config);
          peerConnections.current[id] = peerConnection;

          if (videoRef.current?.srcObject) {
            let stream = videoRef.current.srcObject;
            if ("getTracks" in stream) {
              stream.getTracks().forEach(track => peerConnection.addTrack(track, stream as MediaStream));
              peerConnection.onicecandidate = event => {
                if (event.candidate) {
                  socket.emit("candidate", id, event.candidate);
                }
              };
            }

            try {
              const sdp = await peerConnection.createOffer()
              await peerConnection.setLocalDescription(sdp)
              socket.emit("offer", id, peerConnection.localDescription);
            } catch (e) {

            }
          }
        });

        socket.on("answer", (id, description) => {
          peerConnections.current[id].setRemoteDescription(description);
        });

        socket.on("candidate", (id, candidate) => {
          peerConnections.current[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("disconnectPeer", id => {
          peerConnections.current[id].close();
          delete peerConnections.current[id];
        });
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Could not start video stream. Have you enabled connection?")
      setIsStreamStarted(false);
    }
  }, []);

  const handleStopStream = useCallback(async (shouldIgnoreState = false) => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      if ("getTracks" in stream) {
        const tracks = stream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
        videoRef.current.srcObject = null;
        if (!shouldIgnoreState) {
          setIsStreamStarted(false);
          setErrorMessage("Video stream was stopped by the user.")
        }
      }

    }
  }, [])

  const handleCameraSwitch = useCallback(async () => {
    if (facingMode.current === "user") {
      facingMode.current = "environment";
    } else {
      facingMode.current = "user";
    }
    // Re-fetch the stream.
    await handleStopStream(true);
    await getWebcamStream()
  }, [getWebcamStream, handleStopStream])

  useEffect(() => {
    getWebcamStream().then();

    return () => {
      // close connection if component unmounts.
      socket.close();
    }
  }, [getWebcamStream])

  return (
    <Box className={inter.className}
         position={"relative"}
         bg={"black"} w={"100vw"} h={"100vh"}>
      <chakra.video
        transform={"scaleX(-1)" /*For purposes of ensuring the incoming livestream behaves like a mirror (flipped)*/}
        width={"100%"} height={"100%"} objectFit={"contain"} ref={videoRef} autoPlay={true}>
      </chakra.video>

      <Flex position={"absolute"}
            gap={".5rem"}
            top={"20px"} right={"20px"} direction={"column"} justifyContent={"center"} alignItems={"center"}>
        <ButtonIcon icon={MdOutlineCameraswitch} onClick={handleCameraSwitch}/>
        <ButtonIcon icon={BsStopFill} onClick={() => handleStopStream()}/>
      </Flex>

      {!isStreamStarted &&
        <Flex position={"absolute"} w={"100%"}
              left={"0"}
              top={"0"}
              h={"100%"} alignItems={"center"} flexDirection={"column"}
              gap={".5rem"}
              justifyContent={"center"}>
          <Text bg={"white"} p={"10px"}>
            {errorMessage}
          </Text>
          <Button size={"sm"} variant={"solid"} onClick={getWebcamStream}>
            Start Stream
          </Button>
        </Flex>}
    </Box>
  );
}

export default VideoPageBroadcaster;