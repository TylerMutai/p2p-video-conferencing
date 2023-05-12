import React, {useEffect, useRef, useState} from 'react';
import {Flex, Heading, Spinner, Text} from "@chakra-ui/react";

interface Props {
  handleCandidateSelect: (candidateString: string) => void,
  selectedCandidate?: string,
  currentSocketId: string
}

function AvailableClients({handleCandidateSelect, selectedCandidate, currentSocketId}: Props) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState(new Set<string>);
  const interval = useRef<NodeJS.Timer>()

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      const res = await fetch("/api/clients")
      const json = await res.json();
      if (json) {
        const map = new Set<string>();
        for (const v of JSON.parse(json.results).value) {
          if (v !== currentSocketId)
            map.add(v)
        }
        setClients(map)
      }
      setLoading(false)
    }
    interval.current = setInterval(() => {
      fetchClients().then();
    }, 5000)
    fetchClients().then();
    return () => {
      clearInterval(interval.current)
    }
  }, [currentSocketId])

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
                    handleCandidateSelect(clientKey)
                  }}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  bg={selectedCandidate === clientKey ? "blue" : undefined}
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