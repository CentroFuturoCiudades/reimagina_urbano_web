import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    Text,
    VStack,
} from "@chakra-ui/react";

import "./Potencial.scss";
import { FaPeopleGroup } from "react-icons/fa6";
import { AccordionHeader } from "../AccordionContent";
import { ComparativeMetric } from "../../components/ComparativeMetric";
import { GraphPercent } from "../../components/GraphPercent";

const Potencial = () => {
    return (
        <div className="potencial tab__main">
            <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionHeader
                        title="Utilización del suelo"
                        description="Descripción de cómo se emplea el suelo en un área determinada, dividiéndose en categorías como residencial, comercial, industrial, recreativo, agrícola, o de conservación, y evaluando su adecuación según las necesidades urbanas o las regulaciones vigentes."
                    />
                    <AccordionPanel p={0}>
                        <VStack
                            spacing={"0"}
                            className="accordion-body"
                            style={{ padding: "0.4rem" }}
                        >
                            <ComparativeMetric
                                metric="density"
                                icon={FaPeopleGroup}
                            >
                                <Text>{Math.trunc(10)} viv/ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_height"
                                icon={FaPeopleGroup}
                            >
                                <Text>{Math.trunc(2)} pisos</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="potencial"
                                icon={FaPeopleGroup}
                            >
                                <Text>---</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="subutilizacion"
                                icon={FaPeopleGroup}
                            >
                                <GraphPercent value={50 / 100} />
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="subutilizacion_type"
                                icon={FaPeopleGroup}
                            >
                                <Text>{Math.trunc(0)} %</Text>
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Potencial;
