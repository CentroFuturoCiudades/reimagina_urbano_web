import React, { useEffect, useMemo, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { API_URL, VIEW_MODES } from "../../constants";
import { RGBAColor } from "deck.gl";
import { DrawPolygonMode, ViewMode } from "@nebula.gl/edit-modes";
import { setSelectedLots } from "../../features/selectedLots/selectedLotsSlice";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import axios from "axios";
import { GenericObject } from "../../types";
import { LotsLayer, useLensLayer } from "../../layers";
import * as d3 from "d3";
import { fetchPolygonData } from "../../utils";
import PointsLayer from "../../layers/PointsLayer";

const useDrawPoligonLayer = () => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

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

    const drawLayer = new EditableGeoJsonLayer({
        id: "editable-layer",
        data: polygon,
        mode: polygon.features.length === 0 ? new DrawPolygonMode() : new ViewMode(),
        selectedFeatureIndexes: [0],
        onEdit: handleEdit,
        pickable: true,
        getTentativeFillColor: [255, 255, 255, 50],
        getFillColor: [0, 0, 0, 100],
        getTentativeLineColor: [0, 0, 255, 200],
        getLineColor: [0, 0, 255, 200],
    });

    return { drawPoligonData: polygon, layers: [drawLayer] };
};

const Layers = () => {
    const dispatch: AppDispatch = useDispatch();

    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const metric = useSelector((state: RootState) => state.queryMetric.queryMetric);
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);

    const [coords, setCoords] = useState({
        latitud: 24.753450686162093,
        longitud: -107.39367959923534,
    });
    const [queryData, setQueryData] = useState<any>({});
    const [coordinates, setCoordinates] = useState<any>([]);
    const [dataLayers, setDataLayers] = useState<any[]>([]);

    const { lensData, layers: lensLayers } = useLensLayer({ coords });
    const { drawPoligonData, layers: drawPoligonLayers } = useDrawPoligonLayer();

    //String values allow the serialization of those properties. Avoids infinite re-rendering
    const lensDataString = useMemo(() => JSON.stringify(lensData), [lensData]);
    const drawPoligonDataString = useMemo(() => JSON.stringify(drawPoligonData), [drawPoligonData]);

    useEffect(() => {
        setDataLayers([]);

        let temp =
            viewMode === VIEW_MODES.LENS
                ? lensData?.geometry.coordinates[0]
                : drawPoligonData?.features
                ? drawPoligonData.features[0]?.geometry.coordinates[0]
                : null;

        setCoordinates(temp);
    }, [viewMode, lensDataString, drawPoligonDataString]);

    useEffect(() => {
        if (isDrag) {
            return;
        }

        async function fetchData() {
            if (!metric || !coordinates) return;
            const response = await axios.post(`${API_URL}/query`, {
                metric: metric,
                accessibility_info: {},
                coordinates,
            });
            if (response && response.data) {
                const queryDataByProductId: GenericObject = {};

                const ids: string[]  = response.data.map((x: any) => x.ID) ;
                dispatch( setSelectedLots( ids ));

                response.data.forEach((data: any) => {
                    queryDataByProductId[data["ID"]] = data["value"];
                });

                setQueryData(queryDataByProductId);
            }
        }
        fetchData();
    }, [metric, coordinates, isDrag]);

    useEffect(() => {
        const getFillColor = (d: any): RGBAColor => {
            if (d.properties.ID in queryData) {
                const value = queryData[d.properties.ID];
                const domain = [
                    Math.min(...(Object.values(queryData) as any)),
                    Math.max(...(Object.values(queryData) as any)),
                ];
                const colors = d3.quantize(
                    d3.interpolateRgb(
                        `rgba(200, 255, 200, 1)`,
                        `rgba(0, 100, 0, 1)`
                    ),
                    8
                );
                const quantiles = d3
                    .scaleQuantize<string>()
                    .domain(domain)
                    .range(colors);
                const colorString = quantiles(value);
                const color = d3.color(colorString)?.rgb();
                return color ? [color.r, color.g, color.b] : [255, 255, 255];
            }
            return [255, 0, 0];
        };

        const getData = async () => {
            const layer = await LotsLayer({ coordinates, getFillColor });
            if (layer) {
                setDataLayers( (dataLayers)=> {
                    return [...dataLayers, layer]
                });
            }

            const points = await PointsLayer({ coordinates, getFillColor: [255, 0, 0, 255] });
            if (layer) {
                setDataLayers( (dataLayers)=> {
                    return [...dataLayers, points]
                });
            }
        };

        getData();
    }, [queryData]);

    const layers: any[] = [...dataLayers, ...lensLayers, ...drawPoligonLayers];

    return { layers };
};

export default Layers;




