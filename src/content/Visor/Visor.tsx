import { useEffect, useState } from "react";
import {
    Accordion,
    Box,
    Text,
    VStack,
    PopoverContent,
    PopoverTrigger,
    Button,
    Popover,
    useBoolean,
    List,
    Checkbox,
    Spinner,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupAges, setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import "./Visor.scss";
import { RootState } from "../../app/store";
import { formatNumber, mappingGradoEscolaridad, REGIONS, VIEW_MODES } from "../../constants";
import { IoWater, IoHappyOutline } from "react-icons/io5";
import { FaPerson, FaHouseUser, FaComputer, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { FaCar } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { AccordionContent, ComparativeTitles } from "../AccordionContent";
import { CustomGauge } from "../../components/CustomGauge";
import { ComparativeMetric } from "../../components/ComparativeMetric";
import { Caret, GraphPercent } from "../../components/GraphPercent";
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

const getTextGroupAges = (selectedAges: string[]) => {
    if (selectedAges.length === 0) return "";

    const sortedAges = selectedAges
        .map((age: any) => (age.endsWith("+") ? [Number(age.replace("+", "")), Infinity] : age.split("-").map(Number)))
        .sort(([aStart]: any, [bStart]: any) => aStart - bStart);

    const mergedRanges = sortedAges.reduce((acc: any, [start, end]: any) => {
        const lastRange = acc[acc.length - 1];

        if (lastRange && start <= lastRange[1] + 1) {
            // Overlapping or consecutive range, merge them
            lastRange[1] = Math.max(lastRange[1], end);
        } else {
            // No overlap, add a new range
            acc.push([start, end]);
        }

        return acc;
    }, []);

    const formattedRanges = mergedRanges
        .map(([start, end]: any) => {
            if (end === Infinity) {
                return `${start}+`; // Handle "60+" case
            } else if (start === end) {
                return `${start}`; // Handle single age (e.g., "12-12" -> "12")
            } else {
                return `${start}-${end}`; // Handle normal ranges (e.g., "0-5")
            }
        })
        .join(", ");

    return `${formattedRanges} años`;
};

const Visor = ({ metrics }: { metrics: any }) => {
    const dispatch = useDispatch();
    const globalData = useSelector((state: RootState) => state.queryMetric.globalData);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const selectedGroupAges = useSelector((state: RootState) => state.queryMetric.groupAges);
    const project = useSelector((state: RootState) => state.viewMode.project);
    const radius = useSelector((state: RootState) => state.lensSettings.radius);
    const insights = useSelector((state: RootState) => state.queryMetric.insights);
    const agesData =
        metrics?.per_female_group_ages && globalData?.per_female_group_ages
            ? [
                  {
                      name: "Mujeres",
                      value: Math.round(metrics?.per_female_group_ages),
                      global: Math.round(globalData?.per_female_group_ages),
                  },
                  {
                      name: "Hombres",
                      value: Math.round(metrics?.per_male_group_ages),
                      global: Math.round(globalData?.per_male_group_ages),
                  },
              ]
            : undefined;

    const names = {
        [VIEW_MODES.FULL]: REGIONS.find((x) => x.key === project)?.name,
        [VIEW_MODES.POLIGON]: "Colonias",
        [VIEW_MODES.LENS]: `Radio de ${radius}m`,
    };

    return (
        <div className="visor tab__main">
            <Accordion
                allowToggle
                defaultIndex={[0]}
                onChange={(index) => {
                    if (index === 0) {
                        dispatch(setQueryMetric("poblacion"));
                    } else {
                        dispatch(setQueryMetric("indice_bienestar"));
                    }
                }}
            >
                <AccordionContent
                    title="Perfil sociodemográfico"
                    description="Información sobre las características demográficas de la población, incluyendo edad, género, estado civil, tamaño del hogar, migración, y etnicidad, que permite analizar la composición y estructura de la población en un área específica."
                >
                    <ComparativeTitles title={names[viewMode]} titleCompare="Culiacán" />
                    <VStack spacing={0} className="accordion-body">
                        {insights !== undefined ? (
                            <Box className="insights" fontSize="min(1.6dvh, 0.8dvw)">
                                {insights}
                            </Box>
                        ) : (
                            <div>
                                <Spinner
                                    thickness="6px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="gray.500"
                                    height="min(4vh, 2vw)"
                                    width="min(4vh, 2vw)"
                                />
                            </div>
                        )}
                        <ComparativeMetric metric="poblacion" icon={FaPerson}>
                            {metrics?.poblacion && (
                                <Box fontSize="min(2.8dvh, 1.4dvw)">
                                    {metrics.poblacion.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    }) || ""}
                                    <Text fontSize="min(2dvh, 1dvw)" textAlign="center">
                                        habitantes
                                    </Text>
                                </Box>
                            )}
                            {globalData?.poblacion && (
                                <Box fontSize="min(2.8dvh, 1.4dvw)">
                                    {globalData?.poblacion?.toLocaleString("es-MX", {
                                        maximumFractionDigits: 0,
                                    })}
                                    <Text fontSize="min(2dvh, 1dvw)" textAlign="center">
                                        habitantes
                                    </Text>
                                </Box>
                            )}
                        </ComparativeMetric>
                        <ComparativeMetric icon={ImManWoman} metric="per_group_ages">
                            <Box width="100%" p="0">
                                <SelectAgeGroup />
                                {selectedGroupAges && selectedGroupAges.length > 0 && (
                                    <PercentageBarChart data={agesData} />
                                )}
                            </Box>
                        </ComparativeMetric>

                        <ComparativeMetric metric="grado_escuela" icon={MdSchool}>
                            <Box display="flex" textAlign="center" style={{ margin: "auto" }}>
                                <Text justifyContent="center" fontSize="min(2.2dvh, 1.1dvw)">
                                    {mappingGradoEscolaridad[metrics?.grado_escuela?.toFixed(0)] || ""}
                                </Text>
                                <Caret value={metrics?.grado_escuela} compareWith={globalData?.grado_escuela} />
                            </Box>

                            <Text textAlign="center" fontSize="min(2.2dvh, 1.1dvw)">
                                {mappingGradoEscolaridad[globalData?.grado_escuela?.toFixed(0)] || ""}
                            </Text>
                        </ComparativeMetric>
                        <ComparativeMetric metric="viviendas_habitadas_percent" icon={FaHouseUser}>
                            <CustomGauge
                                value={metrics?.viviendas_habitadas_percent}
                                globalValue={globalData?.viviendas_habitadas_percent}
                                description={`
                                        Viviendas Habitadas: ${formatNumber(metrics?.viviendas_habitadas)}
                                    `}
                            />
                            <CustomGauge
                                value={globalData?.viviendas_habitadas_percent}
                                description={`
                                        Viviendas Habitadas: ${formatNumber(globalData?.viviendas_habitadas)}
                                    `}
                            />
                        </ComparativeMetric>
                    </VStack>
                </AccordionContent>

                <AccordionContent
                    title="Perfil socioeconómico"
                    description="Datos sobre los niveles de ingresos, empleo, acceso a servicios básicos, vivienda, y nivel educativo, que permiten evaluar la calidad de vida y el bienestar económico de la población."
                >
                    <ComparativeTitles title={names[viewMode]} titleCompare="Culiacán" />
                    <VStack spacing={0} className="accordion-body">
                        <ComparativeMetric metric="indice_bienestar" icon={IoHappyOutline}>
                            <CustomGauge
                                value={metrics?.indice_bienestar}
                                globalValue={globalData?.indice_bienestar}
                                percentage={false}
                            />
                            <CustomGauge value={globalData?.indice_bienestar} percentage={false} />
                        </ComparativeMetric>

                        <ComparativeMetric metric="viviendas_auto" icon={FaCar}>
                            <CustomGauge value={metrics?.viviendas_auto} globalValue={globalData?.viviendas_auto} />
                            <CustomGauge value={globalData?.viviendas_auto || 0} />
                        </ComparativeMetric>

                        <ComparativeMetric metric="viviendas_pc" icon={FaComputer}>
                            <CustomGauge value={metrics?.viviendas_pc} globalValue={globalData?.viviendas_pc} />
                            <CustomGauge value={globalData?.viviendas_pc || 0} />
                        </ComparativeMetric>

                        <ComparativeMetric metric="viviendas_tinaco" icon={IoWater}>
                            <CustomGauge value={metrics?.viviendas_tinaco} globalValue={globalData?.viviendas_tinaco} />
                            <CustomGauge value={globalData?.viviendas_tinaco || 0} />
                        </ComparativeMetric>
                    </VStack>
                </AccordionContent>
            </Accordion>
        </div>
    );
};

