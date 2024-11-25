import { GeoJsonLayer } from "@deck.gl/layers";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { getQuantiles, VIEW_MODES, ZOOM_LOTS } from "../constants";
import { useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import * as turf from "@turf/turf";

const useLotsLayer = ({ queryData }: any) => {
    // const coordinates = useSelector(
    //     (state: RootState) => state.coordinates.coordinates
    // );
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    // console.log("coordinates", coordinates);
    // console.log(viewState);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const [polygons, setPolygons] = useState<any>([]);
    // const condition = coordinates && coordinates.length > 0;
    const condition = viewState.zoom >= 10;
    const legendLimits = useSelector(
        (state: RootState) => state.viewMode.legendLimits
    );
    const [quantiles] = getQuantiles(queryData, metric);
    const level = viewState.zoom >= ZOOM_LOTS ? "lots" : "blocks";
    const id = viewState.zoom >= ZOOM_LOTS ? "lot_id" : "cvegeo";

    useAborterEffect(
        async (signal: any, isMounted: boolean) => {
            setPolygons([]);
            if (!condition) return;
            if (!viewState || !viewState.latitude || !viewState.longitude) return;
            const circlePolygon = turf.circle(
                [viewState.longitude + (0.0008 * (18 - viewState.zoom)), viewState.latitude],
                Math.abs(20 - viewState.zoom) * 200,
                {
                    units: "meters",
                }
            );
            if (!circlePolygon) return;
            const polygons = await fetchPolygonData(
                {
                    coordinates: [circlePolygon.geometry.coordinates[0]],
                    layer: level,
                },
                signal
            );
            isMounted && setPolygons(polygons?.features || []);
        },
        [viewState.latitude, viewState.longitude, level, viewState.zoom]
    );

    const getFillColor = (d: any): any => {
        if (!quantiles) return [200, 200, 200];
        const value = queryData[d.properties[id]];

        if (
            legendLimits != null &&
            (value < legendLimits.min || value > legendLimits.max)
        ) {
            return [200, 200, 200];
        }

        if (value > 0) {
            const colorString = quantiles(value);
            const color = d3.color(colorString)?.rgb();
            return color ? [color.r, color.g, color.b] : [255, 255, 255];
        }

        if (value === undefined && viewMode === VIEW_MODES.FULL)
            return [255, 255, 255, 0];
        return [200, 200, 200];
    };

    if (!condition) return [];

    return [
        new GeoJsonLayer({
            id: "lots",
            data: polygons,
            filled: true,
            getFillColor: getFillColor,
            getLineWidth: 0,
            pickable: true,
            opacity: 0.8,
            updateTriggers: {
                getFillColor: [quantiles, queryData, legendLimits],
            },
        }),
    ];
};

export default useLotsLayer;
