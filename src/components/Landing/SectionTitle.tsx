import { Box, Center, Heading } from "@chakra-ui/react";
import { forwardRef } from "react";

export const SectionTitle = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Box
            ref={ref}
            h="100vh"
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className="landing__header"
        >
            <Center w="100%" color="white">
                <Heading
                    as="h1"
                    fontSize={"8vw"}
                    noOfLines={2}
                    textAlign={"center"}
                >
                    ( r e ) I M A G I N A<br></br>U R B A N O
                </Heading>
            </Center>
        </Box>
    );
});
