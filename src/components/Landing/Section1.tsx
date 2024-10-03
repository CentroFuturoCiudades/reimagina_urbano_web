import React, { forwardRef } from "react";
import { Box, Heading, Center } from "@chakra-ui/react";

const Section1 = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Box
          ref={ref}
          h="100vh"
          w="100%"
          bg="teal.300"
          display="flex"
          justifyContent="center"
          alignItems="center"
          scrollSnapAlign="start" // Snap this section to the top
        >
            <Center w="60%" color='white'>
                <Heading as='h1' fontSize={"10vw"} noOfLines={2} textAlign={"center"}>
                    reIMAGINA URBANO
                </Heading>
            </Center>
        </Box>
    );
});

export default Section1;
