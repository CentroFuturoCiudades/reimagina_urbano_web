import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { DeckGL } from "@deck.gl/react/typed";
import { Map } from "react-map-gl";
import { lightenColor, useFetch, useFetchGeo } from "../../utils";
import { API_URL, BLOB_URL, INITIAL_STATE, VIEW_MODES } from "../../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import * as d3 from "d3";
import { GenericObject } from "../../types";
import { PickInfo, RGBAColor, View } from "deck.gl";
import * as turf from "@turf/turf";
import { debounce, set } from "lodash";
import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import {
    DrawPolygonMode,
    ViewMode,
    TranslateMode,
} from "@nebula.gl/edit-modes";

interface BaseMapProps {
    isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const project = window.location.pathname.split("/")[1];
    const [coords, setCoords] = useState({
        latitud: 24.753450686162093,
        longitud: -107.39367959923534,
    });

    const { lensData, layers: lensLayers } = useLensLayer({ coords });

    const { analysisData, layers: analysisLayers } = useAnalysisLayer();
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const metric = useSelector(
        (state: RootState) => state.queryMetric.queryMetric
    );
    const [queryData, setQueryData] = useState<any>({});
    const [colorFunction, setColorFunction] = useState();
    const dispatch: AppDispatch = useDispatch();
    const coordinates =
        viewMode === VIEW_MODES.LENS
            ? lensData?.geometry.coordinates[0]
            : analysisData.features[0]?.geometry.coordinates[0];
    const modeLayers =
        viewMode === VIEW_MODES.LENS ? lensLayers : analysisLayers;
    const getFillColor: any = (d: any) => {
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
    const populationPointsLayer = usePopulationPointsLayer({
        coordinates,
        fillColor: getFillColor,
    });
    const lotsLayer = useLotsLayer({ coordinates, fillColor: getFillColor });
    const layers: any[] = [lotsLayer, populationPointsLayer, ...modeLayers];

    useEffect(() => {
        async function updateProject() {
            const coords = await axios.get(`${API_URL}/coords`);
            setCoords(coords.data);
        }
        updateProject();
    }, [project]);
    useEffect(() => {
        async function fetchData() {
            if (!metric || !coordinates) return;
            const response = await axios.post(`${API_URL}/query`, {
                metric: metric,
                accessibility_info: {},
                coordinates,
            });
            if (response && response.data) {
                const queryDataByProductId: GenericObject = {};

                const ids = response.data.map((x: any) => x.ID);

                response.data.forEach((data: any) => {
                    queryDataByProductId[data["ID"]] = data["value"];
                });

                setQueryData(queryDataByProductId);
            }
        }
        fetchData();
    }, [metric, coordinates]);

    if (!coords) {
        return <div>Loading</div>;
    }
    return (
        <DeckGL
            initialViewState={{
                ...INITIAL_STATE,
                latitude: coords["latitud"],
                longitude: coords["longitud"],
            }}
            layers={layers}
            controller={{ dragPan: coordinates !== undefined }}
        >
            <Map
                mapStyle={
                    isSatellite
                        ? "mapbox://styles/mapbox/satellite-v9"
                        : "mapbox://styles/lameouchi/clw841tdm00io01ox4vczgtkl"
                }
                mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
                attributionControl={false}
            />
        </DeckGL>
    );
};

const useLotsLayer = ({
    coordinates,
    fillColor,
}: {
    coordinates: any[];
    fillColor: any;
}) => {
    const [data, setData] = useFetchPolygonData(coordinates, "lots");
    return new GeoJsonLayer({
        id: "lots",
        data: data,
        filled: true,
        getFillColor: fillColor,
        getLineWidth: 0,
        pickable: true,
    });
};

const usePopulationPointsLayer = ({ coordinates, fillColor }: any) => {
    const [data, setData] = useFetchPolygonData(coordinates, "points");
    return new GeoJsonLayer({
        id: "population-points",
        data: data,
        filled: true,
        getFillColor: fillColor,
        getLineWidth: 0,
        pickable: true,
    });
};

const useFetchPolygonData = (coordinates: any[], layer: string) => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            if (!coordinates || coordinates.length === 0) {
                return;
            }
            const data = await fetchPolygonData({ coordinates, layer });
            setData(data);
        };
        fetchData();
    }, [coordinates]);
    return [data, setData];
};