const SelectAgeGroup = () => {
    const dispatch = useDispatch();
    const [isFocused, setIsFocused] = useBoolean();
    const selectedGroupAges = useSelector((state: RootState) => state.queryMetric.groupAges);
    const groupAges = ["0-2", "3-5", "6-11", "12-14", "15-17", "18-24", "25-59", "60+"];
    const onSelectedGroupAges = (groupAge: string) => {
        dispatch(
            setGroupAges(
                selectedGroupAges.includes(groupAge)
                    ? selectedGroupAges.filter((age) => age !== groupAge)
                    : [...selectedGroupAges, groupAge]
            )
        );
    };
    return (
        <Popover
            placement="bottom"
            closeOnBlur={true}
            isOpen={isFocused}
            onOpen={setIsFocused.on}
            onClose={setIsFocused.off}
        >
            <PopoverTrigger>
                <Button
                    rightIcon={isFocused ? <FaChevronUp /> : <FaChevronDown />}
                    onClick={setIsFocused.toggle}
                    w="100%"
                    size="xs"
                    height="min(5dvh, 2.5dvw)"
                    fontSize="min(2dvh, 1dvw)"
                    borderRadius="min(0.8dvh, 0.4dvw)"
                    color="gray.700"
                    border="min(0.12dvh, 0.06dvw) solid #c3cff0"
                    justifyContent="space-between"
                    variant="outline"
                >
                    {getTextGroupAges(selectedGroupAges) || "Seleccionar edad"}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                style={{
                    overflow: "hidden",
                    border: "min(0.12dvh, 0.06dvw) solid #c3cff0",
                    height: "min(30dvh, 15dvw)",
                    width: "24dvw",
                    borderRadius: "min(0.8dvh, 0.4dvw)",
                }}
            >
                <List size="sm" p="min(1.2dvh, 0.6dvw)" spacing={1} style={{ overflowY: "scroll" }}>
                    {groupAges.map((groupAge, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                            style={{ marginBottom: "min(0.6dvh, 0.3dvw)" }}
                        >
                            <Checkbox
                                size="xs"
                                colorScheme="blue"
                                isChecked={selectedGroupAges.includes(groupAge)}
                                onChange={() => onSelectedGroupAges(groupAge)}
                                fontSize="min(2dvh, 1dvw)"
                            >
                                {groupAge} años
                            </Checkbox>
                        </Box>
                    ))}
                </List>
            </PopoverContent>
        </Popover>
    );
};

