import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { API_URL, getQuantiles, INITIAL_STATE, METRICS_MAPPING, POLYGON_MODES, VIEW_COLORS_RGBA, VIEW_MODES, ZOOM_SHOW_DETAILS } from "../../constants";
import { RGBAColor, TextLayer } from "deck.gl";
import { DrawPolygonMode, ModifyMode } from "@nebula.gl/edit-modes";
import { setSelectedLots } from "../../features/selectedLots/selectedLotsSlice";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import axios from "axios";
import { GenericObject } from "../../types";
import { useLotsLayer, useLensLayer, useBuildingsLayer, useAccessibilityPointsLayer, useAmenitiesLayer } from "../../layers";
import { setQueryData } from "../../features/queryData/queryDataSlice";
import { setIsLoading, setPoligonMode } from "../../features/viewMode/viewModeSlice";
import { useAborterEffect } from "../../utils";

const useDrawPoligonLayer = () => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const poligonMode = useSelector((state: RootState) => state.viewMode.poligonMode);

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

    switch( poligonMode ){
        case POLYGON_MODES.EDIT:
            mode = new ModifyMode()
        break;

        case POLYGON_MODES.DELETE:
            setPolygon( {
                type: "FeatureCollection",
                features: [],
            });
            dispatch( setPoligonMode( POLYGON_MODES.VIEW ))

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
        getTentativeLineColor: [0, 0, 255, 200],
        getLineColor: [0, 0, 255, 200],
    });

    return { drawPoligonData: polygon, layers: [drawLayer] };
};

const Layers = () => {
    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const accessibilityList: GenericObject = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const zoom = useSelector((state: RootState) => state.viewState.zoom);
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);

    const [queryData, setQueryDataState] = useState<any>({});
    const [queryDataFloors, setQueryDataFloorsState] = useState<any>({});
    const [coordinates, setCoordinates] = useState<any>(undefined);
    
    const { lensData, layers: lensLayers } = useLensLayer({ coords: {latitude: INITIAL_STATE.latitude, longitude: INITIAL_STATE.longitude} });
    const { drawPoligonData, layers: drawPoligonLayers } =
    useDrawPoligonLayer();
    const lotsLayers = useLotsLayer({ coordinates, viewMode, queryData, metric });
    const buildingsLayers: any = useBuildingsLayer({ coordinates, queryDataFloors, zoom });
    const accessibilityPointsLayer: any = useAccessibilityPointsLayer({ coordinates, metric });
    const amenitiesLayers = useAmenitiesLayer({ coordinates, metric });

    //String values allow the serialization of those properties. Avoids infinite re-rendering
    const lensDataString = useMemo(() => JSON.stringify(lensData), [lensData]);
    const drawPoligonDataString = useMemo(
        () => JSON.stringify(drawPoligonData),
        [drawPoligonData]
    );

    useEffect(() => {
        if (viewMode === VIEW_MODES.FULL) {
            if (coordinates) {
                setCoordinates(undefined);
            }
        } else if (viewMode === VIEW_MODES.LENS) {
            if (!isDrag) {
                setCoordinates(lensData?.geometry.coordinates[0]);
            }
        } else if (viewMode === VIEW_MODES.POLIGON) {
            setCoordinates(drawPoligonData?.features[0]?.geometry.coordinates[0]);
        }
    }, [viewMode, isDrag, lensDataString, drawPoligonDataString]);

    useAborterEffect(async (signal: any, isMounted: boolean) => {
        if ((!metric || !coordinates) && viewMode !== VIEW_MODES.FULL) return;
        console.log('--QUERY--')
        dispatch(setIsLoading(true));
        const response = await axios.post(`${API_URL}/query`, {
            metric: METRICS_MAPPING[metric]?.query || metric,
            accessibility_info: accessibilityList.map((x: any) => ({
                name: x.label,
                radius: 1600 * 2,
                importance: 1,
            })),
            coordinates,
            layer: viewMode === VIEW_MODES.FULL ? "blocks" : "lots",
        }, { signal });
        if (!response || !response.data) return;
        dispatch( setIsLoading( false ) );

        if (isMounted) {
            const queryDataByProductId: GenericObject = {};
            const queryDataFloorsData: GenericObject = {};
            const ids: string[] = response.data.map((x: any) => x.ID);
            dispatch(setSelectedLots(ids));

            response.data.forEach((data: any) => {
                queryDataByProductId[data["ID"]] = data["value"];
                queryDataFloorsData[data["ID"]] = {
                    num_floors: data["num_floors"],
                    max_height: data["max_height"],
                };
            });

            setQueryDataFloorsState(queryDataFloorsData);
            setQueryDataState(queryDataByProductId);
            dispatch(setQueryData(response.data));
        }
    }, [metric, coordinates, accessibilityList]);

    const layers: any[] = [ ...lotsLayers, ...buildingsLayers, ...amenitiesLayers, ...lensLayers, ...drawPoligonLayers, ...accessibilityPointsLayer];

    return { layers };
};

export default Layers;
