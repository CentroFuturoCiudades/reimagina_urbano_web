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

    const dispatch = useDispatch();

    const configureMetric = (metric: string) => {
        dispatch(setQueryMetric(metric));
    };

    const totalPopulation = metrics?.POBTOT;
    const totalViviendas = metrics?.VIVTOT;
    const viviendasDeshabitadas = metrics?.VIVPAR_DES;
    const densidad =
        totalViviendas - viviendasDeshabitadas !== 0
            ? totalPopulation / (totalViviendas - viviendasDeshabitadas)
            : 0;

    const [pyramidData, setPyramidData] = useState<any[]>([]);

    useEffect(() => {
        setPyramidData(getPyramidData(metrics));
    }, [metrics]);

    const puntajeHogarDigno = metrics["puntuaje_hogar_digno"]?.toFixed(2);
    const pobPorCuarto = metrics["pob_por_cuarto"]?.toFixed(1);
    const graproes = metrics["GRAPROES"] ? Math.round(metrics["GRAPROES"]) : 0;
    const pafil_ipriv = metrics["PAFIL_IPRIV"]
        ? Math.round(metrics["PAFIL_IPRIV"]).toLocaleString("es-MX")
        : "0";


    const demographicMetrics = [
        {
            name: "POBTOT",
            type: "number",
            sufix: "hab",
        },
        {
            name: "PYRAMID",
            type: "pyramid",
        },
        {
            name: "GRAPROES",
            type: "number",
        },
        {
            name: "VIVPAR_HAB",
            type: "number",
        },
        {
            name: "VIVPAR_DES",
            type: "number",
        },

    ]

    const economicMetrics = [
        {
            name: "wellness_index",
            type: "number",
        },
        {
            name: "VPH_AUTOM",
            type: "percentGraph",
            base: "VIVPAR_HAB",
        },
        {
            name: "VPH_TINACO",
            type: "percentGraph",
            base: "VIVPAR_HAB",
        },
        {
            name: "VPH_PC",
            type: "percentGraph",
            base: "VIVPAR_HAB",
        }
    ]

    const percentGraph = ( value: number, base: number ) => {

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
                    { percent .toFixed(0) }
                    %
                </CircularProgressLabel>
            </CircularProgress>
        )
    }

    const renderMetrics = ( metricsToShow: GenericObject ) => {

        const elements: ReactElement[] = []

        if( metrics && Object.keys( metrics ) ){
            metricsToShow.forEach( (metric: any)=> {

                var value: ReactElement = <></>;
                var globalValue: ReactElement = <></>;

                switch( metric.type ){
                    case "number":
                        value =
                            <Text>
                                {metrics?.[ metric.name ]?.toLocaleString("es-MX", {
                                    maximumFractionDigits: 0,
                                })}
                                { metric.sufix || "0" }
                            </Text>

                        globalValue =
                            <Text>
                                { globalData?.[ metric.name ]?.toLocaleString("es-MX", {
                                    maximumFractionDigits: 0,
                                })}
                                { metric.sufix || "0" }
                            </Text>
                        break;
                    case "percentage":
                        value =
                            <Text>
                                { metrics?.[ metric.name ] + "%" }
                            </Text>
                        break;
                    case "pyramid":
                        value =
                            <PopulationPyramid data={pyramidData} />

                        globalValue=
                            <PopulationPyramid data={ getPyramidData( globalData ) } />
                    break;
                    case "percentGraph":
                        value = percentGraph( metrics[ metric.name ], metrics[ metric.base ] )
                        globalValue = percentGraph( globalData[ metric.name ], globalData[ metric.base ] )
                    break;

                }

                elements.push(
                    <Box
                        className="stat-row"
                        onClick={() => {
                            configureMetric( metric.name );
                        }}
                    >
                        <Box className="stat-title-box">
                            <Box className="stat-title-box-cell" >
                                <Text className="stat-title"> { COLUMN_MAPPING[ metric.name ] } </Text>
                            </Box>
                            <Box className="stat-title-box-cell dark" />
                        </Box>
                        <Box className="stat-value">
                            <Box>
                                { value }
                            </Box>
                            <Box className="dark">
                                { globalValue }
                            </Box>
                        </Box>
                    </Box>
                )
            })
        }

        return elements;
    }


    return (
        <div className="visor tab__main">
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left">
                            Perfil sociodemográfico
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={0} className="accordion-body">
                            <Box className="stat-row" style={{ margin: 0}}>
                                <Box className="stat-title-box" style={{ margin: 0}}>
                                    <Text className="stat-title" width={"50%"}>Zona Sur</Text>
                                    <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                                </Box>
                            </Box>
                            { renderMetrics( demographicMetrics ) }
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left">
                            Perfil socioeconómico
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={0} className="accordion-body">
                            <Box className="stat-row" style={{ margin: 0}}>
                                <Box className="stat-title-box" style={{ margin: 0}}>
                                    <Text className="stat-title" width={"50%"}>Zona Sur</Text>
                                    <Text className="stat-title dark" width={"50%"}>Culiacán</Text>
                                </Box>
                            </Box>
                            { renderMetrics(economicMetrics) }
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Visor;
