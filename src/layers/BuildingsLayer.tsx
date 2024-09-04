import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { GenericObject } from '../types';
import { fetchPolygonData } from "../utils";
import { GeoJsonLayer } from "deck.gl";


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
    signal: any;
}

const BuildingsLayer = async ({ coordinates, queryDataFloors, signal }: BuildingsLayerProps) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    const buildingsData = await fetchPolygonData({ coordinates, layer: "landuse_building" }, signal);

    function getMaxHeight(buildingId: string): number {
        return queryDataFloors[buildingId]?.max_height*3 || 0;
    }

    function getFloors(buildingId: string): number {
        return queryDataFloors[buildingId]?.num_floors*3 || 0;
    }

    return [
        new GeoJsonLayer({
            id: "buildings-floors-layer",
            data: buildingsData,
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
            data: buildingsData,
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

export default BuildingsLayer;
