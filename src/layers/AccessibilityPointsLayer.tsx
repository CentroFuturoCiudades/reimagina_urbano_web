import React from 'react';
import { IconLayer, TextLayer } from 'deck.gl';
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GenericObject } from '../types';
import { amenitiesOptions } from '../constants';
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
    const [polygons, setPolygons] = React.useState<any>([]);
    const condition = (metric !== "minutes" || !coordinates || coordinates.length === 0);
    const [hoverInfo, setHoverInfo] = React.useState<any>(null);
    const accessibilityList = useSelector((state: RootState) => state.accessibilityList.accessibilityList);

    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (condition) return;
        if (!coordinates || coordinates.length === 0) return;
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
        isMounted && setPolygons(data);
        dispatch(setAccessibilityPoints(parsedData));
    }, [coordinates, accessibilityList]);

    const iconHover = (x: number, y: number, object: any )=> {
        if (object) {
            console.log(object)
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
            getIcon: (d: any) => amenitiesOptions.find(option => option.label === d.properties.amenity)?.type || "other",
            getPosition: (d: any) => d.geometry.coordinates,
            getSize: 40,
            iconAtlas: 'images/amenities.png',
            iconMapping: {
                "recreation": {
                    x: 0,
                    y: 0,
                    width: 512,
                    height: 512,
                    mask: false,
                    anchorY: 512, // Align the center at the bottom
                },
                "education": {
                    x: 512,
                    y: 0,
                    width: 512,
                    height: 512,
                    mask: false,
                    anchorY: 512, // Align the center at the bottom
                },
                "other": {
                    x: 1024,
                    y: 0,
                    width: 512,
                    height: 512,
                    mask: false,
                    anchorY: 512, // Align the center at the bottom
                },
                "park": {
                    x: 1536,
                    y: 0,
                    width: 512,
                    height: 512,
                    mask: false,
                    anchorY: 512, // Align the center at the bottom
                },
                "health": {
                    x: 2048,
                    y: 0,
                    width: 512,
                    height: 512,
                    mask: false,
                    anchorY: 512, // Align the center at the bottom
                },
            },
            zIndex: 1000,
            pickable: true,
        }),
    ];
};

export default useAccessibilityPointsLayer;