const PercentageBarChart = ({ data }: any) => {
    const multiplierHeight = 0.18;
    const multiplierWidth = 0.2;
    const [chartSize, setChartSize] = useState({
        width: Math.min(window.innerHeight, window.innerWidth / 2) * multiplierWidth,
        height: Math.min(window.innerHeight, window.innerWidth / 2) * multiplierHeight,
    });

    useEffect(() => {
        const updateSize = () => {
            setChartSize({
                width: Math.min(window.innerHeight, window.innerWidth / 2) * multiplierWidth,
                height: Math.min(window.innerHeight, window.innerWidth / 2) * multiplierHeight,
            });
        };

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    if (!data) return null;
    return (
        <ResponsiveContainer className={"pyramidContainer"} width={"100%"} height={chartSize.width}>
            <BarChart
                layout="vertical"
                data={data}
                margin={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                }}
                style={{ marginTop: "min(2dvh, 1dvw)" }}
                height={chartSize.width}
            >
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(tick) => Math.abs(tick.toFixed(0)).toString()}
                    ticks={Array.from({ length: 6 }, (_, i) => i * 20)}
                    tick={{ fontSize: "min(1.6dvh, 0.8dvw)" }}
                    textAnchor="end"
                />

                <YAxis
                    type="category"
                    dataKey="name"
                    orientation={"left"}
                    tick={{
                        fontSize: "min(1.6dvh, 0.8dvw)",
                        width: "min(1.6dvh, 0.8dvw)",
                    }}
                    width={chartSize.width * 0.5}
                />
                <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name="Local"
                    barSize={chartSize.width * 0.15}
                    spacing={chartSize.width * 0.05}
                >
                    <LabelList
                        dataKey="value"
                        position="right"
                        fill="#8884d8"
                        fontSize="min(1.6dvh, 0.8dvw)"
                        formatter={(value: any) => `${value}%`}
                    />
                </Bar>
                <Bar
                    dataKey="global"
                    fill="#474747"
                    name="Global"
                    background={{
                        fill: "#eee",
                    }}
                    barSize={chartSize.width * 0.15}
                    spacing={chartSize.width * 0.05}
                >
                    <LabelList
                        dataKey="global"
                        position="right"
                        fill="#474747"
                        fontSize="min(1.6dvh, 0.8dvw)"
                        width={chartSize.width * 2}
                        formatter={(value: any) => `${value}% (Culiacán)`}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Visor;
