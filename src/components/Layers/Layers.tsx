import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { API_URL, VIEW_COLORS_RGBA, VIEW_MODES, ZOOM_SHOW_DETAILS } from "../../constants";
import { RGBAColor, TextLayer } from "deck.gl";
import { DrawPolygonMode, ViewMode } from "@nebula.gl/edit-modes";
import { setSelectedLots } from "../../features/selectedLots/selectedLotsSlice";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import axios from "axios";
import { GenericObject } from "../../types";
import { AmenitiesLayer, LotsLayer, useLensLayer, BuildingsLayer, AccessibilityPointsLayer } from "../../layers";
import * as d3 from "d3";
import { setQueryData } from "../../features/queryData/queryDataSlice";
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
        mode:
            polygon.features.length === 0
                ? new DrawPolygonMode()
                : new ViewMode(),
        selectedFeatureIndexes: [0],
        onEdit: handleEdit,
        pickable: true,
        getTentativeFillColor: [255, 255, 255, 50],
        getFillColor: [0, 0, 0, 50],
        getTentativeLineColor: [0, 0, 255, 200],
        getLineColor: [0, 0, 255, 200],
    });

    return { drawPoligonData: polygon, layers: [drawLayer] };
};

const Layers = () => {
    const dispatch: AppDispatch = useDispatch();

    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const zoom = useSelector((state: RootState) => state.viewState.zoom);
    const isBuildingZoom = zoom >= ZOOM_SHOW_DETAILS;
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);

    const [coords, setCoords] = useState({
        latitud: 24.753450686162093,
        longitud: -107.39367959923534,
    });
    const [queryData, setQueryDataState] = useState<any>({});
    const [queryDataFloors, setQueryDataFloorsState] = useState<any>({});
    const [coordinates, setCoordinates] = useState<any>([]);
    const [dataLayers, setDataLayers] = useState<any[]>([]);

    const { lensData, layers: lensLayers } = useLensLayer({ coords });
    const { drawPoligonData, layers: drawPoligonLayers } =
        useDrawPoligonLayer();

    //String values allow the serialization of those properties. Avoids infinite re-rendering
    const lensDataString = useMemo(() => JSON.stringify(lensData), [lensData]);
    const drawPoligonDataString = useMemo(
        () => JSON.stringify(drawPoligonData),
        [drawPoligonData]
    );

    const amenitiesArray: GenericObject = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );

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
        const controller = new AbortController();

        async function fetchData() {
            if ((!metric || !coordinates) && viewMode !== VIEW_MODES.FULL)
                return;
            try {
                // TODO: Use redux to get accessibility list data.
                const response = await axios.post(`${API_URL}/query`, {
                    metric: metric,
                    accessibility_info: amenitiesArray.map((x: any) => ({
                        name: x.label,
                        radius: 1600 * 2,
                        importance: 1,
                    })),
                    coordinates,
                    layer: viewMode === VIEW_MODES.FULL ? "blocks" : "lots",
                }, {signal: controller.signal});
                if (response && response.data) {
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
                    dispatch(setQueryData(queryDataByProductId));
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
        return () => {controller.abort();};
    }, [metric, coordinates, isDrag, viewMode, amenitiesArray]);

    const [hoverInfo, setHoverInfo] = useState<any>(null);

    const iconHover = (x: number, y: number, object: any )=> {
        if (object) {
            console.log(object)
            setHoverInfo({
                object,
                x,
                y,
            });
        } else {
            setHoverInfo(null);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const domain = [
            Math.min(
                ...(Object.values(queryData) as any).filter(
                    (x: number) => x > 0
                )
            ),
            Math.max(...(Object.values(queryData) as any)),
        ];
        const colors = d3.quantize(
            d3.interpolateRgb(
                VIEW_COLORS_RGBA.ACCESIBILIDAD.light,
                VIEW_COLORS_RGBA.ACCESIBILIDAD.dark
            ),
            8
        );
        const quantiles = d3
            .scaleQuantize<string>()
            .domain(domain)
            .range(colors);

        const getFillColor = (d: any): RGBAColor => {
            const value = queryData[d.properties.ID];

            if (value > 0) {
                const colorString = quantiles(value);
                const color = d3.color(colorString)?.rgb();
                return color ? [color.r, color.g, color.b] : [255, 255, 255];
            }

            return [200, 200, 200];
        };

        const getData = async () => {
            const layer = await LotsLayer({
                coordinates,
                getFillColor,
                viewMode,
                signal: controller.signal,
            });
            if (layer) {
                setDataLayers((dataLayers) => {
                    return [...dataLayers, layer];
                });
            }

            // const points = await PointsLayer({ coordinates, getFillColor: [255, 0, 0, 255] });
            // if (points) {
            //     setDataLayers( (dataLayers)=> {
            //         return [...dataLayers, points]
            //     });
            // }

            const amenities = await AmenitiesLayer({
                coordinates,
                amenitiesArray,
            });
            if (amenities && amenities.length) {
                setDataLayers((dataLayers) => {
                    return [...dataLayers, ...amenities];
                });
            }

            const accessibilityPointsLayer = await AccessibilityPointsLayer({
                coordinates,
                layer: 'accessibility_points',
                onHover: iconHover
            });
            if (accessibilityPointsLayer) {
                setDataLayers((dataLayers) => {
                    return [...dataLayers, accessibilityPointsLayer];
                });
            }

            // const buildings = await BuildingsLayer({ coordinates, queryDataFloors });
            // if( buildings && buildings.length ){
            //     setDataLayers( (dataLayers)=> {
            //         return [...dataLayers, ...buildings]

            //     });
            // }
        };

        getData();
    }, [queryData, amenitiesArray]);


    useEffect(() => {
        const getData = async () => {
            if (isBuildingZoom) {
                const buildingsLayer = dataLayers.find((layer) => layer.id === "buildings-floors-layer");
                if (buildingsLayer) {
                    return;
                }
                const buildings = await BuildingsLayer({ coordinates, queryDataFloors, signal: undefined });
                if( buildings && buildings.length){
                    setDataLayers( (dataLayers)=> {
                        return [...dataLayers, ...buildings]
                    });
                }
            } else {
                setDataLayers( (dataLayers)=> {
                    return dataLayers.filter((layer) => layer.id !== "buildings-floors-layer" && layer.id !== "buildings-max-height-layer");
                });
            }
        };
        getData();
    }, [isBuildingZoom]);


    const layers: any[] = [ ...dataLayers , ...lensLayers, ...drawPoligonLayers, hoverInfo && new TextLayer({
        id: 'text-layer',
        data: [hoverInfo],
        getPosition:( d: any ) => d.object.position,  // Adjust depending on your data
        getText: ( d: any) => d.object.amenity,  // Customize based on your data properties
        getPixelOffset: [0, -20],
        getSize: 16,
        getColor: [255, 255, 255 ],
        background: true,
        backgroundColor: [0, 0, 0, 150], // Semi-transparent black background
        backgroundPadding: [6, 4], // Horizontal and vertical padding
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        fontFamily: '"Arial", sans-serif',
        characterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789éó', // Include special characters
    }),];

    return { layers };
};

export default Layers;
