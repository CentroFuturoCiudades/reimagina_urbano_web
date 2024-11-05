import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setZoom } from "../../features/viewState/viewStateSlice";
import { Box, Button, ButtonGroup, Input, Tooltip } from "@chakra-ui/react";

export const ZoomTool = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewState = useSelector((state: RootState) => state.viewState.viewState);

    const zoomIn = () => {
        dispatch(setZoom(viewState.zoom + 1));
    };
    const zoomOut = () => {
        dispatch(setZoom(viewState.zoom - 1));
    };
    return (
        <Box m="2" className="toolbar-zoom">
            <ButtonGroup>
                <Tooltip hasArrow label="Zoom" bg="gray.700" fontSize="14px">
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
                    fontSize="14px"
                    borderRadius="6px"
                    px="2"
                    py="1"
                >
                    <Button size="xs" onClick={zoomOut}>
                        -
                    </Button>
                </Tooltip>
                <Tooltip
                    hasArrow
                    label="Acercarte"
                    bg="gray.700"
                    fontSize="14px"
                    borderRadius="6px"
                    px="2"
                    py="1"
                >
                    <Button size="xs" onClick={zoomIn}>
                        +
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};