const useLensLayer = ({ coords }: any) => {
    const [circleRadius, setBrushingRadius] = useState(400); //radio esta en metros
    const [circleCoords, setCircleCoords] = useState([
        coords.longitud,
        coords.latitud,
    ]);
    const [isDrag, setIsDrag] = useState(false);
    const [data, setData] = useState<any>();

    useEffect(() => {
        const temp = turf.circle(circleCoords, circleRadius, {
            units: "meters",
        });
        setData(temp);
    }, []);

    const handleHover = useCallback((info: PickInfo<unknown>) => {
        if (info && info.coordinate) {
            setCircleCoords([info.coordinate[0], info.coordinate[1]]);
        } else {
            setCircleCoords([]);
        }
    }, []);
    const debouncedHover = useCallback(debounce(handleHover, 100), [
        handleHover,
    ]);
    const lensLayer = new GeoJsonLayer({
        id: "circle",
        data: data,
        filled: true,
        getFillColor: [0, 120, 0, 25],
        getLineColor: [0, 120, 0, 255],
        getLineWidth: 5,
        pickable: true,
        onDragStart: () => {
            setIsDrag(true);
            setData(undefined);
        },
        onDrag: (info, event) => {
            if (info && info.coordinate)
                setCircleCoords([info.coordinate[0], info.coordinate[1]]);
        },
        onDragEnd: (info: any, event) => {
            setIsDrag(false);
            debouncedHover(info);
            const temp = turf.circle(circleCoords, circleRadius, {
                units: "meters",
            });
            setData(temp);
        },
    });
    return {
        layers: [lensLayer],
        lensData: data,
    };
};

const useAnalysisLayer = () => {
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

    if (polygon.features.length === 0) {
        const drawLayer = new EditableGeoJsonLayer({
            id: "editable-layer",
            data: polygon,
            mode: new DrawPolygonMode(),
            selectedFeatureIndexes: [0],
            onEdit: handleEdit,
            pickable: true,
            getTentativeFillColor: [255, 255, 255, 50],
            getFillColor: [0, 0, 0, 100],
            getTentativeLineColor: [0, 0, 255, 200],
            getLineColor: [0, 0, 255, 200],
        });
        return { analysisData: polygon, layers: [drawLayer] };
    } else {
        const drawLayer = new EditableGeoJsonLayer({
            id: "editable-layer",
            data: polygon,
            mode: new ViewMode(),
            pickable: true,
            getTentativeFillColor: [255, 255, 255, 50],
            getFillColor: [0, 0, 0, 100],
            getTentativeLineColor: [0, 0, 255, 200],
            getLineColor: [0, 0, 255, 200],
        });
        return { analysisData: polygon, layers: [drawLayer] };
    }
};

const fetchPolygonData = async ({
    coordinates,
    layer,
}: {
    coordinates: any;
    layer: string;
}) => {
    const url = `${API_URL}/poligon`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                coordinates,
                layer,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const arrayBuffer = await response.arrayBuffer();
        const data = await load(arrayBuffer, FlatGeobufLoader);
        return data;
    } catch (error) {
        console.error(error);
    }
};

// const BaseMap2: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
//     const project = window.location.pathname.split("/")[1];
//     const [coords, setCoords] = useState();
//     const [lotsLayer, setLotsLayer] = useState<any>(null);
//     const [colorFunction, setColorFunction] =
//         useState<(arg0: any) => RGBAColor>();
//     const [queryData, setQueryData] = useState<GenericObject>({});

//     const { data: poligono } = useFetch(
//         `${BLOB_URL}/${project}/bounds.geojson`
//     );
//     const { data: dataLots } = useFetchGeo(
//         `${BLOB_URL}/${project}/lots.fgb`
//     ) as any;

//     //Redux
//     const dispatch: AppDispatch = useDispatch();

//     const baseColor = useSelector(
//         (state: RootState) => state.baseColor.baseColor
//     );
//     const queryMetric = useSelector(
//         (state: RootState) => state.queryMetric.queryMetric
//     );
//     const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
//     const proximityOptions: GenericObject = useSelector(
//         (state: RootState) => state.accSettings.accSettings
//     );

