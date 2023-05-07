import React, {SetStateAction, useEffect, useState} from 'react';
import {Flex, Heading, Spinner, Text} from "@chakra-ui/react";

interface Props {
  handleCandidateSelect: React.Dispatch<SetStateAction<RTCIceCandidate | undefined>>
}

function AvailableClients({handleCandidateSelect}: Props) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState(new Map<string, RTCIceCandidate>);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      const res = await fetch("/api/clients")
      const json = await res.json();
      if (json) {
        const map = new Map<string, RTCIceCandidate>();
        for (const k of Object.keys(json.results)) {
          map.set(k, json.results[k])
        }
        setClients(map)
      }
      setLoading(false)
    }

    fetchClients().then()
  }, [])
  const clientKeysArr = Array.from(clients.keys());
  return (
    <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"}
          bg={"black"} w={"100%"} h={"100%"} p={"1rem"} gap={"1rem"}>
      <Heading mb={"1rem"} pb={".5rem"} borderBottom={"1px solid white"}>Available Clients</Heading>
      {loading && <Spinner size='xl'/>}
      {clientKeysArr.length <= 0 && <Heading size={"md"}>No clients found.</Heading>}
      <Flex flexDirection={"column"}
            maxHeight={"400px"}
            overflowY={"auto"}
            gap={"1rem"}
            alignItems={"center"} justifyContent={"flex-start"}>
        {clientKeysArr.map(
          clientKey => (
            <Flex key={clientKey} justifyContent={"center"}
                  p={"1rem"}
                  onClick={() => {
                    handleCandidateSelect(clients.get(clientKey))
                  }}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  _hover={{backgroundColor: "gray"}}
                  alignItems={"center"} border={"solid 1px white"}>
              <Text fontWeight={"bold"}>{clientKey}</Text>
            </Flex>
          )
        )}
      </Flex>

    </Flex>
  );
}

export default AvailableClients;