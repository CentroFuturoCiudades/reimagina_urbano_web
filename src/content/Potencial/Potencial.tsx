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
                                {metrics.area && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(metrics.area)} hec
                                        </Text>
                                    </Box>
                                )}
                                {globalData.area && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(globalData.area)} hec
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cos"
                                icon={FaPeopleGroup}
                            >
                                {metrics.cos && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.cos,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                                {globalData.cos && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.cos,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cos"
                                icon={FaPeopleGroup}
                            >
                                {metrics.max_cos && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.max_cos,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                                {globalData.max_cos && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.max_cos,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="cus"
                                icon={FaPeopleGroup}
                            >
                                {metrics.cus && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.cus,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                                {globalData.cus && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.cus,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_cus"
                                icon={FaPeopleGroup}
                            >
                                {metrics.max_cus && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.max_cus,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                                {globalData.max_cus && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.max_cus,
                                                undefined,
                                                2
                                            )}
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="num_levels"
                                icon={FaPeopleGroup}
                            >
                                {metrics.num_levels && (
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
                                )}
                                {globalData.num_levels && (
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
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_num_levels"
                                icon={FaPeopleGroup}
                            >
                                {metrics.max_num_levels && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.max_num_levels,
                                                undefined,
                                                1
                                            )}{" "}
                                            pisos
                                        </Text>
                                    </Box>
                                )}
                                {globalData.max_num_levels && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.max_num_levels
                                            )}{" "}
                                            pisos
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="density"
                                name="Densidad observada"
                                icon={FaPeopleGroup}
                            >
                                {metrics.density && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(metrics.density)}{" "}
                                            viv/hec
                                        </Text>
                                    </Box>
                                )}
                                {globalData.density && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(globalData.density)}{" "}
                                            viv/hec
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_density"
                                icon={FaPeopleGroup}
                            >
                                {metrics.max_density && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(metrics.max_density)}{" "}
                                            viv/hec
                                        </Text>
                                    </Box>
                                )}
                                {globalData.max_density && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.max_density
                                            )}{" "}
                                            viv/hec
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="home_units"
                                icon={FaPeopleGroup}
                            >
                                {metrics.home_units && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(metrics.home_units)}{" "}
                                            viv
                                        </Text>
                                    </Box>
                                )}
                                {globalData.home_units && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.home_units
                                            )}{" "}
                                            viv
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="max_home_units"
                                icon={FaPeopleGroup}
                            >
                                {metrics.max_home_units && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                metrics.max_home_units
                                            )}{" "}
                                            viv
                                        </Text>
                                    </Box>
                                )}
                                {globalData.max_home_units && (
                                    <Box>
                                        <Text fontSize="min(2.4dvh, 1.2dvw)">
                                            {formatNumber(
                                                globalData.max_home_units
                                            )}{" "}
                                            viv
                                        </Text>
                                    </Box>
                                )}
                            </ComparativeMetric>

                            <ComparativeMetric
                                metric="subutilizacion"
                                icon={FaPeopleGroup}
                            >
                                {metrics.subutilizacion && (
                                    <Box>
                                        <CustomGauge
                                            value={metrics.subutilizacion}
                                            globalValue={
                                                globalData.subutilizacion
                                            }
                                        />
                                    </Box>
                                )}
                                {globalData.subutilizacion && (
                                    <Box>
                                        <CustomGauge
                                            value={globalData.subutilizacion}
                                        />
                                    </Box>
                                )}
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Potencial;
