import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Text, VStack, Tooltip } from "@chakra-ui/react";
import React from "react";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { useDispatch } from "react-redux";
import { ComparativeMetric, GraphPercent } from "../Visor/Visor";
import { METRIC_DESCRIPTIONS } from "../../constants";
import { FaInfoCircle } from "react-icons/fa";

import "./Potencial.scss"
import { FaPeopleGroup } from "react-icons/fa6";

const Potencial = ( { metrics } : { metrics: any } ) => {

    const dispatch = useDispatch();

    return (
        <div className="potencial tab__main">
            <Accordion allowToggle defaultIndex={[0]} onChange={(index) => {
                if (index === 0) {
                    //dispatch(setQueryMetric(""));
                } else {
                    //dispatch(setQueryMetric(""));
                }
            }
            }>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left" display="flex" alignItems="center">
                            Utilización del suelo
                            <Tooltip label="Descripción de cómo se emplea el suelo en un área determinada, dividiéndose en categorías como residencial, comercial, industrial, recreativo, agrícola, o de conservación, y evaluando su adecuación según las necesidades urbanas o las regulaciones vigentes." fontSize="md">
                                <span style={{ marginLeft: "5px", color: "white", cursor: "pointer"}}>
                                    <FaInfoCircle />
                                </span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel p={0}>
                        <VStack spacing={"0"} className="accordion-body" style={{ padding: "0.4rem" }}>
                            <ComparativeMetric metric="density" icon={ FaPeopleGroup }>
                                <Text>
                                    {Math.trunc( 10 )} viv/ha
                                </Text>
                            </ComparativeMetric>

                            <ComparativeMetric metric="max_height" icon={ FaPeopleGroup }>
                                <Text>
                                    {Math.trunc( 2 )} pisos
                                </Text>
                            </ComparativeMetric>

                            <ComparativeMetric metric="potencial" icon={ FaPeopleGroup }>
                                <Text>
                                    ---
                                </Text>
                            </ComparativeMetric>

                            <ComparativeMetric metric="subutilizacion" icon={ FaPeopleGroup }>
                                <GraphPercent
                                    value={ 50 }
                                    base={ 100 }
                                />
                            </ComparativeMetric>

                            <ComparativeMetric metric="subutilizacion_type" icon={ FaPeopleGroup }>
                                <Text>
                                    {Math.trunc( 0 )} %
                                </Text>
                            </ComparativeMetric>
                            
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

            </Accordion>
        </div>
    )
}

export default Potencial;
