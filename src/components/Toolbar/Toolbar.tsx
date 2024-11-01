import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
    clearSelectedColonias,
    setLensRadius,
    setPoligonMode,
    setProject,
    setViewMode,
    toggleSelectedColonias,
} from "../../features/viewMode/viewModeSlice";
import { setViewState } from "../../features/viewState/viewStateSlice";
import { POLYGON_MODES, REGIONS, VIEW_MODES } from "../../constants";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    Flex,
    Icon,
    IconButton,
    Input,
    Kbd,
    List,
    ListItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    StackDivider,
    Text,
    Tooltip,
    useBoolean,
} from "@chakra-ui/react";
import {
    MdAdd,
    MdArrowBack,
    MdArrowDropDown,
    MdClose,
    MdDelete,
    MdEdit,
} from "react-icons/md";
import { PiMouseLeftClickFill } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface ToolbarProps {
    handleActivateLanding: () => void; // Define the prop type
}

const Toolbar: React.FC<ToolbarProps> = ({ handleActivateLanding }) => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const viewState = useSelector((state: RootState) => state.viewState);
    const project = useSelector((state: RootState) => state.viewMode.project);

    const zoomIn = () => {
        // dispatch(setViewState(zoomLevel.zoom + 1))
        dispatch(
            setViewState({
                zoom: viewState.zoom + 1,
            })
        );
    };

    const zoomOut = () => {
        //dispatch(setViewState(zoomLevel.zoom - 1))
        dispatch(
            setViewState({
                zoom: viewState.zoom - 1,
            })
        );
    };

    return (
        <div className="toolbar">
            <Box m="2" className="toolbar__main">
                <Flex direction="row" justify="center">
                    <Tooltip
                        hasArrow
                        label={project == "culiacan_sur" ? "Zona Sur" : "Centro"}
                        bg="gray.700"
                        fontSize="18px"
                        borderRadius="6px"
                        px="4"
                        py="2"
                    >
                        <Button
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.FULL))
                            }
                            className={
                                viewMode === VIEW_MODES.FULL ? "active" : ""
                            }
                        >
                            <img src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png" />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        hasArrow
                        label="Colonias"
                        bg="gray.700"
                        fontSize="18px"
                        borderRadius="6px"
                        px="4"
                        py="2"
                    >
                        <Button
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.POLIGON))
                            }
                            className={
                                viewMode === VIEW_MODES.POLIGON ? "active" : ""
                            }
                        >
                            <img src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png" />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        hasArrow
                        label="Explorar"
                        bg="gray.700"
                        fontSize="18px"
                        borderRadius="6px"
                        px="4"
                        py="2"
                    >
                        <Button
                            onClick={() =>
                                dispatch(setViewMode(VIEW_MODES.LENS))
                            }
                            className={
                                viewMode === VIEW_MODES.LENS ? "active" : ""
                            }
                        >
                            <img src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png" />
                        </Button>
                    </Tooltip>
                </Flex>
            </Box>
            {viewMode === VIEW_MODES.POLIGON && <ColoniasSelect />}
            {viewMode === VIEW_MODES.FULL && <FullSelect />}
            {viewMode === VIEW_MODES.LENS && (
                <LensRadius />
            )}
            <Box m="2" className="toolbar-zoom">
                <ButtonGroup>
                    <Tooltip
                        hasArrow
                        label="Zoom"
                        bg="gray.700"
                        fontSize="14px"
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
            <Box m="2" className="toolbar-help">
                <Tooltip
                    hasArrow
                    label="Girar 3D"
                    bg="gray.700"
                    fontSize="14px"
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
            <Tooltip m="2" hasArrow label="Regresar a Inicio" fontSize="14px">
                <IconButton
                    aria-label="Regresar a Inicio"
                    className="button-small"
                    style={{ position: "absolute", top: "0px", left: "340px" }}
                    size="xs"
                    onClick={() => handleActivateLanding()}
                >
                    <MdArrowBack />
                </IconButton>
            </Tooltip>
        </div>
    );
};

const LensRadius = () => {
    const dispatch: AppDispatch = useDispatch();
    const [showTooltip, setShowTooltip] = React.useState(false);
    const lensRadius = useSelector((state: RootState) => state.viewMode.lensRadius);
    return (
        <Tooltip
            hasArrow
            placement="right"
            label="Radio de exploración"
            bg="gray.700"
            fontSize="14px"
        >
            <Box
                style={{
                    position: "relative",
                    zIndex: 1000,
                    width: "150px",
                    top: "20px",
                    left: "calc(50% + 245px)",
                    height: "30px",
                    borderRadius: "5px",
                    color: "white",
                    opacity: 0.95,
                    backgroundColor: "var(--primary-dark)",
                }}
                px="3"
                py="1"
            >
                <Slider
                    aria-label="slider-ex-1"
                    min={200}
                    max={1000}
                    step={100}
                    defaultValue={500}
                    colorScheme="cyan"
                    value={lensRadius}
                    onChange={(val) => dispatch(setLensRadius(val))}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg="gray.600"
                        color="white"
                        placement="top"
                        mt="1"
                        borderRadius="4px"
                        isOpen={showTooltip}
                        label={`${lensRadius} metros`}
                    >
                        <SliderThumb />
                    </Tooltip>
                </Slider>
            </Box>
        </Tooltip>
    )
};

