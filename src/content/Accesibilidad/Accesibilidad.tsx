import { useEffect } from "react";
import {
    AccessibilityPointsTreemap,
    SelectAutoComplete,
} from "../../components";
import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    Box,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FaWalking } from "react-icons/fa";
import { FaLayerGroup, FaChartLine } from "react-icons/fa6";
import "./Accesibilidad.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { amenitiesOptions, VIEW_MODES } from "../../constants";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { MdOutlineAccessTime } from "react-icons/md";
import { AccordionHeader } from "../AccordionContent";
import { ComparativeMetric } from "../../components/ComparativeMetric";
import { GraphPercent } from "../../components/GraphPercent";
import { AccessibilityPieChart } from "./AccessibilityPieChart";

const Accesibilidad = ({ metrics }: any) => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const dispatch = useDispatch();
    const slopeType =
        metrics.slope <= 15 ? "Baja" : metrics.slope <= 30 ? "Media" : "Alta";

    useEffect(() => {
        dispatch(setActiveAmenity(""));
    }, [viewMode, dispatch]);

    return (
        <div className="accesibilidad tab__main">
            <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionHeader
                        title="Servicios de proximidad"
                        description="Servicios urbanos esenciales, como escuelas, tiendas, hospitales y centros de transporte, ubicados en las cercanías de las áreas residenciales, facilitando el acceso rápido y eficiente para los habitantes."
                    />
                    <AccordionPanel p={0}>
                        <VStack
                            spacing={"0"}
                            className="accordion-body"
                            style={{ padding: "0.4rem" }}
                        >
                            <SelectAutoComplete />
                            <ComparativeMetric
                                metric="minutes"
                                icon={MdOutlineAccessTime}
                            >
                                <Text>{Math.trunc(metrics.minutes)} min</Text>
                            </ComparativeMetric>
                            <ComparativeMetric
                                name="Equipamiento más lejano"
                                icon={MdOutlineAccessTime}
                            >
                                <Text>
                                    {
                                        amenitiesOptions.find(
                                            (option) =>
                                                option.value === metrics.amenity
                                        )?.label
                                    }
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric
                                metric="accessibility_score"
                                icon={FaWalking}
                            >
                                <GraphPercent
                                    value={metrics?.accessibility_score || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                disabled={true}
                                metric="Número de equipamientos por tipo"
                                icon={FaLayerGroup}
                            >
                                <Box
                                    className="treemapContainer"
                                    style={{
                                        flexDirection: "column",
                                    }}
                                >
                                    {viewMode === VIEW_MODES.FULL ? (
                                        <AccessibilityPointsTreemap />
                                    ) : (
                                        <AccessibilityPieChart />
                                    )}
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="slope"
                                icon={FaChartLine}
                            >
                                <Text>
                                    {slopeType} ({Math.trunc(metrics.slope)}°)
                                </Text>
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Accesibilidad;
