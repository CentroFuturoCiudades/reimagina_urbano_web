import { GeoJsonLayer, RGBAColor } from "deck.gl";
import { fetchPolygonData, useAborterEffect } from "../utils";
import { getQuantiles, VIEW_MODES } from "../constants";
import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const useLotsLayer = ({ coordinates, queryData, metric, viewMode }: any) => {
    const [polygons, setPolygons] = useState<any>([]);
    const condition = (!coordinates || coordinates.length === 0) && viewMode !== VIEW_MODES.FULL;
    const legendLimits = useSelector(
        (state: RootState) => state.viewMode.legendLimits
    );
    const id = viewMode === VIEW_MODES.FULL  ? "cvegeo" : "lot_id";


    useAborterEffect(async (signal: any, isMounted: boolean) => {
        setPolygons( [] );
        if (condition) return;
        const polygons = await fetchPolygonData(
            {
                coordinates,
                layer: viewMode === VIEW_MODES.FULL ? "blocks" : "lots",
            },
            signal
        );
        isMounted && setPolygons(polygons?.features || []);
    }, [coordinates]);

    useEffect(() => {
        setPolygons(polygons.filter((x: any) => true));
    }, [queryData, legendLimits ]);


    const getFillColor = useMemo(() => {
        const [quantiles, _] = getQuantiles(queryData, metric)
        return (d: any): RGBAColor => {
            if (!quantiles) return [200, 200, 200];
            const value = queryData[d.properties[id]];

            if( legendLimits != null && ( value < legendLimits.min || value > legendLimits.max ) ) {
                return [200, 200, 200];
            }

            if (value > 0) {
                const colorString = quantiles(value);
                const color = d3.color(colorString)?.rgb();
                return color ? [color.r, color.g, color.b] : [255, 255, 255];
            }

            return [200, 200, 200];
        }
    }, [queryData, legendLimits]);

    if (condition) return [];

    return [
        new GeoJsonLayer({
            id: "lots",
            data: polygons,
            filled: true,
            getFillColor: getFillColor,
            getLineWidth: 0,
            pickable: true,
        }),
    ];
};

export default useLotsLayer;
