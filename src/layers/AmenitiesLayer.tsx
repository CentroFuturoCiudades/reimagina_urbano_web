import { useSelector } from "react-redux";
import { GenericObject } from "../types";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { GeoJsonLayer } from "deck.gl";
import { useState } from "react";
import { RootState } from "../app/store";
import { amenitiesOptions, VIEW_MODES } from "../constants";

// const METRIC_COLOR: GenericObject = {
//     landuse_parking: [120, 120, 120, 255],
//     landuse_equipment: [180, 0, 180, 255],
//     landuse_green: [160, 200, 160, 255],
//     landuse_park: [0, 130, 0, 255],
//     establishments: [0, 255, 0, 255],
//     landuse_building: [255, 255, 0, 255],
//     points: [255, 0, 0, 255],
// };

const METRIC_COLOR: GenericObject = {
    health: [124, 110, 177, 255],
    park: [126, 164, 141, 255],
    recreation: [234, 182, 66, 255],
    education: [204, 153, 153, 255],
};

const useAmenitiesLayer = ({coordinates, metric}: any) => {
    const [polygons, setPolygons] = useState<any>([]);
    const condition = metric !== "minutes";
    
    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (condition) return;
        const data = await fetchPolygonData({ coordinates, layer: "landuse_amenity" }, signal);
        console.log(data)
        isMounted && setPolygons(data?.features || []);
    }, [coordinates]);
    
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
        })
    ];
};

export default useAmenitiesLayer;
