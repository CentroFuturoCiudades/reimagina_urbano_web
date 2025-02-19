import { useSelector } from "react-redux";
import { GenericObject } from "../types";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useState } from "react";
import { RootState } from "../app/store";
import { amenitiesOptions, TABS } from "../constants";

const METRIC_COLOR: GenericObject = {
    health: [149, 136, 196, 255],
    park: [174, 202, 186, 255],
    recreation: [249, 212, 131, 255],
    education: [204, 153, 153, 255],
    other: [151, 151, 151, 255],
};

const useAmenitiesLayer = () => {
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const activeTab = useSelector(
        (state: RootState) => state.viewMode.activeTab
    );
    const accessibilityList = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const [polygons, setPolygons] = useState<any>([]);
    const condition =
        activeTab === TABS.ACCESIBILIDAD &&
        coordinates &&
        coordinates.length > 0;

    useAborterEffect(
        async (signal: any, isMounted: boolean) => {
            if (!condition) return;
            const data = await fetchPolygonData(
                { coordinates, layer: "amenities" },
                signal
            );
            isMounted && setPolygons(data?.features || []);
        },
        [coordinates, metric]
    );

    if (!condition) return [];
    return [
        new GeoJsonLayer({
            id: "amenities",
            data: polygons,
            filled: true,
            getFillColor: (d: any) => {
                if (
                    accessibilityList.length > 0 &&
                    !accessibilityList
                        .map((x) => x.label)
                        .includes(d.properties.amenity)
                ) {
                    return [200, 200, 200];
                }
                const type = amenitiesOptions.find(
                    (x) => x.label === d.properties.amenity
                )?.type;
                return type ? METRIC_COLOR[type] : [200, 200, 200];
            },
            getLineWidth: 0,
            pickable: true,
            updateTriggers: {
                getFillColor: [accessibilityList],
            },
        }),
    ];
};

export default useAmenitiesLayer;
