import { ReactElement, useEffect, useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    CircularProgress,
    CircularProgressLabel,
    VStack,
    Icon,
    Link,
    Tooltip,
} from "@chakra-ui/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import "./Visor.scss";
import { RootState } from "../../app/store";
import PopulationPyramid from "../../components/PopulationPyramid";
import {
    mappingGradoEscolaridad,
    METRIC_DESCRIPTIONS,
    METRICS_MAPPING,
    VIEW_COLORS_RGBA,
    VIEW_MODES,
} from "../../constants";
import { GenericObject } from "../../types";
import {
    IoCaretUp,
    IoCaretDown,
    IoWater,
    IoHappy,
    IoHappyOutline,
} from "react-icons/io5";
import { FaPerson, FaHouseUser, FaComputer } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { FaCar, FaInfoCircle } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { BsFillHouseSlashFill } from "react-icons/bs";

export const ComparativeMetric = ({
    name,
    metric,
    icon,
    disabled,
    children,
}: {
    name?: string;
    metric?: string;
    icon?: any;
    disabled?: boolean;
    children: React.ReactNode[] | React.ReactNode;
}) => {
    const dispatch = useDispatch();
    const currentMetric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const isCurrent = currentMetric === metric;
    const title = metric
        ? name || METRICS_MAPPING[metric]?.title || metric
        : name || "";

    // Métricas sin hover
    const metricsWithoutIcon = [
        "viviendas_habitadas",
        "viviendas_auto",
        "viviendas_pc",
    ];

    return (
        <Box
            className="stat-row"
            style={{
                cursor: metric && !disabled ? "pointer" : "default",
            }}
            onClick={() => {
                if (metric && !disabled) dispatch(setQueryMetric(metric));
            }}
        >
            <Box
                className={`stat-title-box${
                    metric && !disabled ? " regular" : ""
                }${isCurrent ? " active" : ""}`}
            >
                <Tooltip
                    hasArrow
                    label={METRIC_DESCRIPTIONS[metric || ""]}
                    fontSize="md"
                    placement="right"
                >
                    <Text
                        className="stat-title"
                        style={{ color: isCurrent ? "white" : "#383b46" }}
                    >
                        {icon && (
                            <span>
                                <Icon
                                    as={icon}
                                    mr="2"
                                    color={isCurrent ? "white" : "#383b46"}
                                />
                            </span>
                        )}
                        {title}
                    </Text>
                </Tooltip>
            </Box>
            {Array.isArray(children) ? (
                <Box className="stat-value">
                    <Box>{children[0]}</Box>
                    {children.length > 1 && (
                        <Box className="dark">{children[1]}</Box>
                    )}
                </Box>
            ) : (
                <Box className="stat-value full">
                    <Box>{children}</Box>
                </Box>
            )}
        </Box>
    );
};

const getPyramidData = (metrics: any) => {
    return metrics
        ? [
              {
                  age: "0-2",
                  male: metrics.p_0a2_m,
                  female: metrics.p_0a2_f,
                  total: metrics.p_0a2_m + metrics.p_0a2_f,
              },
              {
                  age: "3-5",
                  male: metrics.p_3a5_m,
                  female: metrics.p_3a5_f,
                  total: metrics.p_3a5_m + metrics.p_3a5_f,
              },
              {
                  age: "6-11",
                  male: metrics.p_6a11_m,
                  female: metrics.p_6a11_f,
                  total: metrics.p_6a11_m + metrics.p_6a11_f,
              },
              {
                  age: "12-14",
                  male: metrics.p_12a14_m,
                  female: metrics.p_12a14_f,
                  total: metrics.p_12a14_m + metrics.p_12a14_f,
              },
              {
                  age: "15-17",
                  male: metrics.p_15a17_m,
                  female: metrics.p_15a17_f,
                  total: metrics.p_15a17_m + metrics.p_15a17_f,
              },
              {
                  age: "18-24",
                  male: metrics.p_18a24_m,
                  female: metrics.p_18a24_f,
                  total: metrics.p_18a24_m + metrics.p_18a24_f,
              },
              {
                  age: "25-59",
                  male: metrics.p_25a59_m,
                  female: metrics.p_25a59_f,
                  total: metrics.p_25a59_m + metrics.p_25a59_f,
              },
              {
                  age: "60+",
                  male: metrics.p_60ymas_m,
                  female: metrics.p_60ymas_f,
                  total: metrics.p_60ymas_m + metrics.p_60ymas_f,
              },
          ]
        : [];
};

