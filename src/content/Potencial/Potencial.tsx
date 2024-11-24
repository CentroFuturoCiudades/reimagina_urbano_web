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
import { formatNumber } from "../../constants";

const Potencial = ({metrics}: {metrics: any}) => {
    return (
        <div className="potencial tab__main">
            <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionHeader
                        title="Condición actual"
                        description="Descripción de cómo se emplea el suelo en un área determinada, dividiéndose en categorías como residencial, comercial, industrial, recreativo, agrícola, o de conservación, y evaluando su adecuación según las necesidades urbanas o las regulaciones vigentes."
                    />
                    <AccordionPanel p={0}>
                        <VStack
                            spacing={"0"}
                            className="accordion-body"
                            style={{ padding: "0.4rem" }}
                        >
                            <ComparativeMetric
                                disabled={true}
                                metric="area"
                                name="Área"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.area)} ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cos"
                                name="COS actual"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.cos)} ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cos"
                                name="COS máximo permitido"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.max_cos)} ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cus"
                                name="CUS actual"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.cus)} ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cus"
                                name="CUS máximo permitido"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.max_cus)} ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="num_levels"
                                name="Número de niveles actuales"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.num_levels, undefined, 1)} pisos</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_num_levels"
                                name="Número de niveles máximos permitidos"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.max_num_levels)} pisos</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="density"
                                name="Densidad actual"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.density)} viv/ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_density"
                                name="Densidad máxima permitida"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.max_density)} viv/ha</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="home_units"
                                name="Viviendas actuales"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.home_units)} viviendas</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_home_units"
                                icon={FaPeopleGroup}
                            >
                                <Text>{formatNumber(metrics.max_home_units)} viviendas</Text>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="subutilizacion"
                                icon={FaPeopleGroup}
                            >
                                <GraphPercent value={metrics.subutilizacion} />
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
