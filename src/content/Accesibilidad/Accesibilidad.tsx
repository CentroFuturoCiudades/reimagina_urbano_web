import React, { ReactElement, useState } from "react";
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
import { FaWalking } from "react-icons/fa";
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
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";

const Accesibilidad = ({ metrics }: any) => {

    const accessibilityPoints = useSelector( (state: RootState) => state.accessibilityList.accessibilityPoints );


    let graphBars: ReactElement[] = []
    let accessibilityData: any = { name: "" };
    let accessibilityPointsCount = 0;
    accessibilityPoints.forEach( ( item: any )=> {

        let category = "";

        amenitiesOptions.forEach( amenityOption => {
            if( item.amenity ==  amenityOption.label ){
                category = amenityOption.type
            }
        } )

        if( !accessibilityData[ category ] ){
            accessibilityData[ category ] = 0;


            let color = ACCESSIBILITY_POINTS_COLORS[ category ];

            graphBars.push(
                <Bar
                    dataKey={ category }
                    name={ mappingCategories[ category ] }
                    fill={ color || "gray" }
                >
                </Bar>
            )
        }

        accessibilityData[ category ] ++;

        accessibilityPointsCount++;
    })

    console.log( "TEST", accessibilityData )

    return (
        <div className="accesibilidad tab__main">
            <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem style={{ borderWidth: "0px" }}>
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
                                    <Text className="stat-title">Puntuaje de Accesibilidad</Text>
                                </Box>
                                <Box className="stat-value full">
                                    <Box>
                                        <Text>
                                            {" "}
                                            <Icon as={FaWalking}></Icon>{" "}
                                            {Math.trunc(metrics.accessibility_score * 100)}%
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="stat-row">
                                <Box className="stat-title-box">
                                    <Text className="stat-title">
                                        Servicios y equipamientos
                                    </Text>
                                </Box>
                                <Box
                                    className="stat-value full"
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
                                <Box className="stat-value full">
                                    <Box>
                                        <Text> { accessibilityPointsCount } </Text>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="stat-row">
                                <Box className="stat-title-box">
                                    <Text className="stat-title">
                                        Tipos de equipamientos
                                    </Text>
                                </Box>
                                <Box className="stat-value full">
                                    <ResponsiveContainer
                                        width={"90%"}
                                        height={ 200 }
                                    >
                                        <BarChart
                                            layout="vertical"
                                            data={[ accessibilityData ]}
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

                                            { graphBars }

                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Box>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem style={{ borderWidth: "0px" }}>
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
                                <Box className="stat-value full">
                                    <Box>
                                        <Text> 0.4 KM</Text>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="stat-row">
                                <Box className="stat-title-box">
                                    <Text className="stat-title">Pendiente</Text>
                                </Box>
                                <Box className="stat-value full">
                                    <Box>
                                        <Text>
                                            {" "}
                                            <Icon as={TbAngle}></Icon>{" "}
                                            {Math.trunc(metrics.mean_slope)}°
                                        </Text>
                                    </Box>
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