export const GraphPercent = ({ value }: { value: number }) => {
    return (
        <CircularProgress
            size="100px"
            value={value}
            color="var(--primary-dark)"
        >
            <CircularProgressLabel
                fontSize="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                {(value || 0).toFixed(0)}
            </CircularProgressLabel>
        </CircularProgress>
    );
};

export const GraphPercentWIndicator = ({
    value,
    compareWith,
}: {
    value: number;
    compareWith: number;
}) => {
    const isHigher = value > compareWith;
    const ArrowIcon = isHigher ? IoCaretUp : IoCaretDown;
    const indicatorColor = isHigher ? "green" : "red";

    return (
        <CircularProgress
            size="100px"
            value={value}
            color="var(--primary-dark)"
        >
            <CircularProgressLabel
                fontSize="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                {(value || 0).toFixed(0)}%{" "}
                {compareWith !== undefined && (
                    <ArrowIcon
                        style={{ marginLeft: "4px", color: indicatorColor }}
                    />
                )}
            </CircularProgressLabel>
        </CircularProgress>
    );
};

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const globalData = useSelector((state: RootState) => state.queryMetric.globalData);
    const [pyramidData, setPyramidData] = useState<any[]>([]);
    const [globalPyramidData, setGlobalPyramidData] = useState<any[]>([]);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const project = window.location.pathname.split("/")[1];
    const zoneLabel = project == "primavera" ? "Zona Sur" : "Centro";

    useEffect(() => {
        const pyramidData = getPyramidData(metrics).map((entry) => ({
            per_male: entry.male / metrics.poblacion * 100,
            per_female: entry.female / metrics.poblacion * 100,
            per_total: entry.total / metrics.poblacion * 100,
            ...entry,
        }));
        setPyramidData(pyramidData);
    }, [metrics]);

    useEffect(() => {
        const pyramidData = getPyramidData(globalData).map((entry) => ({
            per_male: entry.male / globalData.poblacion * 100,
            per_female: entry.female / globalData.poblacion * 100,
            per_total: entry.total / globalData.poblacion * 100,
            ...entry,
        }));
        setGlobalPyramidData(pyramidData);
    }, [globalData]);

    return (
        <div className="visor tab__main">
            <Accordion
                allowToggle
                defaultIndex={[0]}
                onChange={(index) => {
                    if (index === 0) {
                        dispatch(setQueryMetric("poblacion"));
                    } else {
                        dispatch(setQueryMetric("indice_bienestar"));
                    }
                }}
            >
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box
                            flex="1"
                            textAlign="left"
                            display="flex"
                            alignItems="center"
                        >
                            Perfil sociodemográfico
                            <Tooltip
                                label="Información sobre las características demográficas de la población, incluyendo edad, género, estado civil, tamaño del hogar, migración, y etnicidad, que permite analizar la composición y estructura de la población en un área específica."
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
                        <Box className="stat-row header" style={{ margin: 0 }}>
                            <Box className="title-box" style={{ margin: 0 }}>
                                <Text className="stat-title" width={"50%"}>
                                    {viewMode === VIEW_MODES.FULL
                                        ? zoneLabel
                                        : "Poligono"}
                                </Text>
                                <Text className="stat-title dark" width={"50%"}>
                                    Culiacán
                                </Text>
                            </Box>
                        </Box>
                        <VStack
                            spacing={0}
                            className="accordion-body"
                            style={{ padding: "0.4rem" }}
                        >
                            <ComparativeMetric
                                metric="poblacion"
                                icon={FaPerson}
                            >
                                <Box>
                                    {metrics?.poblacion?.toLocaleString(
                                        "es-MX",
                                        {
                                            maximumFractionDigits: 0,
                                        }
                                    ) || ""}
                                    <Text fontSize="sm" textAlign={"center"}>
                                        habitantes
                                    </Text>
                                </Box>
                                <Box>
                                    {globalData?.poblacion?.toLocaleString(
                                        "es-MX",
                                        {
                                            maximumFractionDigits: 0,
                                        }
                                    )}
                                    <Text fontSize="sm" textAlign={"center"}>
                                        habitantes
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            {/* Sustituir por pyramidData en lugar de testData */}
                            <ComparativeMetric
                                disabled={true}
                                name="Pirámide poblacional"
                                icon={ImManWoman}
                                metric="Pirámide poblacional"
                            >
                                <PopulationPyramid
                                    data={pyramidData}
                                    invertAxes={true}
                                    showLegend={false}
                                    additionalMarginBottom={23}
                                />
                                <PopulationPyramid
                                    data={globalPyramidData}
                                    invertAxes={false}
                                    showLegend={false}
                                    additionalMarginBottom={23}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="grado_escuela"
                                icon={MdSchool}
                            >
                                <Box display="flex" textAlign="center">
                                    <Text fontSize="md" justifyContent="center">
                                        {mappingGradoEscolaridad[
                                            metrics?.grado_escuela?.toFixed(0)
                                        ] || ""}
                                    </Text>
                                    {metrics?.grado_escuela !== undefined &&
                                        globalData?.grado_escuela !== undefined && (
                                            <>
                                                {metrics?.grado_escuela >
                                                globalData?.grado_escuela ? (
                                                    <IoCaretUp
                                                        style={{
                                                            marginLeft: "4px",
                                                            color: "green",
                                                        }}
                                                    />
                                                ) : metrics?.grado_escuela <
                                                  globalData?.grado_escuela ? (
                                                    <IoCaretDown
                                                        style={{
                                                            marginLeft: "4px",
                                                            color: "red",
                                                        }}
                                                    />
                                                ) : null}
                                            </>
                                        )}
                                </Box>

                                <Text fontSize="md" textAlign="center">
                                    {mappingGradoEscolaridad[
                                        globalData?.grado_escuela?.toFixed(0)
                                    ] || ""}
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric
                                metric="viviendas_habitadas"
                                icon={FaHouseUser}
                            >
                                <Tooltip
                                    content={`
                                        Viviendas Habitadas: ${metrics?.viviendas_habitadas},
                                        Viviendas Deshabitadas:  ${metrics?.viviendas_deshabitadas}
                                    `}
                                >
                                    <GraphPercentWIndicator
                                        value={
                                            (metrics?.viviendas_habitadas /
                                                (metrics?.viviendas_habitadas +
                                                    metrics?.viviendas_deshabitadas)) *
                                                100 || 0
                                        }
                                        compareWith={
                                            (globalData?.viviendas_habitadas /
                                                (globalData?.viviendas_habitadas +
                                                    globalData?.viviendas_deshabitadas)) *
                                                100 || 0
                                        }
                                    />
                                </Tooltip>

                                <GraphPercent
                                    value={
                                        (globalData?.viviendas_habitadas /
                                            (globalData?.viviendas_habitadas +
                                                globalData?.viviendas_deshabitadas)) *
                                            100 || 0
                                    }
                                />
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box
                            flex="1"
                            textAlign="left"
                            display="flex"
                            alignItems="center"
                        >
                            Perfil socioeconómico
                            <Tooltip
                                label="Datos sobre los niveles de ingresos, empleo, acceso a servicios básicos, vivienda, y nivel educativo, que permiten evaluar la calidad de vida y el bienestar económico de la población."
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
                        <Box className="stat-row header" style={{ margin: 0 }}>
                            <Box className="title-box" style={{ margin: 0 }}>
                                <Text className="stat-title" width={"50%"}>
                                    {viewMode === VIEW_MODES.FULL
                                        ? zoneLabel
                                        : "Poligono"}
                                </Text>
                                <Text className="stat-title dark" width={"50%"}>
                                    Culiacán
                                </Text>
                            </Box>
                        </Box>
                        <VStack
                            spacing={0}
                            className="accordion-body"
                            style={{ padding: "0.4rem" }}
                        >
                            <ComparativeMetric
                                metric="indice_bienestar"
                                icon={IoHappyOutline}
                            >
                                <GraphPercentWIndicator
                                    value={metrics?.indice_bienestar || 0}
                                    compareWith={
                                        globalData?.indice_bienestar || 0
                                    }
                                />
                                <GraphPercent
                                    value={globalData?.indice_bienestar}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="viviendas_auto"
                                icon={FaCar}
                            >
                                <GraphPercentWIndicator
                                    value={metrics?.viviendas_auto || 0}
                                    compareWith={globalData?.viviendas_auto || 0}
                                />
                                <GraphPercent
                                    value={globalData?.viviendas_auto || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="viviendas_pc"
                                icon={FaComputer}
                            >
                                <GraphPercentWIndicator
                                    value={metrics?.viviendas_pc || 0}
                                    compareWith={globalData?.viviendas_pc || 0}
                                />
                                <GraphPercent
                                    value={globalData?.viviendas_pc || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="viviendas_tinaco"
                                icon={IoWater}
                            >
                                <GraphPercentWIndicator
                                    value={metrics?.viviendas_tinaco || 0}
                                    compareWith={globalData?.viviendas_tinaco || 0}
                                />
                                <GraphPercent
                                    value={globalData?.viviendas_tinaco || 0}
                                />
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Visor;
