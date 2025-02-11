import { Box, Flex, Icon, Kbd, Tooltip } from "@chakra-ui/react";
import { PiMouseLeftClickFill } from "react-icons/pi";

export const InstructionControls = () => (
    <Box className="toolbar-instruction-controls">
        <Tooltip
            hasArrow
            label="Girar 3D"
            bg="gray.700"
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            <Flex direction="row" justify="center">
                <Kbd>cmd</Kbd>
                <span> + </span>
                <Kbd>
                    <Icon
                        size="xs"
                        as={PiMouseLeftClickFill}
                        style={{ verticalAlign: "middle" }}
                    />
                </Kbd>
            </Flex>
        </Tooltip>
    </Box>
);
