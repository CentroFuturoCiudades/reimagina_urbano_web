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
import { CustomGauge } from "../../components/CustomGauge";

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
                        title="Condición observada"
                        description="Descripción de cómo se emplea el suelo en un área determinada, dividiéndose en categorías como residencial, comercial, industrial, recreativo, agrícola, o de conservación, y evaluando su adecuación según las necesidades urbanas o las regulaciones vigentes."
                    />
                    <AccordionPanel p={0}>
                        <ComparativeTitles
                            title={names[viewMode]}
                            titleCompare="Culiacán"
                        />
                        <VStack spacing={"0"} className="accordion-body">
                            <ComparativeMetric
                                metric="area"
                                name="Área"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.area)} hec
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(globalData.area)} hec
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cos"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            metrics.cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            metrics.max_cos,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            metrics.cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            metrics.max_cus,
                                            undefined,
                                            2
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            metrics.num_levels,
                                            undefined,
                                            1
                                        )}{" "}
                                        pisos
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.max_num_levels)}{" "}
                                        pisos
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(
                                            globalData.max_num_levels
                                        )}{" "}
                                        pisos
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="density"
                                name="Densidad observada"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.density)} viv/hec
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(globalData.density)}{" "}
                                        viv/hec
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_density"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.max_density)}{" "}
                                        viv/hec
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(globalData.max_density)}{" "}
                                        viv/hec
                                    </Text>
                                </Box>
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="home_units"
                                icon={FaPeopleGroup}
                            >
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.home_units)} viv
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
                                        {formatNumber(metrics.max_home_units)}{" "}
                                        viv
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="min(2.4dvh, 1.2dvw)">
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
                                    <CustomGauge
                                        value={metrics.subutilizacion}
                                        globalValue={globalData.subutilizacion}
                                    />
                                </Box>
                                <Box>
                                    <CustomGauge
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
