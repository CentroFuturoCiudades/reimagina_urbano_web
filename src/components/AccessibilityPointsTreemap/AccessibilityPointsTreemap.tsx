import React, { PureComponent, ReactElement, useEffect, useState } from "react";
import { ACCESSIBILITY_POINTS_COLORS, amenitiesOptions } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@chakra-ui/react";
import { setActiveAmenity } from "../../features/viewMode/viewModeSlice";
import { Bar, Legend, ResponsiveContainer, Treemap } from "recharts";
import { mappingCategories } from "../SelectAutoComplete/SelectAutoComplete";
import { FaHospital, FaIcons, FaLocationDot, FaSchool } from "react-icons/fa6";
import { PiParkFill } from "react-icons/pi";
import { RootState } from "../../app/store";

const AccessibilityPointsTreemap = ()=> {

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

    if( !accessibilityTreeArray.length ){
        <div>No hay datos en el área</div>
    }

    return (
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
            <Legend content={ renderLegend } ></Legend>
        </>
    )

}

export default AccessibilityPointsTreemap;
