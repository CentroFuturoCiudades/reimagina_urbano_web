import React, { PureComponent, ReactElement, useEffect, useState } from "react";
import { AccessibilityPointsTreemap, SelectAutoComplete } from "../../components";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    VStack,
    Tooltip,
    Progress,
} from "@chakra-ui/react";
import { FaHospital, FaInfoCircle, FaWalking, FaBroadcastTower } from "react-icons/fa";
import { FaIcons, FaLocationDot, FaSchool, FaBuilding, FaLayerGroup, FaChartLine } from "react-icons/fa6";
import "./Accesibilidad.scss";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
} from "recharts";
import { Tooltip as RechartTooltip } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions, VIEW_MODES } from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { PiParkFill } from "react-icons/pi";
import { ComparativeMetric, GraphPercent } from "../Visor/Visor";
import { MdOutlineAccessTime } from "react-icons/md";

const Accesibilidad = ({ metrics }: any) => {

    const accessibilityPoints = useSelector( (state: RootState) => state.accessibilityList.accessibilityPoints );
    const viewMode = useSelector( (state: RootState) => state.viewMode.viewMode );
    const dispatch = useDispatch();

    let accessibilityPointsCount = accessibilityPoints.length;
    let categoryCount: any = {};
    let data = [];
    let totalPoints = 0;

    useEffect( ()=> {
        dispatch( setActiveAmenity( "" ) );
    }, [ viewMode ])

    accessibilityPoints.forEach( ( item: any )=> {
        //Get the parent category for the item
        let parentCategory: string = "";

        amenitiesOptions.forEach( amenityOption => {
            if( item.amenity ==  amenityOption.label ){
                parentCategory = amenityOption.type
            }
        } )

        if( !parentCategory ){
            parentCategory = "other";
        }

        if( !categoryCount[ parentCategory ] ){
            categoryCount[ parentCategory ] = 0;
        }

        categoryCount[parentCategory] ++;
        totalPoints++;
    })

    let elements: ReactElement[] = [];

    for( let [key, value] of Object.entries( mappingCategories )){

        let percent = categoryCount[key]/totalPoints * 100 || 0;
        data.push({
            name: key,
            value: categoryCount[key] || 0
        })

        elements.push(
            <div>
                <div style={{ display: "flex" }}>
                    <div>{value as String}</div>

                </div>
                <div
                    className="accesibilidad__equipment"
                    style={{ color: ACCESSIBILITY_POINTS_COLORS[ key ] }}
                >
                    <Progress className={"accesibilidad__bar " + key } value={ percent } />
                    <div >{ percent.toFixed(1) }%</div>
                </div>
            </div>
        );
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const iconMap: any = {
            "education": <FaSchool></FaSchool>,
            "health": <FaHospital />,
            "park": <PiParkFill />,
            "recreation": <FaIcons />,
            "other": <FaLocationDot />
        };

        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            { iconMap[data[index].name] }

          </text>
        );
    };

    return (
        <div className="accesibilidad tab__main">
            <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left" display="flex" alignItems="center">
                            Servicios de proximidad
                            <Tooltip label="Servicios urbanos esenciales, como escuelas, tiendas, hospitales y centros de transporte, ubicados en las cercanías de las áreas residenciales, facilitando el acceso rápido y eficiente para los habitantes." fontSize="md">
                                <span style={{ marginLeft: "5px", color: "white", cursor: "pointer" }}><FaInfoCircle /></span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                        <VStack spacing={"0"} className="accordion-body" style={{ padding: "0.4rem" }}>
                            <SelectAutoComplete />
                            <ComparativeMetric metric="minutes" icon={MdOutlineAccessTime}>
                                <Text>
                                    {Math.trunc(metrics.minutes)} min
                                </Text>
                            </ComparativeMetric>
                            <ComparativeMetric metric="accessibility_score" icon={FaWalking}>
                                <GraphPercent
                                    value={metrics?.accessibility_score || 0}
                                />
                            </ComparativeMetric>

                            <ComparativeMetric disabled={true} metric="Total de equipamientos dentro del área" icon={FaBuilding}>
                                <Text>{accessibilityPointsCount}</Text>
                            </ComparativeMetric>

                            <ComparativeMetric disabled={true} metric="Tipos de equipamientos" icon={FaLayerGroup}>
                                <Box className="treemapContainer" style={{ flexDirection: "column", padding: "1rem" }}>
                                    { viewMode == VIEW_MODES.FULL
                                        ? <AccessibilityPointsTreemap />
                                        :
                                        <div style={{display: "flex", width: "100%", height: "260px"}}>
                                            <ResponsiveContainer width={"55%"} height={"100%"}>
                                                <PieChart width={100} height={100}>
                                                    <Pie
                                                        //label={renderCustomizedLabel}
                                                        data={ data } dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={30} fill="#8884d8">
                                                        {data.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={ ACCESSIBILITY_POINTS_COLORS[ entry.name as string ] } />
                                                        ))}
                                                    </Pie>
                                                    {/* <RechartTooltip /> */}
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div style={{width: "45%"}}>
                                                {elements}
                                            </div>
                                        </div>
                                    }
                                </Box>
                            </ComparativeMetric>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem style={{ borderWidth: "0px" }}>
                    <AccordionButton className="accordion-header">
                        <Box flex="1" textAlign="left" display="flex" alignItems="center">
                            Radio de cobertura
                            <Tooltip label="Distancia o área en la que los servicios o equipamientos públicos, como centros de salud o parques, son accesibles para la población, generalmente medido en kilómetros o minutos de desplazamiento." fontSize="md">
                                <span style={{ marginLeft: "5px", color: "white", cursor: "pointer" }}><FaInfoCircle /></span>
                            </Tooltip>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel p={0}>
                        <VStack spacing={"0"} className="accordion-body">

                            <ComparativeMetric metric="Radio de cobertura" icon={FaBroadcastTower}>
                                <Text>0.4 KM</Text>
                            </ComparativeMetric>

                            <ComparativeMetric metric="Pendiente" icon={FaChartLine}>
                                <Text>{Math.trunc(metrics.mean_slope)}°</Text>
                            </ComparativeMetric>

                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Accesibilidad;
