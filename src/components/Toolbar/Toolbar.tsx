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
import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Input,
    Select,
    Tooltip,
} from "@chakra-ui/react";
import { MdSatellite } from "react-icons/md";
import { FaBuilding, FaSchool } from "react-icons/fa6";
import {
    editScenarioAmenity,
    setCurrentScenarioAmenity,
    setScenarioEdit,
} from "../../features/scenarios/scenariosSlice";

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

            <ScenariosTool />
            {viewMode === VIEW_MODES.POLIGON && <ColoniasSelect />}
            {viewMode === VIEW_MODES.FULL && <FullSelect />}
            {viewMode === VIEW_MODES.LENS && <LensRadius />}
        </div>
    );
};

const ScenariosTool = () => {
    return (
        <>
            <Box position="absolute" top="44vh" left="350px">
                <Tooltip
                    label="Escenarios Zonificacion"
                    aria-label="Escenarios Zonificacion"
                    placement="right"
                >
                    <IconButton
                        aria-label="Satellite"
                        icon={<FaBuilding />}
                        size="md"
                        color="white"
                        colorScheme="orange"
                        borderRadius="full"
                    />
                </Tooltip>
            </Box>
            <Box position="absolute" top="50vh" left="350px">
                <Tooltip
                    label="Escenarios Equipamiento"
                    aria-label="Escenarios Equipamiento"
                    placement="right"
                >
                    <IconButton
                        aria-label="Satellite"
                        icon={<FaSchool />}
                        size="md"
                        color="white"
                        colorScheme="blue"
                        borderRadius="full"
                    />
                </Tooltip>
            </Box>
            <RightSidebar />
        </>
    );
};

const RightSidebar = () => {
    const currentScenarioAmenity = useSelector(
        (state: RootState) => state.scenarios.currentScenarioAmenity
    );
    const scenariosAmenities = useSelector(
        (state: RootState) => state.scenarios.scenariosAmenities
    );
    const dispatch = useDispatch();
    const currentScenarioAmenityObject = scenariosAmenities.features.find(
        (feature: any) => feature.properties.id === currentScenarioAmenity
    );
    console.log(currentScenarioAmenity);
    console.log(scenariosAmenities);
    console.log(currentScenarioAmenityObject);

    const handleEdit = (item: any) => {
        const newScenarioAmenity = {
            ...currentScenarioAmenityObject,
            properties: {
                ...currentScenarioAmenityObject.properties,
                ...item,
            },
        };
        dispatch(editScenarioAmenity(newScenarioAmenity));
    };

    if (!currentScenarioAmenity) return null;
    return (
        <Box
            position="absolute"
            top="0px"
            right="0px"
            zIndex="100"
            bg="white"
            height="100vh"
            width="300px"
            boxShadow="md"
            p="2"
        >
            <ButtonGroup>
                <Button
                    colorScheme="blue"
                    onClick={() => {
                        dispatch(setScenarioEdit(true));
                    }}
                >
                    Edit
                </Button>
                <Button
                    colorScheme="red"
                    onClick={() => {
                        dispatch(setScenarioEdit(false));
                    }}
                >
                    Add
                </Button>
            </ButtonGroup>
            <p>Nombre:</p>
            <Input
                value={currentScenarioAmenityObject.properties.name || ""}
                onChange={(e) => handleEdit({ name: e.target.value })}
            />
            <p>Capacidad:</p>
            <Input
                value={currentScenarioAmenityObject.properties.capacity || ""}
                onChange={(e) => handleEdit({ capacity: e.target.value })}
            />
            <p>Tipo:</p>
            <Select
                value={currentScenarioAmenityObject.properties.type || ""}
                onChange={(e) => handleEdit({ type: e.target.value })}
            >
                <option value="school">Escuela</option>
                <option value="hospital">Hospital</option>
                <option value="park">Parque</option>
            </Select>
        </Box>
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
