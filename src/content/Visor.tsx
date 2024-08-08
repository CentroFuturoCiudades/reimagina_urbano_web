import { useState } from "react";
import { Icon, VStack, Box, Text } from "@chakra-ui/react";
import React from "react";
import { BiSolidHome } from "react-icons/bi";
import { FaBuilding, FaChevronUp, FaEye, FaEyeSlash, FaPerson } from "react-icons/fa6";
import { MdOutlineWork } from "react-icons/md";
import { TbHomeCancel } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";
import './Visor.scss';
import { RootState } from "../app/store";
import { FaChevronDown } from "react-icons/fa6";

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);

    const queryMetric = useSelector((state: RootState) => state.queryMetric.queryMetric );

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
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

    return (
        <div className="accordion-container">
            <div className="accordion-header" onClick={toggleAccordion}>
                Perfil sociodemográfico { isOpen? <Icon as={ FaChevronDown }></Icon>: <Icon as={ FaChevronUp }></Icon>}
            </div>
            {isOpen && (
                <VStack spacing={4} className="visor-container">
                    <Box className="stat-row" onClick={() => { configureMetric("POBTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Población</Text>
                            {
                                queryMetric == "POBTOT"?
                                <Icon className="visor__icon--active" as={FaEye}> </Icon> :
                                <Icon className="visor__icon" as={FaEyeSlash}> </Icon>
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaPerson} />
                            <Text>{metrics?.["POBTOT"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("VIVTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Viviendas</Text>
                            {
                                queryMetric == "VIVTOT"?
                                <Icon as={FaEye}> </Icon> :
                                <Icon as={FaEyeSlash}> </Icon>
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
                                queryMetric == "VIVPAR_DES"?
                                <Icon as={FaEye}> </Icon> :
                                <Icon as={FaEyeSlash}> </Icon>
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
                                queryMetric == "num_establishments"?
                                <Icon className="visor__icon" as={FaEye}> </Icon> :
                                <Icon as={FaEyeSlash}> </Icon>
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
                                queryMetric == "num_workers"?
                                <Icon className="active" as={FaEye}> </Icon> :
                                <Icon as={FaEyeSlash}> </Icon>
                            }
                        </Box>
                        <Box className="stat-value">
                            <Icon as={MdOutlineWork} />
                            <Text>{metrics?.["num_workers"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("density") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Densidad</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={MdOutlineWork} />
                            <Text>{densidad.toFixed(2)}</Text>
                        </Box>
                    </Box>
                </VStack>
            )}
        </div>
    );
}

export default Visor;
