import { useState } from "react";
import { Icon, VStack, Box, Text } from "@chakra-ui/react";
import React from "react";
import { FaPerson } from "react-icons/fa6";

import { useDispatch } from "react-redux";
import { setQueryMetric } from "../features/queryMetric/queryMetricSlice";
import './Potencial.scss';

const Visor = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const configureMetric = (metric: string) => {
        dispatch(setQueryMetric(metric));
    };

    
    

    return (
        <div className="accordion-container3">
            <div className="accordion-header3" onClick={toggleAccordion}>
                <Box flex="1" textAlign="left">
                    Utilización del suelo
                </Box>
            </div>
            {isOpen && (
                <VStack spacing={4} className="visor-container3">
                    <Box className="stat-row" onClick={() => { configureMetric("POBTOT") }}>
                        <Box className="stat-title-box">
                            <Text className="stat-title">Aquí van los encabezados</Text>
                        </Box>
                        <Box className="stat-value">

                            <Text className="stat-title">Aquí van los contenidos</Text>
                            {/*<Icon as={FaPerson} />*/}
                        </Box>
                    </Box>
                </VStack>
            )}
        </div>
    );
}

export default Visor;
