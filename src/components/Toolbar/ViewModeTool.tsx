import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Box, Button, Flex, Tooltip } from "@chakra-ui/react";
import { setViewMode } from "../../features/viewMode/viewModeSlice";
import { VIEW_MODES } from "../../constants";

export const ViewModeTool = () => {
    const dispatch: AppDispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    return (
        <Box m="2" className="toolbar__main">
            <Flex direction="row" justify="center">
                <Tooltip
                    hasArrow
                    label={project === "culiacan_sur" ? "Zona Sur" : "Centro"}
                    bg="gray.700"
                    fontSize="18px"
                    borderRadius="6px"
                    px="4"
                    py="2"
                >
                    <Button
                        onClick={() => dispatch(setViewMode(VIEW_MODES.FULL))}
                        className={viewMode === VIEW_MODES.FULL ? "active" : ""}
                    >
                        <img
                            src="https://sinaloa.travel/images/destinos/culiacan/Culiacan-map.png"
                            alt="Region"
                        />
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
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7168/7168063.png"
                            alt="Colonias"
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
                        onClick={() => dispatch(setViewMode(VIEW_MODES.LENS))}
                        className={viewMode === VIEW_MODES.LENS ? "active" : ""}
                    >
                        <img
                            src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-noir.png"
                            alt="Explorar"
                        />
                    </Button>
                </Tooltip>
            </Flex>
        </Box>
    );
};
