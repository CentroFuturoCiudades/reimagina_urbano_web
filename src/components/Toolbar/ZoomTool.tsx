import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setZoom } from "../../features/viewState/viewStateSlice";
import { Box, ButtonGroup, IconButton, Input, Tooltip } from "@chakra-ui/react";
import { MdOutlineAdd, MdOutlineRemove } from "react-icons/md";

export const ZoomTool = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewState = useSelector(
        (state: RootState) => state.viewState.viewState
    );

    const zoomIn = () => {
        dispatch(setZoom(viewState.zoom + 1));
    };
    const zoomOut = () => {
        dispatch(setZoom(viewState.zoom - 1));
    };
    return (
        <Box className="toolbar-zoom">
            <ButtonGroup
                style={{ height: "100%", padding: "0.2dvw" }}
            >
                <Tooltip
                    hasArrow
                    label="Zoom"
                    bg="gray.700"
                    borderRadius="min(0.6dvh, 0.3dvw)"
                    fontSize="min(2dvh, 1dvw)"
                >
                    <Input
                        isReadOnly
                        size="xs"
                        type="number"
                        value={Math.round(viewState.zoom)}
                    />
                </Tooltip>
                <Tooltip
                    hasArrow
                    label="Alejarte"
                    bg="gray.700"
                    px="2"
                    py="1"
                    borderRadius="min(0.6dvh, 0.3dvw)"
                    fontSize="min(2dvh, 1dvw)"
                >
                    <button
                        aria-label="Alejarte"
                        onClick={zoomOut}
                    >
                        <MdOutlineRemove />
                    </button>
                </Tooltip>
                <Tooltip
                    hasArrow
                    label="Acercarte"
                    bg="gray.700"
                    px="2"
                    py="1"
                    borderRadius="min(0.6dvh, 0.3dvw)"
                    fontSize="min(2dvh, 1dvw)"
                >
                    <button
                        aria-label="Acercarte"
                        onClick={zoomIn}
                    >
                        <MdOutlineAdd />
                    </button>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};
