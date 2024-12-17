import { GenericObject } from '../types';
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useState } from "react";
import { VIEW_MODES, ZOOM_SHOW_DETAILS } from "../constants";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";


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
    queryDataFloors: GenericObject;
}

const useBuildingsLayer = ({ queryDataFloors }: BuildingsLayerProps) => {
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const queryMetric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    const [polygons, setPolygons] = useState<any>([]);
    const [polygons2, setPolygons2] = useState<any>([]);
    const isZoomedIn = viewState.zoom >= ZOOM_SHOW_DETAILS;
    const condition = isZoomedIn && coordinates && coordinates.length !== 0 && viewMode === VIEW_MODES.LENS;
    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (!condition) return;
        const polygons = await fetchPolygonData(
            {
                coordinates,
                layer: "landuse_building",
            },
            signal
        );

        const polygons2 = await fetchPolygonData(
            {
                coordinates,
                layer: "ideal_buildings",
            },
            signal
        );

        isMounted && setPolygons(polygons);
        isMounted && setPolygons2(polygons2);
    }, [coordinates, queryDataFloors, isZoomedIn]);
    
    if (!condition) return [];

    function getFloors(buildingId: string): number {
        return (queryDataFloors[buildingId]?.num_levels || 1) * 3.5;
    }

    const idealBuildings = [
        new GeoJsonLayer({
            id: "buildings-max-height-layer",
            data: polygons2,
            filled: true,
            // getFillColor: [255, 255, 255, 100],
            getFillColor: [200, 200, 140],
            getLineWidth: 0,
            pickable: true,
            extruded: true,
            wireframe: true,
            opacity: 0.3,
            getElevation: (d: unknown) => {
                const feature = d as BuildingFeature;
                return (feature.properties.max_num_levels || 1) * 3.5;
            },
        })
    ]
    const actualBuildings = [
        new GeoJsonLayer({
            id: "buildings-floors-layer",
            data: polygons,
            filled: true,
            getFillColor: [200, 200, 140],
            getLineWidth: 0,
            pickable: true,
            extruded: true,
            opacity: 0.6,
            getElevation: (d: unknown) => {
                const feature = d as BuildingFeature;
                return getFloors(feature.properties.lot_id);
            },
        }),
    ]

    return [
        ...(queryMetric === "max_num_levels" ? idealBuildings : actualBuildings)
    ];
};

export default useBuildingsLayer;
