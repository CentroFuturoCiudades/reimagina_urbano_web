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
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import "./Visor.scss";
import { RootState } from "../../app/store";
import PopulationPyramid from "../../components/PopulationPyramid";
import { COLUMN_MAPPING, VIEW_COLORS_RGBA } from "../../constants";
import { GenericObject } from "../../types";


const ComparativeMetric = ({name, metric, children}: {name: string, metric: string | undefined, children: React.ReactNode[]}) => {
    const dispatch = useDispatch();
    const currentMetric = useSelector((state: RootState) => state.queryMetric.queryMetric);
    const isCurrent = currentMetric === metric;
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
                <Text className="stat-title" style={{ backgroundColor: isCurrent ? '#a2a888' : 'transparent' }}>{name}</Text>
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
                  male: metrics.P_0A2_M,
                  female: metrics.P_0A2_F,
                  total: metrics.P_0A2_M + metrics.P_0A2_F,
              },
              {
                  age: "3-5",
                  male: metrics.P_3A5_M,
                  female: metrics.P_3A5_F,
                  total: metrics.P_3A5_M + metrics.P_3A5_F,
              },
              {
                  age: "6-11",
                  male: metrics.P_6A11_M,
                  female: metrics.P_6A11_F,
                  total: metrics.P_6A11_M + metrics.P_6A11_F,
              },
              {
                  age: "12-14",
                  male: metrics.P_12A14_M,
                  female: metrics.P_12A14_F,
                  total: metrics.P_12A14_M + metrics.P_12A14_F,
              },
              {
                  age: "15-17",
                  male: metrics.P_15A17_M,
                  female: metrics.P_15A17_F,
                  total: metrics.P_15A17_M + metrics.P_15A17_F,
              },
              {
                  age: "18-24",
                  male: metrics.P_18A24_M,
                  female: metrics.P_18A24_F,
                  total: metrics.P_18A24_M + metrics.P_18A24_F,
              },
              {
                  age: "25-59",
                  male: metrics.P_25A59_M,
                  female: metrics.P_25A59_F,
                  total: metrics.P_25A59_M + metrics.P_25A59_F,
              },
              {
                  age: "60+",
                  male: metrics.P_60YMAS_M,
                  female: metrics.P_60YMAS_F,
                  total: metrics.P_60YMAS_M + metrics.P_60YMAS_F,
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
            color={ VIEW_COLORS_RGBA.VISOR.primary}
        >
            <CircularProgressLabel>
                { percent.toFixed(0) }
                %
            </CircularProgressLabel>
        </CircularProgress>
    )
}

const Visor = ({ metrics }: { metrics: any }) => {
    const globalData: GenericObject = {
        POBTOT: 1003530,
        GRAPROES: 11.06,
        VIVPAR_HAB: 270235,
        VIVPAR_DES: 46489.0,
        "P_0A2_F": 22745.0,
        "P_0A2_M": 23760.0,
        "P_3A5_F": 24415.0, "P_3A5_M": 25097.0,
        "P_6A11_F": 49274.0, "P_6A11_M": 51630.0,
        "P_12A14_F": 25139.0, "P_12A14_M": 25983.0,
        "P_15A17_F": 25163.0, "P_15A17_M": 25683.0,
        "P_18A24_F": 62928.0, "P_18A24_M": 61763.0,
        "P_25A59_F": 327737.0 , "P_25A59_M": 314356.0,
        "P_60YMAS_F": 60860.0, "P_60YMAS_M": 50853.0,
        VPH_TINACO: 128589,
        VPH_PC: 131189,
        VPH_AUTOM: 166497
    }
    const [pyramidData, setPyramidData] = useState<any[]>([]);

    useEffect(() => {
        setPyramidData(getPyramidData(metrics));
    }, [metrics]);


    return (
        <div className="visor tab__main">
            <Accordion allowToggle defaultIndex={[0]}>
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
                            <ComparativeMetric name="Población total" metric="POBTOT">
                                <Text>
                                    { metrics?.POBTOT?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                    hab
                                </Text>
                                <Text>
                                    { globalData?.POBTOT?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    })}
                                    hab
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric name="Pirámide poblacional" metric={undefined}>
                                <PopulationPyramid data={pyramidData} />
                                <PopulationPyramid data={ getPyramidData( globalData ) } />
                            </ComparativeMetric>
                            <ComparativeMetric name="Grado promedio de escolaridad" metric="GRAPROES">
                                <Text>
                                    { metrics?.GRAPROES?.toFixed(2) || "" }
                                </Text>
                                <Text>
                                    { globalData?.GRAPROES?.toFixed(2) || "" }
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric name="Viviendas particulares habitadas" metric="VIVPAR_HAB">
                                <Text>
                                    { metrics?.VIVPAR_HAB?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                </Text>
                                <Text>
                                    { globalData?.VIVPAR_HAB?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || "" }
                                </Text>
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
                            <ComparativeMetric name="Índice de bienestar" metric="wellness_index">
                                <GraphPercent value={ metrics?.wellness_index || 0 } base={ 100 } />
                                <GraphPercent value={ globalData?.wellness_index || 0 } base={ 100 } />
                            </ComparativeMetric>
                            <ComparativeMetric name="Viviendas con automóvil" metric="VPH_AUTOM">
                                <GraphPercent value={ metrics?.VPH_AUTOM || 0 } base={ metrics?.VIVPAR_HAB || 0 } />
                                <GraphPercent value={ globalData?.VPH_AUTOM || 0 } base={ globalData?.VIVPAR_HAB || 0 } />
                            </ComparativeMetric>
                            <ComparativeMetric name="Viviendas con PC" metric="VPH_PC">
                                <GraphPercent value={ metrics?.VPH_PC || 0 } base={ metrics?.VIVPAR_HAB || 0 } />
                                <GraphPercent value={ globalData?.VPH_PC || 0 } base={ globalData?.VIVPAR_HAB || 0 } />
                            </ComparativeMetric>
                            <ComparativeMetric name="Viviendas con tinaco" metric="VPH_TINACO">
                                <GraphPercent value={ metrics?.VPH_TINACO || 0 } base={ metrics?.VIVPAR_HAB || 0 } />
                                <GraphPercent value={ globalData?.VPH_TINACO || 0 } base={ globalData?.VIVPAR_HAB || 0 } />
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Visor;
