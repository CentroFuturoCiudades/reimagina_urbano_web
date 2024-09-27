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
    Tooltip,
} from "@chakra-ui/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import "./Visor.scss";
import { RootState } from "../../app/store";
import PopulationPyramid from "../../components/PopulationPyramid";
import { mappingGradoEscolaridad, METRICS_MAPPING, VIEW_COLORS_RGBA, METRIC_DESCRIPTIONS } from "../../constants";
import { GenericObject } from "../../types";
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";


const ComparativeMetric = ({name, metric, children}: {name?: string, metric?: string, children: React.ReactNode[]}) => {
    const dispatch = useDispatch();
    const currentMetric = useSelector((state: RootState) => state.queryMetric.queryMetric);
    const isCurrent = currentMetric === metric;
    const title = metric ? name || METRICS_MAPPING[metric]?.title || metric : name || "";
    return (
        <Box
            className="stat-row"
            style={{
                cursor: metric ? 'pointer' : 'default',
            }}
            onClick={() => {
                if (metric)
                    dispatch(setQueryMetric(metric));
            }}
        >
            <Box className="stat-title-box" style={{ backgroundColor: isCurrent ? '#a2a888' : 'transparent' }}>
                <Text className="stat-title" style={{ backgroundColor: isCurrent ? '#a2a888' : 'transparent' }}>
                    {title}
                    <Tooltip label={METRIC_DESCRIPTIONS[metric || name || ""] || title} fontSize="md">
                        <span style={{ marginLeft: "5px", color: "gray", cursor: "pointer" }}><FaInfoCircle /></span>
                    </Tooltip>
                </Text>
            </Box>
            <Box className="stat-value" style={{ backgroundColor: isCurrent ? '#e2e6d1' : 'transparent' }}>
                <Box>
                    {children[0]}
                </Box>
                {children.length > 1 &&
                    <Box className="dark">
                    {children[1]}
                </Box>}
            </Box>
        </Box>
    )
}


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

const GraphPercent = ({ value, base }: { value: number, base: number }) => {
    let percent = value / base * 100;
    return (
        <CircularProgress
            size="100px"
            value={
                percent
            }
            color={ VIEW_COLORS_RGBA.VISOR.primary }
        >
            <CircularProgressLabel fontSize="16px" display="flex" alignItems="center"  justifyContent="center" textAlign="center">
                {percent.toFixed(0)}%
            </CircularProgressLabel>
        </CircularProgress>
    );
}

const GraphPercentWIndicator = ({ value, base, compareWith }: { value: number, base: number, compareWith: number }) => {
    const percent = (value / base) * 100;
  
    const isHigher = percent > compareWith;
    const ArrowIcon = isHigher ? IoCaretUp : IoCaretDown;
    const indicatorColor = isHigher ? "green" : "red";
  
    return (
      <CircularProgress
        size="100px"
        value={percent}
        color={VIEW_COLORS_RGBA.VISOR.primary}
      >
        <CircularProgressLabel
          fontSize="16px"
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
                        <Box flex="1" textAlign="left">
                            Perfil sociodemográfico
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={0} className="accordion-body">
                            <Box className="stat-row header" style={{ margin: 0}}>
                                <Box className="stat-title-box" style={{ margin: 0}}>
                                    <Text className="stat-title" width={"50%"}>Zona Sur</Text>
                                    <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                                </Box>
                            </Box>
                            <ComparativeMetric metric="poblacion">
                                <Text>
                                    { metrics?.pobtot?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                    hab
                                </Text>
                                <Text>
                                    { globalData?.pobtot?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    })}
                                    hab
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric name="Pirámide poblacional">
                                <PopulationPyramid data={pyramidData} />
                                <PopulationPyramid data={ getPyramidData( globalData ) } />
                            </ComparativeMetric>
                            <ComparativeMetric metric="grado_escuela">
                            <Box display="flex" alignItems="center">
                                <Text fontSize="sm">
                                {mappingGradoEscolaridad[metrics?.graproes?.toFixed(0)] || ""} 
                                ({metrics?.graproes?.toFixed(0)})
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

                            <Text fontSize="sm">
                                { mappingGradoEscolaridad[globalData?.graproes?.toFixed(0)] || "" } ({ globalData?.graproes?.toFixed(0) })
                            </Text>
                            </ComparativeMetric>
                            <ComparativeMetric metric="viviendas_habitadas">
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
                            <ComparativeMetric metric="viviendas_deshabitadas">
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
                        <Box flex="1" textAlign="left">
                            Perfil socioeconómico
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={0} className="accordion-body" p={0}>
                            <Box className="stat-row header" style={{ margin: 0}}>
                                <Box className="stat-title-box" style={{ margin: 0}}>
                                    <Text className="stat-title" width={"50%"}>Zona Sur</Text>
                                    <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                                </Box>
                            </Box>
                            <ComparativeMetric metric="indice_bienestar">
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

                            <ComparativeMetric metric="viviendas_auto">
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

                            <ComparativeMetric metric="viviendas_pc">
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

                            <ComparativeMetric metric="viviendas_tinaco">
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