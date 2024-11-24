import { GeoJsonLayer } from "@deck.gl/layers";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { getQuantiles, VIEW_MODES } from "../constants";
import { useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const useLotsLayer = ({ queryData }: any) => {
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const [polygons, setPolygons] = useState<any>([]);
    const condition = coordinates && coordinates.length > 0;
    const legendLimits = useSelector(
        (state: RootState) => state.viewMode.legendLimits
    );
    const [quantiles] = getQuantiles(queryData, metric);
    const id = viewMode === VIEW_MODES.LENS ? "lot_id" : "cvegeo";

    useAborterEffect(
        async (signal: any, isMounted: boolean) => {
            setPolygons([]);
            if (!condition) return;
            const polygons = await fetchPolygonData(
                {
                    coordinates,
                    layer: viewMode === VIEW_MODES.LENS ? "lots" : "blocks",
                },
                signal
            );
            isMounted && setPolygons(polygons?.features || []);
        },
        [coordinates]
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
