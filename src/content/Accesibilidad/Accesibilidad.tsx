import React, { PureComponent, ReactElement, useEffect, useState } from "react";
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
    Tooltip,
} from "@chakra-ui/react";
import { TbAngle } from "react-icons/tb";
import { FaHospital, FaWalking } from "react-icons/fa";
import { FaChevronDown, FaChevronUp, FaIcons, FaLocationDot, FaSchool } from "react-icons/fa6";
import "./Accesibilidad.scss";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Treemap,
    XAxis,
    YAxis,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { mappingCategories } from "../../components/SelectAutoComplete/SelectAutoComplete";
import { center } from "@turf/turf";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { PiParkFill } from "react-icons/pi";
import { ComparativeMetric, GraphPercent } from "../Visor/Visor";
import { MdOutlineAccessTime } from "react-icons/md";



const Accesibilidad = ({ metrics }: any) => {

    const accessibilityPoints = useSelector( (state: RootState) => state.accessibilityList.accessibilityPoints );
    const [activeAmenity, setActiveAmenityState ] = useState<string>("");

    const dispatch = useDispatch();

    useEffect( ()=>{
        dispatch( setActiveAmenity( activeAmenity ) );
    }, [activeAmenity]);

    let graphBars: ReactElement[] = []
    let accessibilityData: any = { name: "" };
    let accessibilityTree: any = {};
    let accessibilityTreeArray: any[] = [];
    let accessibilityPointsCount = 0;

    class CustomizedContent extends PureComponent {
        render() {
            //@ts-ignore
          const { root, depth, x, y, width, height, index, payload, colors, rank, name, size } = this.props;

          let color = ACCESSIBILITY_POINTS_COLORS[ name ];

          return (
            <Tooltip
                label= { `${size} ${ name } ` }
                aria-label='A tooltip'
                placement="top" hasArrow={true}
                bg={"#34353c"}
                isOpen= { size && activeAmenity == name && activeAmenity != "" ? true : false }
            >
                <g>
                <rect
                    x={x}
                    y={y}
                    width={ depth === 2 ? width - 2 : width }
                    height={depth === 2 ? height - 2 : height}
                    style={{
                    fill: depth < 2 ? color : '#ffffff',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                    opacity: depth === 2 ? ( activeAmenity == name? "0": "0.3" ) : 1
                    }}
                    onMouseOver={ ()=>{
                        setActiveAmenityState( name )
                    }}
                />
                    {/* {depth === 1 ? (
                        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                            { mappingCategories[ name ] }
                        </text>
                    ) : null} */}
                    {
                        depth === 2 && width > 30 && height > 25 ? (
                            <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
                                {size}
                            </text>
                        ) : null
                    }
                </g>
            </Tooltip>
          );
        }
    }

    console.log( activeAmenity )

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

        if( !accessibilityTree[parentCategory] ){
            accessibilityTree[ parentCategory ] = {}
        }

        if( !accessibilityTree[parentCategory][ item.amenity ] ){
            accessibilityTree[parentCategory][ item.amenity ] = 0;
        }

        accessibilityTree[parentCategory][ item.amenity ] += 1;

        if( !accessibilityData[ parentCategory ] ){
            accessibilityData[ parentCategory ] = 0;


            let color = ACCESSIBILITY_POINTS_COLORS[ parentCategory ];

            graphBars.push(
                <Bar
                    dataKey={ parentCategory }
                    name={ mappingCategories[ parentCategory ] }
                    fill={ color || "gray" }
                >
                </Bar>
            )
        }

        accessibilityData[ parentCategory ] ++;

        accessibilityPointsCount++;
    })

    const sortedAmenities = Object.entries( accessibilityTree ).sort((a: any, b: any) => {

        const sumA: any = Object.values(a).reduce((acc: any, val) => acc + val, 0);
        const sumB: any = Object.values(b).reduce((acc: any, val) => acc + val, 0);
        return sumB - sumA;
    });

    accessibilityTree = Object.fromEntries(sortedAmenities);

    //Convert accesibility Tree Dictionary to Data Array
    for (const [key, value] of Object.entries( accessibilityTree )) {

        const childrenArray = []

        for (const [ amenity , count] of Object.entries( value as any )) {
            childrenArray.push( {
                name: amenity,
                size: count
            })
        }

        accessibilityTreeArray.push(
            {
                name: key,
                children: childrenArray
            }
        )
    }

    const renderLegend = ( _: any ) => {

        const items = Object.keys( accessibilityTree );

        console.log( accessibilityTree )

        const iconMap: any = {
            "education": <FaSchool></FaSchool>,
            "health": <FaHospital />,
            "park": <PiParkFill />,
            "recreation": <FaIcons />,
            "other": <FaLocationDot />
        };


        return (
          <ul>
            { items.map((entry: any, index: number) => (
              <li key={`item-${index}`}
                style={{ color: ACCESSIBILITY_POINTS_COLORS[ entry ] }}
              >
                {iconMap[entry]} { mappingCategories[ entry ] }
              </li>
            ))}
          </ul>
        );
      };

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
                        <VStack spacing={"0"} className="accordion-body" style={{ padding: "0.4rem" }}>
                            <SelectAutoComplete />
                            <ComparativeMetric metric="accessibility_score" icon={FaWalking}>
                                <GraphPercent
                                    value={metrics?.accessibility_score || 0}
                                    base={1}
                                />
                                {/* <Text>
                                    {Math.trunc(metrics.accessibility_score * 100)}
                                </Text> */}
                            </ComparativeMetric>
                            <ComparativeMetric metric="minutes" icon={MdOutlineAccessTime}>
                                <Text>
                                    {Math.trunc(metrics.minutes)} min
                                </Text>
                            </ComparativeMetric>

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
                                <Box
                                    className="stat-value full treemapContainer"
                                    style={{ flexDirection: "column", padding: "1rem" }}
                                >
                                {
                                    accessibilityTreeArray.length ?
                                    <>
                                        <ResponsiveContainer
                                            width={"100%"}
                                            height={ 200 }
                                        >
                                            <Treemap
                                                onMouseLeave={ ()=> {
                                                    setActiveAmenityState( "" );
                                                } }
                                                data={accessibilityTreeArray}
                                                dataKey={"size"}
                                                animationDuration={ 100 }
                                                content={ <CustomizedContent></CustomizedContent>}
                                            >
                                            </Treemap>
                                        </ResponsiveContainer>
                                        <Legend  content={ renderLegend } ></Legend>
                                    </>
                                    :   <div>No hay datos en el área</div>
                                 }
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
                                <Box className="stat-title-box regular">
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
                                <Box className="stat-title-box regular">
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
