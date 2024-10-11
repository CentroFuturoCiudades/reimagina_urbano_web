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
import { mappingGradoEscolaridad, METRIC_DESCRIPTIONS, METRICS_MAPPING, VIEW_COLORS_RGBA, VIEW_MODES } from "../../constants";
import { GenericObject } from "../../types";
import { IoCaretUp, IoCaretDown, IoWater, IoHappy, IoHappyOutline } from "react-icons/io5";
import { FaPerson, FaHouseUser, FaComputer } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { FaCar, FaInfoCircle } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { BsFillHouseSlashFill } from "react-icons/bs";


export const ComparativeMetric = ({ name, metric, icon, disabled ,children}: { name?: string, metric?: string, icon?: any, disabled?: boolean , children: React.ReactNode[] | React.ReactNode }) => {
    const dispatch = useDispatch();
    const currentMetric = useSelector((state: RootState) => state.queryMetric.queryMetric);
    const isCurrent = currentMetric === metric;
    const title = metric ? name || METRICS_MAPPING[metric]?.title || metric : name || "";

    // Métricas sin hover
    const metricsWithoutIcon = ["viviendas_habitadas", "viviendas_auto", "viviendas_pc"];

    return (
        <Box
            className="stat-row"
            style={{
                cursor: metric && !disabled ? 'pointer' : 'default',
            }}
            onClick={() => {
                if (metric && !disabled ) dispatch(setQueryMetric(metric));
            }}
        >
            <Box className={`stat-title-box${metric && !disabled ? " regular" : ""}${isCurrent ? " active" : ""}`}>
                <Text className="stat-title" style={{ color: isCurrent ? 'white' : '#383b46' }}>
                    {icon && (
                        <Tooltip label={METRIC_DESCRIPTIONS[metric || ""]} fontSize="md">
                            <span>
                                <Icon as={icon} mr="2" color={isCurrent ? 'white' : '#383b46'} />
                            </span>
                        </Tooltip>
                    )}
                    {title}
                </Text>
            </Box>
            {Array.isArray(children) ? (
                <Box className="stat-value">
                    <Box>{children[0]}</Box>
                    {children.length > 1 && <Box className="dark">{children[1]}</Box>}
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
                  total: metrics.p_25a59_M + metrics.p_25a59_f,
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

export const GraphPercent = ({ value, base }: { value: number, base: number }) => {
    let percent = value / base * 100;
    return (
        <CircularProgress
            size="100px"
            value={
                percent
            }
            color="var(--primary-dark)"
        >
            <CircularProgressLabel fontSize="18px" display="flex" alignItems="center"  justifyContent="center" textAlign="center">
                {percent.toFixed(0)}%
            </CircularProgressLabel>
        </CircularProgress>
    );
}

export const GraphPercentWIndicator = ({ value, base, compareWith }: { value: number, base: number, compareWith: number }) => {
    const percent = (value / base) * 100;

    const isHigher = percent > compareWith;
    const ArrowIcon = isHigher ? IoCaretUp : IoCaretDown;
    const indicatorColor = isHigher ? "green" : "red";

    return (
      <CircularProgress
        size="100px"
        value={percent}
        color="var(--primary-dark)"
      >
        <CircularProgressLabel
          fontSize="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          {percent.toFixed(0)}% {compareWith !== undefined && (
        <ArrowIcon style={{ marginLeft: "4px", color: indicatorColor }} />
        )}
        </CircularProgressLabel>
      </CircularProgress>
    );
  };

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const globalData: GenericObject = {
        pobtot: 1003530,
        graproes: 11.06,
        vivpar_hab: 270235,
        vivpar_des: 46489.0,
        "p_0a2_f": 22745.0, "p_0a2_m": 23760.0,
        "p_3a5_f": 24415.0, "p_3a5_m": 25097.0,
        "p_6a11_f": 49274.0, "p_6a11_m": 51630.0,
        "p_12a14_f": 25139.0, "p_12a14_m": 25983.0,
        "p_15a17_f": 25163.0, "p_15a17_m": 25683.0,
        "p_18a24_f": 62928.0, "p_18a24_m": 61763.0,
        "p_25a59_f": 327737.0 , "p_25a59_m": 314356.0,
        "p_60ymas_f": 60860.0, "p_60ymas_m": 50853.0,
        vph_tinaco: 128589,
        vph_pc: 131189,
        vph_autom: 166497
    }
    const [pyramidData, setPyramidData] = useState<any[]>([]);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    useEffect(() => {
        setPyramidData(getPyramidData(metrics));
    }, [metrics]);

    return (
        <div className="visor tab__main">
            <Accordion allowToggle defaultIndex={[0]} onChange={(index) => {
                if (index === 0) {
                    dispatch(setQueryMetric("poblacion"));
                } else {
                    dispatch(setQueryMetric("indice_bienestar"));
                }
            }
            }>
                <AccordionItem style={{ borderWidth: "0px" }}>

                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left" display="flex" alignItems="center">
                            Perfil sociodemográfico
                            <Tooltip label="Información sobre las características demográficas de la población, incluyendo edad, género, estado civil, tamaño del hogar, migración, y etnicidad, que permite analizar la composición y estructura de la población en un área específica." fontSize="md">
                                <span style={{ marginLeft: "5px", color: "white", cursor: "pointer"}}>
                                    <FaInfoCircle />
                                </span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <Box className="stat-row header" style={{ margin: 0}}>
                            <Box className="title-box" style={{ margin: 0}}>
                                <Text className="stat-title" width={"50%"}>{viewMode === VIEW_MODES.FULL ? "Zona Sur" : "Poligono"}</Text>
                                <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                            </Box>
                        </Box>
                        <VStack spacing={0} className="accordion-body" style={{ padding: "0.4rem" }}>
                            <ComparativeMetric metric="poblacion" icon={FaPerson}>
                                <Text>
                                    { metrics?.pobtot?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                    <Text fontSize="sm">habitantes</Text>
                                </Text>
                                <Text>
                                    { globalData?.pobtot?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    })}
                                    <Text fontSize="sm">habitantes</Text>
                                </Text>
                            </ComparativeMetric>

                            <ComparativeMetric disabled={true} name="Pirámide poblacional" icon={ImManWoman} metric="Pirámide poblacional">
                                <PopulationPyramid data={pyramidData} />
                                <PopulationPyramid data={ getPyramidData( globalData ) } />
                            </ComparativeMetric>

                            <ComparativeMetric metric="grado_escuela" icon={MdSchool}>
                            <Box display="flex" textAlign="center">
                                <Text fontSize="md" justifyContent="center">
                                {mappingGradoEscolaridad[metrics?.graproes?.toFixed(0)] || ""}
                                {/* ({metrics?.graproes?.toFixed(0)}) */}
                                </Text>
                                {metrics?.graproes !== undefined && globalData?.graproes !== undefined && (
                                <>
                                    {metrics?.graproes > globalData?.graproes ? (
                                    <IoCaretUp style={{ marginLeft: "4px", color: "green" }} />
                                    ) : metrics?.graproes < globalData?.graproes ? (
                                    <IoCaretDown style={{ marginLeft: "4px", color: "red" }} />
                                    ) : null}
                                </>
                                )}
                            </Box>

                            <Text fontSize="md" textAlign="center">
                                { mappingGradoEscolaridad[globalData?.graproes?.toFixed(0)] || "" } ({ globalData?.graproes?.toFixed(0) })
                            </Text>
                            </ComparativeMetric>
                            <ComparativeMetric metric="viviendas_habitadas" icon={FaHouseUser}>
                                <Text>
                                    { metrics?.vivpar_hab?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                </Text>
                                <Text>
                                    { globalData?.vivpar_hab?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric metric="viviendas_deshabitadas" icon={BsFillHouseSlashFill}>
                            <GraphPercentWIndicator
                                value={metrics?.vivpar_des || 0}
                                base={metrics?.vivpar_hab || 0}
                                compareWith={(globalData?.vivpar_des / globalData?.vivpar_hab) * 100 || 0}
                            />
                            <GraphPercent
                                value={globalData?.vivpar_des || 0}
                                base={globalData?.vivpar_hab || 0}
                            />
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left" display="flex" alignItems="center">
                            Perfil socioeconómico
                            <Tooltip label="Datos sobre los niveles de ingresos, empleo, acceso a servicios básicos, vivienda, y nivel educativo, que permiten evaluar la calidad de vida y el bienestar económico de la población." fontSize="md">
                                <span style={{ marginLeft: "5px", color: "white", cursor: "pointer" }}>
                                    <FaInfoCircle />
                                </span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <Box className="stat-row header" style={{ margin: 0}}>
                            <Box className="title-box" style={{ margin: 0}}>
                                <Text className="stat-title" width={"50%"}>{viewMode === VIEW_MODES.FULL ? "Zona Sur" : "Poligono"}</Text>
                                <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                            </Box>
                        </Box>
                        <VStack spacing={0} className="accordion-body" style={{ padding: "0.4rem" }}>
                            <ComparativeMetric metric="indice_bienestar" icon={IoHappyOutline}>
                                <GraphPercentWIndicator
                                    value={metrics?.puntuaje_hogar_digno || 0}
                                    base={100}
                                    compareWith={globalData?.puntuaje_hogar_digno || 0}
                                />
                                <GraphPercent
                                    value={globalData?.puntuaje_hogar_digno || 0}
                                    base={100}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric metric="viviendas_auto" icon={FaCar}>
                                <GraphPercentWIndicator
                                    value={metrics?.vph_autom || 0}
                                    base={metrics?.vivpar_hab || 0}
                                    compareWith={(globalData?.vph_autom / globalData?.vivpar_hab) * 100 || 0}
                                />
                                <GraphPercent
                                    value={globalData?.vph_autom || 0}
                                    base={globalData?.vivpar_hab || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric metric="viviendas_pc" icon={FaComputer}>
                                <GraphPercentWIndicator
                                    value={metrics?.vph_pc || 0}
                                    base={metrics?.vivpar_hab || 0}
                                    compareWith={(globalData?.vph_pc / globalData?.vivpar_hab) * 100 || 0}
                                />
                                <GraphPercent
                                    value={globalData?.vph_pc || 0}
                                    base={globalData?.vivpar_hab || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric metric="viviendas_tinaco" icon={IoWater}>
                                <GraphPercentWIndicator
                                    value={metrics?.vph_tinaco || 0}
                                    base={metrics?.vivpar_hab || 0}
                                    compareWith={(globalData?.vph_tinaco / globalData?.vivpar_hab) * 100 || 0}
                                />
                                <GraphPercent
                                    value={globalData?.vph_tinaco || 0}
                                    base={globalData?.vivpar_hab || 0}
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


