import React from "react";
import { fetchPolygonData, useAborterEffect } from "../utils";
import {
    ACCESSIBILITY_POINTS_COLORS,
    amenitiesOptions,
    TABS,
} from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setAccessibilityPoints, setSelectedAmenity, clearSelectedAmenity } from "../features/accessibilityList/accessibilityListSlice";
import { RootState } from "../app/store";
import { IconClusterLayer } from "./IconClusterLayer";

const useAccessibilityPointsLayer = () => {
    const dispatch = useDispatch();
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const activeTab = useSelector(
        (state: RootState) => state.viewMode.activeTab
    );
    const selectedAmenity = useSelector(
        (state: RootState) => state.accessibilityList.selectedAmenity
    );

    const [polygons, setPolygons] = React.useState<any>([]);
    const condition =
        activeTab === TABS.ACCESIBILIDAD &&
        coordinates &&
        coordinates.length > 0;
    const accessibilityList = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );

    useAborterEffect(
        async (signal: any, isMounted: boolean) => {
            if (!condition) return;
            const polygons = await fetchPolygonData(
                { coordinates, layer: "accessibility_points" },
                signal
            );
            const polygonsData = polygons?.features || [];
            const accessibilityListValues = accessibilityList.map((item) => {
                return item.value;
            });
            const data = polygonsData.filter((item: any) => {
                if (accessibilityList.length) {
                    const key =
                        amenitiesOptions.find(
                            (option) => option.label === item.properties.amenity
                        )?.value || "health";
                    return accessibilityListValues.includes(key);
                } else {
                    return true;
                }
            });
            const parsedData = data.map((item: any) => {
                return item.properties;
            });
            isMounted && setPolygons(data);
            dispatch(setAccessibilityPoints(parsedData));
        },
        [coordinates, accessibilityList, metric]
    );

    if (!condition) return [];

    const mappingColors: any = {
        education: [184, 138, 138, 255], // Darkened by 10%
        health: [112, 99, 159, 255], // Darkened by 10%
        recreation: [211, 164, 59, 255], // Darkened by 10%
        park: [113, 148, 127, 255], // Darkened by 10%
        other: [115, 115, 115, 255], // Darkened by 10%
    };

    const layersAmenities = Object.keys(ACCESSIBILITY_POINTS_COLORS).map(
        (amenity_type: any) => {
            const filteredPolygons = polygons.filter(
                (item: any) =>
                    amenitiesOptions.find(
                        (option) => option.label === item.properties.amenity
                    )?.type === amenity_type
            );
            return new IconClusterLayer({
                id: `${amenity_type}-layer`,
                data: filteredPolygons,
                sizeScale: 25,
                getPosition: (d: any) => d.geometry.coordinates,
                iconMapping: "location-icon-mapping.json",
                iconAtlas: "location-icon-atlas.png",
                maxZoom: 14,
                clusteringSize: 1,
                pickable: true,
                getColor: (d: any) => {
                    const color = mappingColors[amenity_type];
                    if (!selectedAmenity) {
                        return color;
                    }
                    if (d.properties && d.properties.properties.id === selectedAmenity.id) {
                        return color;
                    } else {
                        return [color[0] + 20, color[1] + 20, color[2] + 20, 50];
                    }
                },
                onClick: (info: any) => {
                    if (info.object) {
                        dispatch(setSelectedAmenity(info.object.properties));
                    } else {
                        dispatch(clearSelectedAmenity());
                    }
                },
                updateTriggers: {
                    getColor: [selectedAmenity],
                },
            } as any);
        }
    );

    return [layersAmenities];
};

export default useAccessibilityPointsLayer;
