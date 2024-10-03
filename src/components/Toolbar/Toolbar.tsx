import React from "react";
import "./Toolbar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
    setPoligonMode,
    setViewMode,
} from "../../features/viewMode/viewModeSlice";
import { setViewState } from "../../features/viewState/viewStateSlice";
import { POLYGON_MODES, VIEW_MODES } from "../../constants";
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Icon,
    Input,
    Kbd,
    Tooltip,
} from "@chakra-ui/react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { PiMouseLeftClickFill } from "react-icons/pi";

interface ToolbarProps {
    handleActivateLanding: () => void; // Define the prop type
  }
  
const Toolbar: React.FC<ToolbarProps> = ({ handleActivateLanding }) => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const viewState = useSelector((state: RootState) => state.viewState);

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
        <>
            <Box m="2" className="toolbar">
                <Flex direction="row" justify="center">
                    <Tooltip
                        hasArrow
                        label="Zona Sur"
                        bg="gray.700"
                        fontSize="18px"
                        borderRadius="6px"
                        px="4"
                        py="2"
                    >
                        <Button
                            className={
                                viewMode === VIEW_MODES.FULL ? "active" : ""
                            }
                        >
                            <img
                                onClick={() =>
                                    dispatch(setViewMode(VIEW_MODES.FULL))
                                }
                                src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        hasArrow
                        label="Poligono"
                        bg="gray.700"
                        fontSize="18px"
                        borderRadius="6px"
                        px="4"
                        py="2"
                    >
                        <Button
                            className={
                                viewMode === VIEW_MODES.POLIGON ? "active" : ""
                            }
                        >
                            <img
                                onClick={() =>
                                    dispatch(setViewMode(VIEW_MODES.POLIGON))
                                }
                                src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png"
                            />
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
                            className={
                                viewMode === VIEW_MODES.LENS ? "active" : ""
                            }
                        >
                            <img
                                onClick={() =>
                                    dispatch(setViewMode(VIEW_MODES.LENS))
                                }
                                src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png"
                            />
                        </Button>
                    </Tooltip>
                </Flex>
            </Box>
            {viewMode === VIEW_MODES.POLIGON && (
                <Box m="2" className="toolbar-edit">
                    <ButtonGroup>
                        <Tooltip
                            hasArrow
                            label="Agregar"
                            bg="gray.700"
                            fontSize="14px"
                            borderRadius="6px"
                            px="2"
                            py="1"
                        >
                            <Button size="sm">
                                <MdAdd color="lightgreen" />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            hasArrow
                            label="Editar"
                            bg="gray.700"
                            fontSize="14px"
                            borderRadius="6px"
                            px="2"
                            py="1"
                        >
                            <Button
                                onClick={() => {
                                    dispatch(
                                        setPoligonMode(POLYGON_MODES.EDIT)
                                    );
                                }}
                                size="sm"
                            >
                                <MdEdit color="orange" />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            hasArrow
                            label="Borrar"
                            bg="gray.700"
                            fontSize="14px"
                            borderRadius="6px"
                            px="2"
                            py="1"
                        >
                            <Button
                                onClick={() => {
                                    dispatch(
                                        setPoligonMode(POLYGON_MODES.DELETE)
                                    );
                                }}
                                size="sm"
                            >
                                <MdDelete color="#ff5959" />
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Box>
            )}
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
            <Box m="2" className="toolbar-help">
                <Tooltip hasArrow label="Girar 3D" bg="gray.700" fontSize="14px">
                    <Flex direction="row" justify="center">
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
            <Box m="2" className="toolbar-close">
                <Tooltip hasArrow label="Cerrar" fontSize="14px">
                    <Flex direction="row" justify="center">
                        <Button size="xs" onClick={() => handleActivateLanding()}>
                        <span> x </span>
                        </Button>
                    </Flex>
                </Tooltip>
            </Box>
        </>
    );
};

export default Toolbar;
