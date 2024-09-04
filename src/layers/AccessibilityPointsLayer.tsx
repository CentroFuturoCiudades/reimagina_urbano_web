import React from 'react';
import { IconLayer } from 'deck.gl';
import { fetchPolygonData } from "../utils";
import { amenitiesOptions } from '../components/SelectAutoComplete/SelectAutoComplete';

interface AccessibilityPointsProps {
    coordinates: any[];
    layer: string;
    onHover: (x: number, y: number, object: any )=>void;
}

const AccessibilityPoints = async ({ coordinates, layer, onHover }: AccessibilityPointsProps) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }
    const accessibilityPointsData = await fetchPolygonData({ coordinates, layer });

    return [
        new IconLayer({
            id: 'icon-layer',
            data: accessibilityPointsData.features,
            getIcon: (d: any) => amenitiesOptions.find(option => option.label === d.properties.amenity)?.type || "health",
            getPosition: (d: any) => d.geometry.coordinates,
            getSize: 40,
            iconAtlas: 'images/amenities.png',
            iconMapping: {
                "health": {
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
                "recreation": {
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
            },
            zIndex: 1000,
            pickable: true,
            onHover: ({ x, y, object }) => {
                onHover(x, y, object);
            },
        })
    ];
};

export default AccessibilityPoints;
