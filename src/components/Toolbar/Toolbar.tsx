import React from "react";
import "./Toolbar.scss";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { VIEW_MODES } from "../../constants";
import { FullSelect } from "./FullTools";
import { LensRadius } from "./LensTools";
import { ColoniasSelect } from "./ColoniasTools";
import { ViewModeTool } from "./ViewModeTool";
import { ZoomTool } from "./ZoomTool";
import { TutorialTool } from "./TutorialTool";
import { ReturnTool } from "./ReturnTool";
import { InstructionControls } from "./InstructionControls";
import { setSatellite } from "../../features/viewMode/viewModeSlice";
import { Box, Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { MdSatellite } from "react-icons/md";

interface ToolbarProps {
    handleActivateLanding: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ handleActivateLanding }) => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    return (
        <div className="toolbar">
            <ReturnTool handleActivateLanding={handleActivateLanding} />
            <TutorialTool />
            <ZoomTool />
            <InstructionControls />
            <SatelliteControl />

            <ViewModeTool />

            {viewMode === VIEW_MODES.POLIGON && <ColoniasSelect />}
            {viewMode === VIEW_MODES.FULL && <FullSelect />}
            {viewMode === VIEW_MODES.LENS && <LensRadius />}
        </div>
    );
};

const SatelliteControl = () => {
    const dispatch = useDispatch();
    const isSatellite = useSelector(
        (state: RootState) => state.viewMode.isSatellite
    );

    return (
        <Box position="absolute" top="10px" left="620px">
            <Tooltip label="Vista satelital" aria-label="Satellite">
                <IconButton
                    aria-label="Satellite"
                    icon={<MdSatellite />}
                    onClick={() => dispatch(setSatellite(!isSatellite))}
                    bg={isSatellite ? "gray.700" : "gray.600"}
                    size="xs"
                    color="white"
                    colorScheme="grey"
                />
            </Tooltip>
        </Box>
    );
};

export default Toolbar;
