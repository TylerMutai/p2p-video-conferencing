import React from 'react';
import {Box, Icon} from "@chakra-ui/react";
import {IconType} from "react-icons";

interface Props {
  icon: IconType,
  onClick: () => void
}

function ButtonIcon({icon, onClick}: Props) {
  return (
    <Box width={"40px"}
         height={"40px"}
         display={"flex"}
         alignItems={"center"}
         justifyContent={"center"}
         cursor={"pointer"}
         onClick={onClick}
         _hover={{bg: "lightgray"}}
         bg={"white"} borderRadius={"100%"} shadow={"sm"}>
      <Icon as={icon} fontSize={"1.5rem"}/>
    </Box>
  );
}

export default ButtonIcon;