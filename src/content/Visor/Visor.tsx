import { useEffect, useState } from "react";
import { Accordion, Box, Text, VStack, Tooltip } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import "./Visor.scss";
import { RootState } from "../../app/store";
import PopulationPyramid from "../../components/PopulationPyramid";
import {
    formatNumber,
    mappingGradoEscolaridad,
    REGIONS,
    VIEW_MODES,
} from "../../constants";
import { IoWater, IoHappyOutline } from "react-icons/io5";
import { FaPerson, FaHouseUser, FaComputer } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { FaCar } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { AccordionContent, ComparativeTitles } from "../AccordionContent";
import { CustomGauge } from "../../components/CustomGauge";
import { ComparativeMetric } from "../../components/ComparativeMetric";
import { Caret, GraphPercent } from "../../components/GraphPercent";

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

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const globalData = useSelector(
        (state: RootState) => state.queryMetric.globalData
    );
    const [pyramidData, setPyramidData] = useState<any[]>([]);
    const [globalPyramidData, setGlobalPyramidData] = useState<any[]>([]);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const project = useSelector((state: RootState) => state.viewMode.project);
    const radius = useSelector((state: RootState) => state.lensSettings.radius);

    useEffect(() => {
        const pyramidData = getPyramidData(metrics).map((entry) => ({
            per_male: (entry.male / metrics.poblacion) * 100,
            per_female: (entry.female / metrics.poblacion) * 100,
            per_total: (entry.total / metrics.poblacion) * 100,
            ...entry,
        }));
        setPyramidData(pyramidData);
    }, [metrics]);

    useEffect(() => {
        const pyramidData = getPyramidData(globalData).map((entry) => ({
            per_male: (entry.male / globalData.poblacion) * 100,
            per_female: (entry.female / globalData.poblacion) * 100,
            per_total: (entry.total / globalData.poblacion) * 100,
            ...entry,
        }));
        setGlobalPyramidData(pyramidData);
    }, [globalData]);

    const names = {
        [VIEW_MODES.FULL]: REGIONS.find((x) => x.key === project)?.name,
        [VIEW_MODES.POLIGON]: "Colonias",
        [VIEW_MODES.LENS]: `Radio de ${radius}m`,
    };

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
                <AccordionContent
                    title="Perfil sociodemográfico"
                    description="Información sobre las características demográficas de la población, incluyendo edad, género, estado civil, tamaño del hogar, migración, y etnicidad, que permite analizar la composición y estructura de la población en un área específica."
                >
                    <ComparativeTitles
                        title={names[viewMode]}
                        titleCompare="Culiacán"
                    />
                    <VStack
                        spacing={0}
                        className="accordion-body"
                        style={{ padding: "0.4rem" }}
                    >
                        <ComparativeMetric metric="poblacion" icon={FaPerson}>
                            {metrics?.poblacion && (
                                <Box>
                                    {metrics.poblacion.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || ""}
                                    <Text fontSize="sm" textAlign={"center"}>
                                        habitantes
                                    </Text>
                                </Box>
                            )}
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
                                <Caret
                                    value={metrics?.grado_escuela}
                                    compareWith={globalData?.grado_escuela}
                                />
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
                            <CustomGauge
                                value={metrics?.viviendas_habitadas_percent}
                                globalValue={
                                    globalData?.viviendas_habitadas_percent
                                }
                                description={`
                                        Viviendas Habitadas: ${formatNumber(
                                            metrics?.viviendas_habitadas
                                        )}
                                    `}
                            />
                            <Tooltip
                                hasArrow
                                placement="right"
                                label={`
                                        Viviendas Habitadas: ${formatNumber(
                                            globalData?.viviendas_habitadas
                                        )}
                                    `}
                            >
                                <Box>
                                    <GraphPercent
                                        value={
                                            globalData?.viviendas_habitadas_percent ||
                                            0
                                        }
                                    />
                                </Box>
                            </Tooltip>
                        </ComparativeMetric>
                    </VStack>
                </AccordionContent>

                <AccordionContent
                    title="Perfil socioeconómico"
                    description="Datos sobre los niveles de ingresos, empleo, acceso a servicios básicos, vivienda, y nivel educativo, que permiten evaluar la calidad de vida y el bienestar económico de la población."
                >
                    <ComparativeTitles
                        title={names[viewMode]}
                        titleCompare="Culiacán"
                    />
                    <VStack
                        spacing={0}
                        className="accordion-body"
                        style={{ padding: "0.4rem" }}
                    >
                        <ComparativeMetric
                            metric="indice_bienestar"
                            icon={IoHappyOutline}
                        >
                            <CustomGauge
                                value={metrics?.indice_bienestar}
                                globalValue={globalData?.indice_bienestar}
                            />
                            <GraphPercent
                                value={globalData?.indice_bienestar}
                            />
                        </ComparativeMetric>

                        <ComparativeMetric metric="viviendas_auto" icon={FaCar}>
                            <CustomGauge
                                value={metrics?.viviendas_auto}
                                globalValue={globalData?.viviendas_auto}
                            />
                            <GraphPercent
                                value={globalData?.viviendas_auto || 0}
                            />
                        </ComparativeMetric>

                        <ComparativeMetric
                            metric="viviendas_pc"
                            icon={FaComputer}
                        >
                            <CustomGauge
                                value={metrics?.viviendas_pc}
                                globalValue={globalData?.viviendas_pc}
                            />
                            <GraphPercent
                                value={globalData?.viviendas_pc || 0}
                            />
                        </ComparativeMetric>

                        <ComparativeMetric
                            metric="viviendas_tinaco"
                            icon={IoWater}
                        >
                            <CustomGauge
                                value={metrics?.viviendas_tinaco}
                                globalValue={globalData?.viviendas_tinaco}
                            />
                            <GraphPercent
                                value={globalData?.viviendas_tinaco || 0}
                            />
                        </ComparativeMetric>
                    </VStack>
                </AccordionContent>
            </Accordion>
        </div>
    );
};

export default Visor;
