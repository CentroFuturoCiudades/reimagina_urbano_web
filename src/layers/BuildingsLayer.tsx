import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { GenericObject } from '../types';
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";


type BuildingFeature = {
    type: string;
    properties: {
        buildingId: number;
        [key: string]: any;
    };
    geometry: {
        type: string;
        coordinates: any;
    };
};

interface BuildingsLayerProps {
    coordinates: any[];
    queryDataFloors: GenericObject;
    zoom: number;
}

const useBuildingsLayer = ({ coordinates, queryDataFloors, zoom }: BuildingsLayerProps) => {
    const [polygons, setPolygons] = useState<any>([]);
    const isZoomedIn = zoom >= 17;
    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (!isZoomedIn || !coordinates || coordinates.length === 0) return;
        const polygons = await fetchPolygonData(
            {
                coordinates,
                layer: "landuse_building",
            },
            signal
        );
        isMounted && setPolygons(polygons);
    }, [coordinates, queryDataFloors, isZoomedIn]);
    
    if (!isZoomedIn || !coordinates || coordinates.length === 0) return [];

    function getMaxHeight(buildingId: string): number {
        return queryDataFloors[buildingId]?.max_height*3 || 0;
    }

    function getFloors(buildingId: string): number {
        return queryDataFloors[buildingId]?.num_floors*3 || 0;
    }

    return [
        new GeoJsonLayer({
            id: "buildings-floors-layer",
            data: polygons,
            filled: true,
            getFillColor: [200, 200, 140, 200],
            getLineWidth: 0,
            pickable: true,
            extruded: true,
            getElevation: (d: unknown) => {
                const feature = d as BuildingFeature;
                return getFloors(feature.properties.ID);
            },
        }),
        new GeoJsonLayer({
            id: "buildings-max-height-layer",
            data: polygons,
            filled: true,
            getFillColor: [255, 255, 255, 50],
            getLineWidth: 0,
            pickable: true,
            extruded: true,
            wireframe: true,
            getElevation: (d: unknown) => {
                const feature = d as BuildingFeature;
                return getMaxHeight(feature.properties.ID);
            },
        }),
    ];
};

export default useBuildingsLayer;
