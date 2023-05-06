import React, {useEffect, useRef, useState} from 'react';
import {Flex, Heading, Spinner, Text} from "@chakra-ui/react";

interface Props {
  handleCandidateSelect: (candidate: RTCSessionDescriptionInit) => void
}

function AvailableClients({handleCandidateSelect}: Props) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      const res = await fetch("/api/clients")
      const json = await res.json();
      if (json) {
        setClients(json.results)
      }
      setLoading(false)
    }

    fetchClients().then()
  }, [])
  return (
    <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"}
          bg={"black"} w={"100%"} h={"100%"} p={"1rem"} gap={"1rem"}>
      <Heading mb={"1rem"} pb={".5rem"} borderBottom={"1px solid white"}>Available Clients</Heading>
      {loading && <Spinner size='xl'/>}
      {clients.length <= 0 && <Heading size={"md"}>No clients found.</Heading>}
      <Flex flexDirection={"column"}
            maxHeight={"400px"}
            overflowY={"auto"}
            gap={"1rem"}
            alignItems={"center"} justifyContent={"flex-start"}>
        {clients.map(
          client => (
            <Flex key={client} justifyContent={"center"}
                  p={"1rem"}
                  onClick={() => {
                  }}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  _hover={{backgroundColor: "gray"}}
                  alignItems={"center"} border={"solid 1px white"}>
              <Text fontWeight={"bold"}>{client}</Text>
            </Flex>
          )
        )}
      </Flex>

    </Flex>
  );
}

export default AvailableClients;