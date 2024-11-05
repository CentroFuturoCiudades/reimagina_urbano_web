import React from "react";
import "./Toolbar.scss";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { VIEW_MODES } from "../../constants";
import { FullSelect } from "./FullTools";
import { LensRadius } from "./LensTools";
import { ColoniasSelect } from "./ColoniasTools";
import { ViewModeTool } from "./ViewModeTool";
import { ZoomTool } from "./ZoomTool";
import { TutorialTool } from "./TutorialTool";
import { ReturnTool } from "./ReturnTool";
import { InstructionControls } from "./InstructionControls";

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

            <ViewModeTool />

            {viewMode === VIEW_MODES.POLIGON && <ColoniasSelect />}
            {viewMode === VIEW_MODES.FULL && <FullSelect />}
            {viewMode === VIEW_MODES.LENS && <LensRadius />}
        </div>
    );
};

export default Toolbar;
