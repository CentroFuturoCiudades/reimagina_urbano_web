import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    Box,
    Text,
    VStack,
} from "@chakra-ui/react";

import "./Potencial.scss";
import { FaPeopleGroup } from "react-icons/fa6";
import { AccordionHeader, ComparativeTitles } from "../AccordionContent";
import { ComparativeMetric } from "../../components/ComparativeMetric";
import { GraphPercent } from "../../components/GraphPercent";
import { formatNumber, REGIONS, VIEW_MODES } from "../../constants";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const Potencial = ({ metrics }: { metrics: any }) => {
    const project = useSelector((state: RootState) => state.viewMode.project);
    const radius = useSelector((state: RootState) => state.lensSettings.radius);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const globalData = useSelector(
        (state: RootState) => state.queryMetric.globalData
    );
    const names = {
        [VIEW_MODES.FULL]: REGIONS.find((x) => x.key === project)?.name,
        [VIEW_MODES.POLIGON]: "Colonias",
        [VIEW_MODES.LENS]: `Radio de ${radius}m`,
    };
    return (
        <div className="potencial tab__main">
            <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionHeader
                        title="Condición actual"
                        description="Descripción de cómo se emplea el suelo en un área determinada, dividiéndose en categorías como residencial, comercial, industrial, recreativo, agrícola, o de conservación, y evaluando su adecuación según las necesidades urbanas o las regulaciones vigentes."
                    />
                    <AccordionPanel p={0}>
                        <ComparativeTitles
                            title={names[viewMode]}
                            titleCompare="Culiacán"
                        />
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
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.area)} ha
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(globalData.area)} ha
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cos"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            metrics.cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cos"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            metrics.max_cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.max_cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cus"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            metrics.cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cus"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            metrics.max_cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.max_cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="num_levels"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            metrics.num_levels,
                                            undefined,
                                            1
                                        )}{" "}
                                        pisos
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.num_levels,
                                            undefined,
                                            1
                                        )}{" "}
                                        pisos
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_num_levels"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.max_num_levels)}{" "}
                                        pisos
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.max_num_levels
                                        )}{" "}
                                        pisos
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="density"
                                name="Densidad actual"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.density)} viv/ha
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(globalData.density)}{" "}
                                        viv/ha
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_density"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.max_density)}{" "}
                                        viv/ha
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(globalData.max_density)}{" "}
                                        viv/ha
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="home_units"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.home_units)} viv
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(globalData.home_units)}{" "}
                                        viv
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_home_units"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text>
                                        {formatNumber(metrics.max_home_units)}{" "}
                                        viv
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        {formatNumber(
                                            globalData.max_home_units
                                        )}{" "}
                                        viv
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="subutilizacion"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <GraphPercent
                                        value={metrics.subutilizacion}
                                    />
                                </Box>
                                <Box>
                                    <GraphPercent
                                        value={globalData.subutilizacion}
                                    />
                                </Box>
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Potencial;