//     //TODO: MOVE THIS TO A COMPONENT
//     const [circleCoords, setCircleCoords] = useState([
//         -107.39367959923534, 24.753450686162093,
//     ]);
//     const [isDrag, setIsDrag] = useState(false);
//     const [brushingRadius, setBrushingRadius] = useState(400); //radio esta en metros

//     const handleHover = useCallback((info: PickInfo<unknown>) => {
//         if (info && info.coordinate) {
//             setCircleCoords([info.coordinate[0], info.coordinate[1]]);
//         } else {
//             setCircleCoords([]);
//         }
//     }, []);

//     const debouncedHover = useCallback(debounce(handleHover, 100), [
//         handleHover,
//     ]);
//     let abortController = new AbortController();

//     const [viewLayers, setViewLayers] = useState<any>({});

//     useEffect(() => {
//         async function fetchData() {
//             if (!circleCoords) {
//                 return;
//             }

//             if (isDrag) {
//                 return;
//             }

//             if (abortController) {
//                 abortController.abort();
//             }
//             abortController = new AbortController();
//             const lat = circleCoords[1];
//             const lon = circleCoords[0];
//             const params = new URLSearchParams({
//                 lat: lat.toString(),
//                 lon: lon.toString(),
//                 radius: brushingRadius.toString(),
//             });
//             const metricsMapping = {
//                 park: "landuse_park",
//                 parking: "landuse_parking",
//                 green: "landuse_green",
//                 equipment: "landuse_equipment",
//                 establishments: "establishments",
//                 building: "landuse_building",
//                 points: "points",
//             };
//             // use visible to show or not the metrics
//             //   Object.keys(visible)
//             //     .filter((metric) => visible[metric] && metricsMapping[metric])
//             //     .forEach((metric) => params.append("metrics", metricsMapping[metric]));

//             Object.values(metricsMapping).forEach((metric) =>
//                 params.append("metrics", metric)
//             );
//             const url = `http://127.0.0.1:8000/lens?${params.toString()}`;
//             try {
//                 const response = await fetch(url, {
//                     signal: abortController.signal,
//                 });
//                 const arrayBuffer = await response.arrayBuffer();
//                 const data = await load(arrayBuffer, FlatGeobufLoader);
//                 const idsFromCircle = data.features.map(
//                     (feature: any) => feature.properties.ID
//                 );

//                 let originalData = data;

//                 const METRIC_COLOR: GenericObject = {
//                     landuse_parking: [120, 120, 120, 255],
//                     landuse_equipment: [180, 0, 180, 255],
//                     landuse_green: [160, 200, 160, 255],
//                     landuse_park: [0, 130, 0, 255],
//                     establishments: [0, 255, 0, 255],
//                     landuse_building: [255, 255, 0, 255],
//                     points: [255, 0, 0, 255],
//                 };

//                 const lensLots = originalData.features.filter(
//                     (feature: any) => feature.properties["metric"] === "lots"
//                 );
//                 const dataPark = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "landuse_park"
//                 );
//                 const dataEquipment = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "landuse_equipment"
//                 );
//                 const dataGreen = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "landuse_green"
//                 );
//                 const dataParking = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "landuse_parking"
//                 );
//                 const dataPoints = originalData.features.filter(
//                     (feature: any) => feature.properties["metric"] === "points"
//                 );
//                 const dataEstablishments = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "establishments"
//                 );
//                 const dataBuildings = originalData.features.filter(
//                     (feature: any) =>
//                         feature.properties["metric"] === "landuse_building"
//                 );

//                 const dataSections = [
//                     dataPark,
//                     dataEquipment,
//                     dataGreen,
//                     dataPark,
//                     dataEquipment,
//                     dataParking,
//                     dataPoints,
//                 ];
//                 const layers: any = {};

//                 layers["lens-lots"] = new GeoJsonLayer({
//                     id: "lens-lots",
//                     data: lensLots,
//                     filled: true,
//                     wireframe: false,
//                     getLineWidth: 0,
//                     getFillColor: colorFunction,
//                 });

