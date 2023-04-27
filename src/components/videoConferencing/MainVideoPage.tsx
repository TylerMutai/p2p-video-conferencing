import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Inter} from "next/font/google";
import {Box, Button, chakra, Flex, Text} from "@chakra-ui/react";
import ButtonIcon from "@/components/videoConferencing/ButtonIcon";
import {MdOutlineCameraswitch} from "react-icons/md";
import {BsStopFill} from "react-icons/bs";
import FacingModeTypes from "@/types/facingModes";


const inter = Inter({subsets: ['latin']})

function MainVideoPage() {
  const [isStreamStarted, setIsStreamStarted] = useState(true);
  const facingMode = useRef<FacingModeTypes>("user");
  const videoRef = useRef<HTMLVideoElement>(null);

  const getWebcamStream = useCallback(async () => {
    // We'll use this to obtain the camera feed.
    // TODO: Add ability to switch between front and back cameras if supported.
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode.current
      }
    });
    if (videoStream && videoRef.current) {
      // set this video stream to our video stream object.
      console.log(videoStream)
      videoRef.current.srcObject = videoStream
      setIsStreamStarted(true);
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
            Video stream has been stopped.
          </Text>
          <Button size={"sm"} variant={"solid"} onClick={getWebcamStream}>
            Start Stream
          </Button>
        </Flex>}
    </Box>
  );
}

export default MainVideoPage;