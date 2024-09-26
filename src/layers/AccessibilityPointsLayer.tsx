import React from 'react';
import { IconLayer, TextLayer } from 'deck.gl';
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GenericObject } from '../types';
import { amenitiesOptions, VIEW_MODES } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessibilityList, setAccessibilityPoints } from '../features/accessibilityList/accessibilityListSlice';
import { RootState } from '../app/store';
import _ from 'lodash';
import { Tooltip } from '../components';

interface AccessibilityPointsProps {
    metric: string;
    coordinates: any[];
}

const useAccessibilityPointsLayer = ({ metric , coordinates }: AccessibilityPointsProps) => {
    const dispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    const [polygons, setPolygons] = React.useState<any>([]);
    const condition = (metric !== "minutes" || ( (!coordinates || coordinates.length === 0) && viewMode != VIEW_MODES.FULL ));
    const [hoverInfo, setHoverInfo] = React.useState<any>(null);
    const accessibilityList = useSelector((state: RootState) => state.accessibilityList.accessibilityList);
    const activeAmenity = useSelector((state: RootState) => state.viewMode.activeAmenity );

    console.log( activeAmenity );

    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (condition) return;
        const polygons = await fetchPolygonData({ coordinates, layer: "accessibility_points" }, signal);
        const polygonsData = polygons?.features || [];
        const accessibilityListValues = accessibilityList.map( item => {
            return item.value;
        })
        const data = polygonsData.filter( (item: any) => {
            if( accessibilityList.length ){
                const key = amenitiesOptions.find(option => option.label === item.properties.amenity)?.value || "health";
                return accessibilityListValues.includes( key );
            } else {
                return true;
            }
        });
        const parsedData = data.map( (item: any) => {
            return item.properties;
        });
        ( isMounted && viewMode != VIEW_MODES.FULL ) && setPolygons(data);
        dispatch(setAccessibilityPoints(parsedData));
    }, [coordinates, accessibilityList, metric]);

    const iconHover = (x: number, y: number, object: any )=> {
        if (object) {
            setHoverInfo({
                object,
                x,
                y,
            });
        } else {
            setHoverInfo(null);
        }
    }

    if (condition) return [];

    return [
        new IconLayer({
            id: 'icon-layer',
            data: polygons,
            getIcon: (d: any) => {

                console.log( d.properties.amenity )
                let iconName = amenitiesOptions.find(option => option.label === d.properties.amenity)?.type || "other";

                if ( activeAmenity != "" && d.properties.amenity != activeAmenity ){
                    iconName += "-transparent"
                }

                return  iconName
            },
            getPosition: (d: any) => d.geometry.coordinates,
            getSize: 40,
            iconAtlas: 'images/amenities.png',
            iconMapping: {
                "recreation": {
                    x: 0,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "recreation-transparent": {
                    x: 2100,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "education": {
                    x: 460,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "education-transparent": {
                    x: 2500,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "other": {
                    x: 860,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "other-transparent": {
                    x: 2900,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "park": {
                    x: 3330,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "park-transparent": {
                    x: 1648,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "health": {
                    x: 1680,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
                "health-transparent": {
                    x: 3730,
                    y: 0,
                    width: 412,
                    height: 412,
                    mask: false,
                    anchorY: 412, // Align the center at the bottom
                },
            },
            zIndex: 1000,
            pickable: true,
        }),
    ];
};

export default useAccessibilityPointsLayer;
