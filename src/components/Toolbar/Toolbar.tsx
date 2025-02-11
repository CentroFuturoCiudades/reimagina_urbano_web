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
import { Flex, IconButton, Tooltip, useMediaQuery } from "@chakra-ui/react";
import { MdSatellite } from "react-icons/md";

interface ToolbarProps {
    handleActivateLanding: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ handleActivateLanding }) => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const [isMobile] = useMediaQuery("(max-width: 800px)");

    return (
        <div>
            <Flex className="toolbar-left" style={{ left: isMobile ? "0" : "25dvw", height: isMobile ? "50px" : "4dvw" }}>
                <ReturnTool handleActivateLanding={handleActivateLanding} />
                <TutorialTool />
                <ZoomTool />
                <InstructionControls />
                <SatelliteControl />
            </Flex>

            <Flex className="toolbar-center">
                <ViewModeTool />

                {viewMode === VIEW_MODES.FULL && <FullSelect />}
                {viewMode === VIEW_MODES.POLIGON && <ColoniasSelect />}
                {viewMode === VIEW_MODES.LENS && <LensRadius />}
            </Flex>
        </div>
    );
};

const SatelliteControl = () => {
    const dispatch = useDispatch();
    const isSatellite = useSelector(
        (state: RootState) => state.viewMode.isSatellite
    );

    return (
        <Tooltip
            hasArrow
            label="Vista satelital"
            aria-label="Satellite"
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            <IconButton
                className="button-small"
                aria-label="Satellite"
                icon={<MdSatellite fontSize="1dvw" />}
                onClick={() => dispatch(setSatellite(!isSatellite))}
                bg={isSatellite ? "gray.700" : "gray.600"}
                size="xs"
                color="white"
                colorScheme="grey"
            />
        </Tooltip>
    );
};

export default Toolbar;
