import { Box, Flex, Icon, Kbd, Tooltip } from "@chakra-ui/react";
import { PiMouseLeftClickFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { setPitch } from "../../features/viewState/viewStateSlice";
import { RootState } from "../../app/store";

export const InstructionControls = () => {
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    const dispatch = useDispatch();
    const handleRotate = () => {
        dispatch(setPitch(viewState.pitch < 10 ? 70 : 0));
    };
    return (
        <Box className="toolbar-instruction-controls">
            <Tooltip
                hasArrow
                label="Girar 3D"
                bg="gray.700"
                borderRadius="min(0.6dvh, 0.3dvw)"
                fontSize="min(2dvh, 1dvw)"
            >
                <Flex direction="row" justify="center" onClick={handleRotate} style={{ cursor: "pointer" }}>
                    <Kbd>cmd</Kbd>
                    <span> + </span>
                    <Kbd>
                        <Icon size="xs" as={PiMouseLeftClickFill} style={{ verticalAlign: "middle" }} />
                    </Kbd>
                </Flex>
            </Tooltip>
        </Box>
    );
};
