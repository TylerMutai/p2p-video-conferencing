import React from 'react';
import {Flex, GridItem, SimpleGrid} from "@chakra-ui/react";
import {Inter} from "next/font/google";
import MainVideoConferencing from "@/components/pages/videoConferencing/MainVideoConferencing";
import AvailableClients from "@/components/pages/availableClients/AvailableClients";

const inter = Inter({subsets: ['latin']})

function MainContainer() {
  return (
    <Flex className={inter.className}
          position={"relative"}
          textColor={"white"}
          alignItems={"center"}
          bg={"black"} w={"100vw"} h={"100vh"}>
      <SimpleGrid columns={{base: 1, md: 2}}>
        <GridItem>
          <AvailableClients/>
        </GridItem>
        <GridItem>
          <MainVideoConferencing/>
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
}

export default MainContainer;