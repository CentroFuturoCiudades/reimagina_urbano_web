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
                    noOfLines={2}
                    textAlign={"center"}
                    letterSpacing={"0.2em"}
                    style={{
                        fontSize: "7vw",
                    }}
                >
                    𝓻𝓮IMAGINA<br />
                    URBANO
                </Heading>
            </Center>
        </Box>
    );
});
