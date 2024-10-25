import { useSelector } from "react-redux";
import { GenericObject } from "../types";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GeoJsonLayer } from "deck.gl";
import { useState } from "react";
import { RootState } from "../app/store";
import { amenitiesOptions, VIEW_MODES } from "../constants";

const METRIC_COLOR: GenericObject = {
    health: [149, 136, 196, 255],
    park: [174, 202, 186, 255],
    recreation: [249, 212, 131, 255],
    education: [204, 153, 153, 255],
    other: [151, 151, 151, 255],
};

const useAmenitiesLayer = ({coordinates, metric}: any) => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const [polygons, setPolygons] = useState<any>([]);
    const condition = ( (metric !== "minutes" && metric !== "accessibility_score") || ( (!coordinates || coordinates.length === 0) && viewMode != VIEW_MODES.FULL ));

    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (condition) return;
        const data = await fetchPolygonData({ coordinates, layer: "amenities" }, signal);
        isMounted && setPolygons(data?.features || []);
    }, [coordinates, metric ]);

    if (condition) return [];
    return [
        new GeoJsonLayer({
            id: 'amenities',
            data: polygons,
            filled: true,
            getFillColor: (d: any) => {
                const type = amenitiesOptions.find((x) => x.label === d.properties.amenity)?.type;
                console.log(type);
                return type ? METRIC_COLOR[type] : [200, 200, 200];
            },
            getLineWidth: 0,
            pickable: true,
        }),
    ];
};

export default useAmenitiesLayer;
