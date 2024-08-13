import { useEffect, useState } from "react";
import { Icon, VStack, Box, Text, Stat, StatLabel, StatNumber, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import React from "react";
import { BiSolidHome } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaPerson, FaChevronUp, FaPersonBreastfeeding } from "react-icons/fa6";
import { FaBuilding, FaShoppingCart, FaStethoscope, FaHome} from "react-icons/fa";
import { MdOutlineWork, MdSchool } from "react-icons/md";
import { TbHomeCancel } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";
import './Visor.scss';
import { RootState } from "../app/store";
import { FaChevronDown } from "react-icons/fa6";
import PopulationPyramid from "../components/PopulationPyramid";
import LotSiderbar from "../components/LotSiderbar";
import { VIEW_COLORS_RGBA } from "../constants";

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);

    const queryMetric = useSelector((state: RootState) => state.queryMetric.queryMetric );

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
        setIsOpen2(false);
    };

    const toggleAccordion2 = () => {
        setIsOpen(false);
        setIsOpen2(!isOpen2);
    };


    const configureMetric = (metric: string) => {
        dispatch(setQueryMetric(metric));
    };

    const totalPopulation = metrics?.["POBTOT"];
    const totalViviendas = metrics?.["VIVTOT"];
    const viviendasDeshabitadas = metrics?.["VIVPAR_DES"];
    const densidad = totalViviendas - viviendasDeshabitadas !== 0
        ? totalPopulation / (totalViviendas - viviendasDeshabitadas)
        : 0;



    const[pyramidData, setPyramidData] = useState<any[]>([])

    useEffect (()=> {
        setPyramidData(metrics ? [
            { age: "0-2", male: metrics.P_0A2_M, female: metrics.P_0A2_F, total: metrics.P_0A2_M + metrics.P_0A2_F },
            { age: "3-5", male: metrics.P_3A5_M, female: metrics.P_3A5_F, total: metrics.P_3A5_M + metrics.P_3A5_F },
            { age: "6-11", male: metrics.P_6A11_M, female: metrics.P_6A11_F, total: metrics.P_6A11_M + metrics.P_6A11_F },
            { age: "12-14", male: metrics.P_12A14_M, female: metrics.P_12A14_F, total: metrics.P_12A14_M + metrics.P_12A14_F },
            { age: "15-17", male: metrics.P_15A17_M, female: metrics.P_15A17_F, total: metrics.P_15A17_M + metrics.P_15A17_F },
            { age: "18-24", male: metrics.P_18A24_M, female: metrics.P_18A24_F, total: metrics.P_18A24_M + metrics.P_18A24_F },
            { age: "25-59", male: metrics.P_25A59_M, female: metrics.P_25A59_F, total: metrics.P_25A59_M + metrics.P_25A59_F },
            { age: "60+", male: metrics.P_60YMAS_M, female: metrics.P_60YMAS_F, total: metrics.P_60YMAS_M + metrics.P_60YMAS_F },
        ] : [])
    },
    [metrics])

    const puntajeHogarDigno = metrics["puntuaje_hogar_digno"]?.toFixed(2);
    const pobPorCuarto = metrics["pob_por_cuarto"]?.toFixed(1);
    const graproes = metrics["GRAPROES"] ? Math.round(metrics["GRAPROES"]) : 0;
    const pafil_ipriv = metrics["PAFIL_IPRIV"] ? Math.round(metrics["PAFIL_IPRIV"]).toLocaleString("es-MX") : "0";

    return (
        <div className="visor tab__main">
            <div className="accordion-header" onClick={toggleAccordion}>
                Perfil sociodemográfico { isOpen? <Icon as={ FaChevronDown }></Icon>: <Icon as={ FaChevronUp }></Icon>}
            </div>
            {isOpen && (
                <VStack spacing={4} className="accordion-body">
                    <Box className="stat-row" onClick={() => { configureMetric("POBTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Población</Text>
                            {
                                queryMetric === "POBTOT" ?
                                <Icon className="visor__icon--active" as={FaEye} /> :
                                <Icon className="visor__icon" as={FaEyeSlash} />
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaPerson} />
                            <Text>{metrics?.["POBTOT"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>

                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Pirámide Poblacional</Text>
                        </Box>
                        <Box className="stat-value">
                            <PopulationPyramid data={pyramidData} />
                        </Box>
                    </Box>

                    <Box className="stat-row" onClick={() => { configureMetric("VIVTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Viviendas</Text>
                            {
                                queryMetric === "VIVTOT" ?
                                <Icon as={FaEye} /> :
                                <Icon as={FaEyeSlash} />
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={BiSolidHome} />
                            <Text>{metrics?.["VIVTOT"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("VIVPAR_DES") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Viviendas Deshabitadas</Text>
                            {
                                queryMetric === "VIVPAR_DES" ?
                                <Icon as={FaEye} /> :
                                <Icon as={FaEyeSlash} />
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={TbHomeCancel} />
                            <Text>{metrics?.["VIVPAR_DES"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("num_establishments") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Establecimientos</Text>
                            {
                                queryMetric === "num_establishments" ?
                                <Icon as={FaEye} /> :
                                <Icon as={FaEyeSlash} />
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaBuilding} />
                            <Text>{metrics?.["num_establishments"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("num_workers") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Trabajadores</Text>
                            {
                                queryMetric === "num_workers" ?
                                <Icon as={FaEye} /> :
                                <Icon as={FaEyeSlash} />
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={MdOutlineWork} />
                            <Text>{metrics?.["num_workers"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Densidad</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={MdOutlineWork} />
                            <Text>{densidad.toFixed(2)}</Text>
                        </Box>
                    </Box>

                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Grado Promedio Escolaridad</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={MdSchool} />
                            <Text>{graproes}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Acceso a Seguro Médico Privado</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaStethoscope} />
                            <Text>{pafil_ipriv}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Puntuaje de Bienestar</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaPersonBreastfeeding} />
                            <Text>{puntajeHogarDigno}%</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">Promedio de Población por Cuarto</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaHome} />
                            <Text>{pobPorCuarto} Personas</Text>
                        </Box>
                    </Box>
                </VStack>
            )}

            {/* TAB PERFILE SOCIO ECONOMICO */}
            <div className="accordion-header" onClick={toggleAccordion2}>
                Perfil sociodemográfico { isOpen2? <Icon as={ FaChevronDown }></Icon>: <Icon as={ FaChevronUp }></Icon>}
            </div>
            {isOpen2 && (
                <VStack spacing={4} className="accordion-body">

                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">% de viviendas con Tinaco</Text>
                        </Box>
                        <Box className="stat-value">
                            <CircularProgress
                                size="100px"
                                value={metrics["VPH_TINACO"]/metrics["VIVPAR_HAB"] * 100}
                                color={ VIEW_COLORS_RGBA.VISOR.primary }
                            >
                                <CircularProgressLabel>
                                    {(metrics["VPH_TINACO"]/metrics["VIVPAR_HAB"] * 100).toFixed(0)}%
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Box>
                    </Box>

                    <Box className="stat-row">
                        <Box className="stat-title-box">
                            <Text className="stat-title">% de viviendas con Computadora</Text>
                        </Box>
                        <Box className="stat-value">
                            <CircularProgress
                                size="100px"
                                value={ metrics["VPH_PC"]/metrics["VIVPAR_HAB"] * 100 }
                                color={ VIEW_COLORS_RGBA.VISOR.secondary }
                            >
                                <CircularProgressLabel>
                                    {(metrics["VPH_PC"]/metrics["VIVPAR_HAB"] * 100).toFixed(0)}%
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Box>
                    </Box>
                </VStack>
            )}
        </div>
    );
}

export default Visor;

















