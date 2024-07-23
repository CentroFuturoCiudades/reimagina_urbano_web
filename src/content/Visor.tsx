import { useState } from "react";
import { Icon, VStack, Box, Text } from "@chakra-ui/react";
import React from "react";
import { BiSolidHome } from "react-icons/bi";
import { FaBuilding, FaPerson } from "react-icons/fa6";
import { MdOutlineWork } from "react-icons/md";
import { TbHomeCancel } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";
import './Visor.scss';

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);

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
                <Box flex="1" textAlign="left">
                    Perfil poblacional
                </Box>
            </div>
            {isOpen && (
                <VStack spacing={4} className="visor-container">
                    <Box className="stat-row" onClick={() => { configureMetric("POBTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Población</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaPerson} />
                            <Text>{metrics?.["POBTOT"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("VIVTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Viviendas</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={BiSolidHome} />
                            <Text>{metrics?.["VIVTOT"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("VIVPAR_DES") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Viviendas Deshabitadas</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={TbHomeCancel} />
                            <Text>{metrics?.["VIVPAR_DES"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("num_establishments") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Establecimientos</Text>
                        </Box>
                        <Box className="stat-value">
                            <Icon as={FaBuilding} />
                            <Text>{metrics?.["num_establishments"]?.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</Text>
                        </Box>
                    </Box>
                    <Box className="stat-row" onClick={() => { configureMetric("num_workers") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Número de Trabajadores</Text>
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