//                 dataSections.forEach((section, index) => {
//                     const layer = new GeoJsonLayer({
//                         id: "lens-" + index,
//                         data: section,
//                         filled: true,
//                         wireframe: false,
//                         getLineWidth: 0,
//                         getFillColor: (d: any) => {
//                             return (
//                                 METRIC_COLOR[d.properties?.metric] || [
//                                     255, 0, 0,
//                                 ]
//                             );
//                         },
//                     });

//                     layers["lens-" + index] = layer;
//                 });

//                 setViewLayers({
//                     ...viewLayers,
//                     ...layers,
//                 });

//                 dispatch(setSelectedLots(idsFromCircle));
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//         if (viewMode == VIEW_MODES.LENS) {
//             fetchData();
//         }
//     }, [circleCoords]);

//     useEffect(() => {
//         setViewLayers({});
//         setCircleCoords([-107.39367959923534, 24.753450686162093]);
//         dispatch(setSelectedLots([]));
//     }, [viewMode]);

//     const handleEdit2 = ({ updatedData, editType, editContext }: any) => {
//         if (
//             editType === "addFeature" ||
//             editType === "finishMovePosition" ||
//             editType === "finish"
//         ) {
//             const selectedArea = updatedData.features[0];

//             fetch("http://127.0.0.1:8000/poligon", {
//                 method: "POST",
//                 body: JSON.stringify({
//                     coordinates: selectedArea.geometry.coordinates[0],
//                 }),
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }).then(async (response) => {
//                 if (response) {
//                     const arrayBuffer = await response.arrayBuffer();
//                     const data = await load(arrayBuffer, FlatGeobufLoader);

//                     let colorLayer = new GeoJsonLayer({
//                         id: "color-layer",
//                         data: data,
//                         filled: true,
//                         wireframe: false,
//                         getLineWidth: 0,
//                         getFillColor: colorFunction,
//                     });
//                     const idsFromCircle = data.features.map(
//                         (feature: any) => feature.properties.ID
//                     );

//                     setViewLayers({ ...viewLayers, colorLayer });
//                     dispatch(setSelectedLots(idsFromCircle));
//                 }
//             });

//             setViewLayers(() => {
//                 let editableLayer = viewLayers["editableLayer1"];
//                 viewLayers["editableLayer1"] = new EditableGeoJsonLayer({
//                     ...editableLayer.props,
//                     id: editableLayer.id,
//                     mode: new ViewMode(),
//                 });

//                 return viewLayers;
//             });
//         }
//     };
//     //VIEW MODE LAYERS
//     useEffect(() => {
//         switch (viewMode) {
//             case VIEW_MODES.FULL:
//                 break;

//             case VIEW_MODES.POLIGON:
//                 const layerId = "editableLayer1";
//                 let drawLayer = new EditableGeoJsonLayer({
//                     id: layerId,
//                     data: { type: "FeatureCollection", features: [] },
//                     mode: new DrawPolygonMode(),
//                     selectedFeatureIndexes: [0],
//                     onEdit: handleEdit2,
//                     pickable: true,
//                     getTentativeFillColor: [255, 255, 255, 50],
//                     getFillColor: [0, 0, 0, 100],
//                     getTentativeLineColor: [0, 0, 255, 200],
//                     getLineColor: [0, 0, 255, 200],
//                 });

//                 setViewLayers({
//                     [layerId]: drawLayer,
//                 });

//                 break;

//             case VIEW_MODES.LENS:
//                 const circleLayer = new GeoJsonLayer({
//                     key: "circle-layer",
//                     id: "circle",
//                     data: turf.circle(circleCoords, brushingRadius, {
//                         units: "meters",
//                     }),
//                     filled: true,
//                     getFillColor: [0, 120, 0, 25],
//                     getLineColor: [0, 120, 0, 255],
//                     getLineWidth: 5,
//                     pickable: true,
//                     onDragStart: () => {
//                         setIsDrag(true);
//                     },
//                     onDrag: (info, event) => {
//                         if (info && info.coordinate)
//                             setCircleCoords([
//                                 info.coordinate[0],
//                                 info.coordinate[1],
//                             ]);
//                     },
//                     onDragEnd: (info, event) => {
//                         setIsDrag(false);
//                         debouncedHover(info);
//                     },
//                 });

//                 setViewLayers({
//                     circle: circleLayer,
//                 });

//                 break;
//         }
//     }, [viewMode, circleCoords]);

//     //END TODO

//     useEffect(() => {
//         async function updateProject() {
//             await axios.get(`${API_URL}/project/${project}`);
//             const coords = await axios.get(`${API_URL}/coords`);
//             setCoords(coords.data);
//         }
//         updateProject();
//     }, [project]);

//     useEffect(() => {
//         if (queryMetric && dataLots) {
//             axios
//                 .post(`${API_URL}/query`, {
//                     metric: queryMetric,
//                     // condition: configuration.condition,
//                     // accessibility_info: configuration.accessibility_info,
//                     accessibility_info: proximityOptions,
//                 })
//                 .then((response) => {
//                     if (response && response.data) {
//                         const queryDataByProductId: GenericObject = {};

//                         response.data.forEach((data: any) => {
//                             queryDataByProductId[data["ID"]] = data["value"];
//                         });

//                         setQueryData(queryDataByProductId);
//                     }
//                 });
//         }
//     }, [queryMetric, dataLots, proximityOptions]);

//     useEffect(() => {
//         if (queryData && Object.keys(queryData).length) {
//             const values = Object.values(queryData);
//             const domain = [Math.min(...values), Math.max(...values)];
//             const lightColor = lightenColor(baseColor, 0.3);
//             const colors = d3.quantize(
//                 d3.interpolateRgb(
//                     `rgba(${lightColor.join(",")})`,
//                     `rgba(${baseColor.join(",")})`
//                 ),
//                 8
//             );

//             const quantiles = d3
//                 .scaleQuantize<string>()
//                 .domain(domain)
//                 .range(colors);

//             const myFunc =
//                 () =>
//                 (d: any): RGBAColor => {
//                     if (!d) {
//                         return baseColor;
//                     }

//                     const colorString = quantiles(
//                         queryData[d.properties["ID"]]
//                     );
//                     const color = d3.color(colorString)?.rgb();
//                     return color
//                         ? [color.r, color.g, color.b]
//                         : [255, 255, 255];
//                 };

//             setColorFunction(myFunc);
//         }
//     }, [queryData, viewMode]);

//     useEffect(() => {
//         if (dataLots && colorFunction) {
//             const layer = new GeoJsonLayer({
//                 key: "lots-layer",
//                 id: "lots-layer",
//                 data: dataLots.features.filter((d: any) => {
//                     if (baseColor && viewMode != null) return true;
//                 }),
//                 filled: true,
//                 getLineWidth: 0,
//                 pickable: true,
//                 autoHighlight: true,
//                 getPosition: (d: any) => d.position,
//                 opacity: isSatellite ? 0.4 : 1,
//                 highlightColor: baseColor,
//                 getFillColor:
//                     viewMode == VIEW_MODES.FULL
//                         ? colorFunction
//                         : [215, 215, 215],
//             });

//             setLotsLayer(layer);
//         }
//     }, [dataLots, colorFunction, baseColor]);

//     const poligonLayer = new GeoJsonLayer({
//         id: "poligono-layer",
//         data: poligono,
//         filled: true,
//         getFillColor: [0, 0, 0, 0],
//         getLineColor: [255, 0, 0, 255],
//         getLineWidth: 10,
//     });

//     if (!coords) {
//         return <div>Loading</div>;
//     }

//     return (
//         //@ts-ignore
//         <DeckGL
//             initialViewState={{
//                 ...INITIAL_STATE,
//                 latitude: coords["latitud"],
//                 longitude: coords["longitud"],
//             }}
//             controller={{ dragPan: !isDrag }}
//             layers={[poligonLayer, lotsLayer, ...Object.values(viewLayers)]}
//         >
//             <Map
//                 mapStyle={
//                     isSatellite
//                         ? "mapbox://styles/mapbox/satellite-v9"
//                         : "mapbox://styles/lameouchi/clw841tdm00io01ox4vczgtkl"
//                 }
//                 mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
//                 attributionControl={false}
//             />
//         </DeckGL>
//     );
// };

export default BaseMap;