const FullSelect = () => {
    const dispatch: AppDispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);

    return (
        <Select
            variant="outline"
            size="sm"
            icon={<MdArrowDropDown />}
            value={project}
            onChange={(e) => {
                dispatch(clearSelectedColonias());
                dispatch(setProject(e.target.value));
            }}
            style={{
                position: "relative",
                zIndex: 1000,
                width: "150px",
                top: "20px",
                left: "calc(50% + 245px)",
                height: "30px",
                borderRadius: "5px",
                color: "white",
                opacity: 0.95,
                backgroundColor: "var(--primary-dark)",
            }}
        >
            {REGIONS.map((region) => (
                <option key={region.key} value={region.key}>
                    {region.name}
                </option>
            ))}
        </Select>
    );
};

const ColoniasSelect = () => {
    const dispatch: AppDispatch = useDispatch();
    const [isFocused, setIsFocused] = useBoolean();
    const colonias = useSelector((state: RootState) => state.viewMode.colonias);
    const selectedColonias = useSelector(
        (state: RootState) => state.viewMode.selectedColonias
    );
    if (!colonias) return null;
    const selectedColoniasObjects = colonias
        .filter((x: any) => selectedColonias.includes(x.properties.OBJECTID_1))
        .sort((a: any, b: any) =>
            a.properties.NOM_COL > b.properties.NOM_COL ? 1 : -1
        );
    const unselectedColonias = colonias
        .filter((x: any) => !selectedColonias.includes(x.properties.OBJECTID_1))
        .sort((a: any, b: any) =>
            a.properties.NOM_COL > b.properties.NOM_COL ? 1 : -1
        );
    return (
        <Popover placement="bottom" closeOnBlur={true} isOpen={isFocused}>
            <PopoverTrigger>
                <ButtonGroup
                    my="5"
                    mx="1"
                    size="sm"
                    isAttached
                    className="toolbar-edit__div"
                >
                    <Button
                        rightIcon={
                            isFocused ? <FaChevronUp /> : <FaChevronDown />
                        }
                        onClick={setIsFocused.toggle}
                        w="100%"
                        size="sm"
                        height="35px"
                        borderRadius="5px"
                        color="white"
                        className="toolbar-edit__button"
                    >
                        {selectedColonias.length} Colonia(s)
                    </Button>
                    <IconButton
                        colorScheme="red"
                        aria-label="Remove colonias"
                        icon={<MdDelete />}
                        style={{ height: "30px", width: "30px" }}
                        onClick={() => dispatch(clearSelectedColonias())}
                    />
                </ButtonGroup>
            </PopoverTrigger>
            <PopoverContent
                border="0"
                height="200px"
                width="200px"
                bg="#4f5666f7"
                style={{ overflow: "hidden" }}
            >
                <List
                    size="sm"
                    spacing={1}
                    style={{ overflowY: "scroll" }}
                    p="2"
                >
                    {selectedColoniasObjects.map((item: any) => (
                        <>
                            <ListItem mb="2">
                                <Checkbox
                                    size="md"
                                    colorScheme="white"
                                    color="white"
                                    isChecked={true}
                                    onChange={() => {
                                        dispatch(
                                            toggleSelectedColonias(
                                                item.properties.OBJECTID_1
                                            )
                                        );
                                    }}
                                >
                                    <Text fontSize="sm">
                                        {item.properties.NOM_COL}
                                    </Text>
                                </Checkbox>
                            </ListItem>
                        </>
                    ))}
                    <Divider />
                    {unselectedColonias.map((item: any) => (
                        <>
                            <ListItem mb="2">
                                <Checkbox
                                    size="md"
                                    colorScheme="white"
                                    color="white"
                                    isChecked={false}
                                    onChange={() => {
                                        dispatch(
                                            toggleSelectedColonias(
                                                item.properties.OBJECTID_1
                                            )
                                        );
                                    }}
                                >
                                    <Text fontSize="sm">
                                        {item.properties.NOM_COL}
                                    </Text>
                                </Checkbox>
                            </ListItem>
                        </>
                    ))}
                </List>
            </PopoverContent>
        </Popover>
    );
};

export default Toolbar;
