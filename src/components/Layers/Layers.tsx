import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { VIEW_MODES, ZOOM_LOTS } from "../../constants";
import { setSelectedLots } from "../../features/selectedLots/selectedLotsSlice";
import axios from "axios";
import { GenericObject } from "../../types";
import {
    useLotsLayer,
    useLensLayer,
    useBuildingsLayer,
    useAccessibilityPointsLayer,
    useAmenitiesLayer,
    useSelectLayer,
} from "../../layers";
import { setQueryData } from "../../features/queryData/queryDataSlice";
import { setIsLoading } from "../../features/viewMode/viewModeSlice";
import { useAborterEffect } from "../../utils";
import * as turf from "@turf/turf";

const Layers = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const isLoading = useSelector(
        (state: RootState) => state.viewMode.isLoading
    );
    const accessibilityList: GenericObject = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    // const coordinates = useSelector(
    //     (state: RootState) => state.coordinates.coordinates
    // );

    const [queryData, setQueryDataState] = useState<any>({});
    const [queryDataFloors, setQueryDataFloorsState] = useState<any>({});

    const { layers: selectLayers } = useSelectLayer();
    const { layers: lensLayers } = useLensLayer();
    const lotsLayers = useLotsLayer({ queryData });
    const buildingsLayers: any = useBuildingsLayer({ queryDataFloors });
    const accessibilityPointsLayer: any = useAccessibilityPointsLayer();
    const amenitiesLayers = useAmenitiesLayer();
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    const id = viewState.zoom >= 16 ? "lot_id" : "cvegeo";
    const level = viewState.zoom >= ZOOM_LOTS ? "lots" : "blocks";
    const condition = metric && viewState.latitude && viewState.longitude;

    useAborterEffect(
        async (signal: any, isMounted: boolean) => {
            if (!condition) {
                dispatch(setSelectedLots([]));
                dispatch(setQueryData([]));
                return;
            }
            dispatch(setIsLoading(true));
            const metrics =
                viewMode === VIEW_MODES.LENS
                    ? {
                          [metric]: "value",
                      }
                    : { [metric]: "value" };
            if (metric !== "num_levels")
                metrics["num_levels"] = "num_levels";
            if (metric !== "max_num_levels")
                metrics["max_num_levels"] = "max_num_levels";
            const circlePolygon = turf.circle(
                [viewState.longitude + (0.0008 * (18 - viewState.zoom)), viewState.latitude],
                Math.abs(20 - viewState.zoom) * 200,
                {
                    units: "meters",
                }
            );
            if (!circlePolygon) return;
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/query`,
                {
                    metric,
                    accessibility_info: accessibilityList.map(
                        (x: any) => x.value
                    ),
                    coordinates: [circlePolygon.geometry.coordinates[0]],
                    metrics,
                    level: level,
                },
                { signal }
            );
            if (!response || !response.data) return;
            dispatch(setIsLoading(false));

            if (isMounted) {
                const queryDataByProductId: GenericObject = {};
                const queryDataFloorsData: GenericObject = {};
                const ids: any[] = Array.from(
                    new Set(response.data.map((x: any) => x[id])).values()
                );
                dispatch(setSelectedLots(ids));

                response.data.forEach((data: any) => {
                    queryDataByProductId[data[id]] = data["value"];
                    queryDataFloorsData[data[id]] = {
                        num_levels: data["num_levels"],
                        max_num_levels: data["max_num_levels"],
                    };
                });

                setQueryDataFloorsState(queryDataFloorsData);
                setQueryDataState(queryDataByProductId);
                dispatch(setQueryData(response.data));
            }
        },
        [metric, accessibilityList, level, viewState.zoom, viewState.latitude, viewState.longitude]
    );

    const layers: any[] = [
        ...[queryData && !isLoading && lotsLayers],
        ...buildingsLayers,
        ...amenitiesLayers,
        ...selectLayers,
        ...lensLayers,
        ...accessibilityPointsLayer,
    ];

    return { layers };
};

export default Layers;
