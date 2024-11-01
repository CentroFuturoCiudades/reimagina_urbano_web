import React, { PureComponent, ReactElement, useEffect, useState } from "react";
import {
    AccessibilityPointsTreemap,
    SelectAutoComplete,
} from "../../components";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    VStack,
    Tooltip,
} from "@chakra-ui/react";
import { FaInfoCircle, FaWalking } from "react-icons/fa";
import { FaBuilding, FaLayerGroup, FaChartLine } from "react-icons/fa6";
import "./Accesibilidad.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
    ACCESSIBILITY_POINTS_COLORS,
    amenitiesOptions,
    VIEW_MODES,
} from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { ComparativeMetric, GraphPercent } from "../Visor/Visor";
import { MdOutlineAccessTime } from "react-icons/md";

const Accesibilidad = ({ metrics }: any) => {
    const accessibilityPoints = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityPoints
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const dispatch = useDispatch();
    const slopeType = metrics.slope <= 15 ? "Baja" : metrics.slope <= 30 ? "Media" : "Alta";

    useEffect(() => {
        dispatch(setActiveAmenity(""));
    }, [viewMode]);

    return (
        <div className="accesibilidad tab__main">
            <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box
                            flex="1"
                            textAlign="left"
                            display="flex"
                            alignItems="center"
                        >
                            Servicios de proximidad
                            <Tooltip
                                label="Servicios urbanos esenciales, como escuelas, tiendas, hospitales y centros de transporte, ubicados en las cercanías de las áreas residenciales, facilitando el acceso rápido y eficiente para los habitantes."
                                fontSize="md"
                            >
                                <span
                                    style={{
                                        marginLeft: "5px",
                                        color: "white",
                                        cursor: "pointer",
                                    }}
                                >
                                    <FaInfoCircle />
                                </span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
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
                                metric="accessibility_score"
                                icon={FaWalking}
                            >
                                <GraphPercent
                                    value={metrics?.accessibility_score || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                disabled={true}
                                metric="Total de equipamientos dentro del área"
                                icon={FaBuilding}
                            >
                                <Text>{accessibilityPoints.length}</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                disabled={true}
                                metric="Tipo de equipamientos"
                                icon={FaLayerGroup}
                            >
                                <Box
                                    className="treemapContainer"
                                    style={{
                                        flexDirection: "column",
                                        padding: "1rem",
                                    }}
                                >
                                    {viewMode == VIEW_MODES.FULL ? (
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
                                <Text>{slopeType} ({Math.trunc(metrics.slope)}°)</Text>
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

const AccessibilityPieChart = () => {
    const accessibilityPoints = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityPoints
    );
    const categoryCount = accessibilityPoints.reduce((acc: any, item: any) => {
        const categoryType =
            amenitiesOptions.find((option) => option.label === item.amenity)
                ?.type || "other";

        acc[categoryType] = acc[categoryType] || 0;
        acc[categoryType]++;
        return acc;
    }, {});
    const data = Object.entries(mappingCategories).map(([key, value]) => ({
        name: key,
        value: categoryCount[key] || 0,
    }));

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "260px",
            }}
        >
            <ResponsiveContainer width={"55%"} height={"100%"}>
                <PieChart width={100} height={100}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={30}
                        fill="#8884d8"
                    >
                        {data.map((entry: any, index: any) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={ACCESSIBILITY_POINTS_COLORS[entry.name]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ width: "45%" }}>
                {data.map((entry: any, index: any) => (
                    <>
                        <div
                            style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: ACCESSIBILITY_POINTS_COLORS[entry.name],
                            }}
                        >
                            {mappingCategories[entry.name]}
                        </div>
                        <div className="accesibilidad__equipment">
                            <div
                                style={{
                                    marginLeft: "10px",
                                    fontWeight: "600",
                                    color: "var(--primary-dark3)",
                                }}
                            >
                                {entry.value || "No tiene"}
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Accesibilidad;
