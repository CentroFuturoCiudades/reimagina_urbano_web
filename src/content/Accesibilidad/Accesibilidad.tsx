import React, { useState } from "react";

import { SelectAutoComplete } from "../../components";
import { Box, Text, Icon, VStack } from "@chakra-ui/react";
import { TbAngle } from "react-icons/tb";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import "./Accesibilidad.scss";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

const Accesibilidad = ({ metrics }: any) => {
    // TODO: Use Chakra UI Accordion component
    const [isOpen, setIsOpen] = useState(true);
    const [isOpen2, setIsOpen2] = useState(true);

    const toggleAccordion = () => {
        setIsOpen2(false);
        setIsOpen(!isOpen);
    };

    const toggleAccordion2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen(false);
    };

    return (
        <div className="accesibilidad tab__main">
            <div className="accordion-header" onClick={toggleAccordion}>
                <Box flex="1" textAlign="left">
                    Servicios de proximidad{" "}
                    {isOpen ? (
                        <Icon as={FaChevronDown}></Icon>
                    ) : (
                        <Icon as={FaChevronUp}></Icon>
                    )}
                </Box>
            </div>
            <Box>
                {isOpen && (
                    <VStack spacing={"0"} className="accordion-body">
                        <Box className="stat-row">
                            <Box className="stat-title-box">
                                <Text className="stat-title">
                                    Servicios y equipamientos
                                </Text>
                            </Box>
                            <Box
                                className="stat-value"
                                style={{ width: "100%", padding: "0 1rem" }}
                            >
                                <SelectAutoComplete />
                            </Box>
                        </Box>

                        <Box className="stat-row">
                            <Box className="stat-title-box">
                                <Text className="stat-title">
                                    Total de equipamientos dentro del área
                                </Text>
                            </Box>
                            <Box className="stat-value">
                                <Text> 100 </Text>
                            </Box>
                        </Box>

                        <Box className="stat-row">
                            <Box className="stat-title-box">
                                <Text className="stat-title">
                                    Tipos de equipamientos
                                </Text>
                            </Box>
                            <Box className="stat-value">
                                <ResponsiveContainer
                                    width={"100%"}
                                    height={200}
                                >
                                    <BarChart
                                        layout="vertical"
                                        data={[
                                            {
                                                name: "",
                                                parkCount: 2,
                                                educationCount: 3,
                                            },
                                        ]}
                                        barSize={16}
                                        barGap={0}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <YAxis
                                            type="category"
                                            dataKey={"name"}
                                            name=""
                                        />
                                        <XAxis type="number" />
                                        <Legend />

                                        <Bar
                                            dataKey={"parkCount"}
                                            name={"Parques"}
                                            fill="var(--accesibilidad-parque)"
                                        ></Bar>
                                        <Bar
                                            dataKey={"educationCount"}
                                            name={"Educación"}
                                            fill="var(--accesibilidad-educacion)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    </VStack>
                )}
            </Box>

            {/* TAB RADIO DE PROXIMIDAD */}

            <div className="accordion-header" onClick={toggleAccordion2}>
                <Box flex="1" textAlign="left">
                    Radio de cobertura{" "}
                    {isOpen2 ? (
                        <Icon as={FaChevronDown}></Icon>
                    ) : (
                        <Icon as={FaChevronUp}></Icon>
                    )}
                </Box>
            </div>
            <Box>
                {isOpen2 && (
                    <VStack spacing={"0"}>
                        <Box className="stat-row">
                            <Box className="stat-title-box">
                                <Text className="stat-title">
                                    Radio de cobertura
                                </Text>
                            </Box>
                            <Box className="stat-value">
                                <Text> 0.4 KM</Text>
                            </Box>
                        </Box>

                        <Box className="stat-row">
                            <Box className="stat-title-box">
                                <Text className="stat-title">Pendiente</Text>
                            </Box>
                            <Box className="stat-value">
                                <Text>
                                    {" "}
                                    <Icon as={TbAngle}></Icon>{" "}
                                    {Math.trunc(metrics.mean_slope)}°
                                </Text>
                            </Box>
                        </Box>
                    </VStack>
                )}
            </Box>
        </div>
    );
};

export default Accesibilidad;
