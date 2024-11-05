import React from "react";
import { IconLayer, TextLayer } from "@deck.gl/layers";
import { fetchPolygonData, useAborterEffect } from "../utils";
import {
    ACCESSIBILITY_POINTS_COLORS,
    amenitiesOptions,
    TABS,
} from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setAccessibilityPoints } from "../features/accessibilityList/accessibilityListSlice";
import { RootState } from "../app/store";
import type { PointFeature, ClusterFeature } from "supercluster";
import { CompositeLayer } from "@deck.gl/core";
import { IconLayerProps } from "@deck.gl/layers";
import Supercluster from "supercluster";

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

    const [polygons, setPolygons] = React.useState<any>([]);
    const condition =
        activeTab === TABS.ACCESIBILIDAD &&
        coordinates &&
        coordinates.length > 0;
    const accessibilityList = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const activeAmenity = useSelector(
        (state: RootState) => state.viewMode.activeAmenity
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
                pickable: true,
                getColor: (d: any) => {
                    if (
                        activeAmenity !== "" &&
                        (d.properties.cluster ||
                            d.properties.properties.amenity !== activeAmenity)
                    ) {
                        return [255, 255, 255, 100];
                    }
                    return mappingColors[amenity_type];
                },
                updateTriggers: {
                    getColor: [activeAmenity],
                },
            } as any);
        }
    );

    return [layersAmenities];
};

export class IconClusterLayer<
    DataT extends { [key: string]: any } = any,
    ExtraProps extends {} = {}
> extends CompositeLayer<Required<IconLayerProps<DataT>> & ExtraProps> {
    state!: {
        data: (PointFeature<DataT> | ClusterFeature<DataT>)[];
        index: Supercluster<DataT, DataT>;
        z: number;
    };

    shouldUpdateState({ changeFlags }: any) {
        return changeFlags.somethingChanged;
    }

    updateState({ props, oldProps, changeFlags }: any) {
        const rebuildIndex =
            changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

        if (rebuildIndex) {
            const index = new Supercluster<DataT, DataT>({
                maxZoom: 14,
                radius: props.sizeScale * Math.sqrt(2),
            });
            index.load(
                // @ts-ignore Supercluster expects proper GeoJSON feature
                (props.data as DataT[]).map((d) => ({
                    geometry: {
                        coordinates: (props.getPosition as Function)(d),
                    },
                    properties: d,
                }))
            );
            this.setState({ index });
        }

        const z = Math.floor(this.context.viewport.zoom);
        if (rebuildIndex || z !== this.state.z) {
            this.setState({
                data: this.state.index.getClusters([-180, -85, 180, 85], z),
                z,
            });
        }
    }

    getPickingInfo({ info, mode }: { info: any; mode: string }): any {
        const pickedObject = info.object?.properties;
        if (pickedObject) {
            let objects: DataT[] | undefined;
            if (pickedObject.cluster && mode !== "hover") {
                objects = this.state.index
                    .getLeaves(pickedObject.cluster_id, 25)
                    .map((f: any) => f.properties);
            }
            return { ...info, object: pickedObject, objects };
        }
        return { ...info, object: undefined };
    }

    renderLayers() {
        const { data } = this.state;
        const { iconAtlas, iconMapping, sizeScale, getColor, updateTriggers } =
            this.props as any;

        // Icon Layer for clusters
        const iconLayer = new IconLayer<
            PointFeature<DataT> | ClusterFeature<DataT>
        >(
            this.getSubLayerProps({
                id: "icon",
            }) as any,
            {
                data,
                iconAtlas,
                iconMapping,
                sizeScale,
                getColor: getColor as any,
                updateTriggers,
                getPosition: (d: any) =>
                    d.geometry.coordinates as [number, number],
                getIcon: (d) => "marker-1",
                getSize: (d: any) => (d.properties.cluster ? 1.4 : 1),
            }
        );

        // Text Layer for cluster counts
        const textLayer = new TextLayer({
            id: "text-layer",
            data,
            getPosition: (d: any) => d.geometry.coordinates as [number, number],
            getText: (d: any) =>
                d.properties.cluster ? `${d.properties.point_count}` : "",
            getSize: (d: any) => (d.properties.cluster ? 14 : 10),
            getPixelOffset: (d: any) =>
                d.properties.cluster ? [0, -18] : [0, -14],
            getColor: [255, 255, 255, 255],
            fontWeight: "bold",
            fontFamily: "Arial",
            getTextAnchor: "middle",
            getAlignmentBaseline: "center",
        });

        return [iconLayer, textLayer];
    }
}

export default useAccessibilityPointsLayer;
