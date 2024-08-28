import React, { useState } from "react";
import { SelectAutoComplete } from "../../components";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    VStack,
    Icon,
} from "@chakra-ui/react";
import { TbAngle } from "react-icons/tb";
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
    return (
        <div className="accesibilidad tab__main">
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left">
                            Servicios de proximidad
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
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
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left">
                            Radio de cobertura
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={"0"} className="accordion-body">
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
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Accesibilidad;
