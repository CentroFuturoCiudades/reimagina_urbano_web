import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { VIEW_MODES } from "../../constants";
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
import { fetchPolygonData, useAborterEffect } from "../../utils";
import { IconLayer } from "@deck.gl/layers";
import { setDataInfo } from "../../features/queryMetric/queryMetricSlice";

const useExtraLayers = () => {
    const condition = useSelector(
        (state: RootState) => state.viewMode.project === "culiacan_sur"
    );
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const [polygons, setPolygons] = useState<any>([]);
    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if (!condition) return;
        const polygons = await fetchPolygonData(
            { coordinates, layer: "accessibility_points" },
            signal
        );
        const data = polygons?.features || [];
        const filteredData = data.filter(
            (item: any) =>
                item.properties.amenity === "Capilla" ||
                item.properties.amenity === "Comedor"
        );
        isMounted && setPolygons(filteredData);
    }, []);
    if (!condition) return [];
    const layer = new IconLayer({
        iconMapping: {
            marker: {
                x: 0,
                y: 0,
                width: 512,
                height: 512,
                mask: true,
            },
        },
        getColor: [50, 50, 50],
        iconAtlas:
            "https://images.vexels.com/content/155419/preview/thick-christian-cross-icon-032999.png",
        getPosition: (d: any) => d.geometry.coordinates,
        getIcon: (d: any) => "marker",
        data: polygons.filter(
            (item: any) => item.properties.amenity === "Capilla"
        ),
        sizeScale: 20,
    });
    const layer2 = new IconLayer({
        iconMapping: {
            marker: {
                x: 0,
                y: 0,
                width: 512,
                height: 512,
                mask: true,
            },
        },
        getColor: [50, 50, 50],
        iconAtlas: "https://cdn-icons-png.flaticon.com/512/7033/7033682.png",
        getPosition: (d: any) => d.geometry.coordinates,
        getIcon: (d: any) => "marker",
        data: polygons.filter(
            (item: any) => item.properties.amenity === "Comedor"
        ),
        sizeScale: 30,
    });
    return [layer, layer2];
};

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
    const coordinates = useSelector(
        (state: RootState) => state.coordinates.coordinates
    );
    const groupAges = useSelector(
        (state: RootState) => state.queryMetric.groupAges
    );

    const [queryData, setQueryDataState] = useState<any>({});
    const [queryDataFloors, setQueryDataFloorsState] = useState<any>({});

    const { layers: selectLayers } = useSelectLayer();
    const { layers: lensLayers } = useLensLayer();
    const lotsLayers = useLotsLayer({ queryData });
    const buildingsLayers: any = useBuildingsLayer({ queryDataFloors });
    const accessibilityPointsLayer: any = useAccessibilityPointsLayer();
    const amenitiesLayers = useAmenitiesLayer();
    const extraLayers = useExtraLayers();
    const id = viewMode === VIEW_MODES.LENS ? "lot_id" : "cvegeo";
    const condition = metric && coordinates && coordinates.length > 0;

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
            if (metric !== "num_levels") metrics["num_levels"] = "num_levels";
            if (metric !== "max_num_levels")
                metrics["max_num_levels"] = "max_num_levels";
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/query`,
                {
                    metric,
                    accessibility_info: accessibilityList.map(
                        (x: any) => x.value
                    ),
                    coordinates,
                    metrics,
                    level: viewMode === VIEW_MODES.LENS ? "lots" : "blocks",
                    group_ages: groupAges,
                },
                { signal }
            );
            if (!response || !response.data) return;
            dispatch(setIsLoading(false));

            if (isMounted) {
                const dfData = response.data.data;
                const dataInfo = response.data.stats_info;
                const queryDataByProductId: GenericObject = {};
                const queryDataFloorsData: GenericObject = {};
                const ids: any[] = Array.from(
                    new Set(dfData.map((x: any) => x[id])).values()
                );
                dispatch(setSelectedLots(ids));

                dfData.forEach((data: any) => {
                    queryDataByProductId[data[id]] = data["value"];
                    queryDataFloorsData[data[id]] = {
                        num_levels: data["num_levels"],
                        max_num_levels: data["max_num_levels"],
                    };
                });

                setQueryDataFloorsState(queryDataFloorsData);
                setQueryDataState(queryDataByProductId);
                dispatch(setDataInfo(dataInfo));
                dispatch(setQueryData(dfData));
            }
        },
        [metric, coordinates, accessibilityList, groupAges]
    );

    const layers: any[] = [
        ...[queryData && !isLoading && lotsLayers],
        ...buildingsLayers,
        ...amenitiesLayers,
        ...selectLayers,
        ...lensLayers,
        ...accessibilityPointsLayer,
        ...extraLayers,
    ];

    return { layers };
};

export default Layers;
