import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
    defaultCoords,
    INITIAL_STATE,
    METRICS_MAPPING,
    POLYGON_MODES,
    VIEW_MODES,
} from "../../constants";
import { DrawPolygonMode, ModifyMode } from "@nebula.gl/edit-modes";
import { setSelectedLots } from "../../features/selectedLots/selectedLotsSlice";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
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
import {
    setIsLoading,
    setPoligonMode,
} from "../../features/viewMode/viewModeSlice";
import { useAborterEffect } from "../../utils";

const useDrawPoligonLayer = () => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const poligonMode = useSelector(
        (state: RootState) => state.viewMode.poligonMode
    );

    const dispatch: AppDispatch = useDispatch();

    const [polygon, setPolygon] = useState<any>({
        type: "FeatureCollection",
        features: [],
    });

    const handleEdit = ({ updatedData, editType, editContext }: any) => {
        const selectedArea = updatedData.features[0];
        if (selectedArea) {
            setPolygon({
                type: "FeatureCollection",
                features: updatedData.features,
            });
        }
    };

    if (viewMode !== VIEW_MODES.POLIGON) {
        return { drawPoligonData: polygon, layers: [] };
    }

    var mode: DrawPolygonMode | ModifyMode;

    switch (poligonMode) {
        case POLYGON_MODES.EDIT:
            mode = new ModifyMode();
            break;

        case POLYGON_MODES.DELETE:
            setPolygon({
                type: "FeatureCollection",
                features: [],
            });
            dispatch(setPoligonMode(POLYGON_MODES.VIEW));

            break;
    }

    const drawLayer = new EditableGeoJsonLayer({
        id: "editable-layer",
        data: polygon,
        mode:
            polygon.features.length === 0
                ? new DrawPolygonMode()
                : new DrawPolygonMode(),
        selectedFeatureIndexes: [0],
        onEdit: handleEdit,
        pickable: true,
        getTentativeFillColor: [255, 255, 255, 50],
        getFillColor: [0, 0, 0, 0],
        getTentativeLineColor: [0, 100, 0, 200],
        getTentativeLineWidth: 4,
        getLineColor: [0, 100, 0, 200],
        getLineWidth: 4,
    });

    return { drawPoligonData: polygon, layers: [drawLayer] };
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

    const [queryData, setQueryDataState] = useState<any>({});
    const [queryDataFloors, setQueryDataFloorsState] = useState<any>({});

    const { layers: selectLayers } = useSelectLayer();
    const { layers: lensLayers } = useLensLayer();
    const lotsLayers = useLotsLayer({ queryData });
    const buildingsLayers: any = useBuildingsLayer({ queryDataFloors });
    const accessibilityPointsLayer: any = useAccessibilityPointsLayer();
    const amenitiesLayers = useAmenitiesLayer();
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
                        num_floors: "num_floors",
                        max_height: "max_height",
                    } : { [metric]: "value" };
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
                        num_floors: data["num_floors"],
                        max_height: data["max_height"],
                    };
                });

                setQueryDataFloorsState(queryDataFloorsData);
                setQueryDataState(queryDataByProductId);
                dispatch(setQueryData(response.data));
            }
        },
        [metric, coordinates, accessibilityList]
    );

    const layers: any[] = [
        ...[queryData && !isLoading && lotsLayers],
        ...buildingsLayers,
        ...selectLayers,
        ...lensLayers,
        ...amenitiesLayers,
        ...accessibilityPointsLayer,
    ];

    return { layers };
};

export default Layers;
