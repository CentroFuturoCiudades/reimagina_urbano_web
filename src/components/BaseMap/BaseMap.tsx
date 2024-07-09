import React, { useCallback, useEffect, useState } from 'react';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { lightenColor, useFetch, useFetchGeo } from '../../utils';
import { API_URL, BLOB_URL, INITIAL_STATE } from '../../constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import * as d3 from "d3";
import { GenericObject } from '../../types';
import { PickInfo, RGBAColor } from 'deck.gl';
import * as turf from "@turf/turf";
import { debounce } from 'lodash';
import { load } from '@loaders.gl/core';
import { FlatGeobufLoader } from '@loaders.gl/flatgeobuf';

interface BaseMapProps {
  isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ( { isSatellite } : BaseMapProps) => {

    const project = window.location.pathname.split("/")[1];
    const [ coords, setCoords ] = useState();
    const [ lotsLayer, setLotsLayer ] = useState< any >( null );
    const [ colorFunction, setColorFunction ] = useState< ( arg0: any) => RGBAColor >();

    const { data: poligono } = useFetch(`${BLOB_URL}/${project}/bounds.geojson`);
    const { data: dataLots } = useFetchGeo(`${BLOB_URL}/${project}/lots.fgb`) as any;

    //Redux
    const baseColor = useSelector((state: RootState) => state.baseColor.baseColor );
    const queryMetric = useSelector( (state: RootState) => state.queryMetric.queryMetric );
    const viewMode = useSelector( (state: RootState) => state.viewMode.viewMode );
    const proximityOptions: GenericObject = useSelector((state: RootState) => state.accSettings.accSettings );

    //TODO: MOVE THIS TO A COMPONENT
    const [ circleCoords, setCircleCoords ] = useState([-107.39367959923534, 24.753450686162093]);
    const [isDrag, setIsDrag] = useState(false);
    const [brushingRadius, setBrushingRadius] = useState(400); //radio esta en metros

    const handleHover = useCallback((info: PickInfo<unknown>) => {
        if (info && info.coordinate) {
            setCircleCoords([info.coordinate[0], info.coordinate[1]]);
        } else {
            setCircleCoords( [] );
        }
      }, []);

    const debouncedHover = useCallback(debounce(handleHover, 100), [handleHover]);
    let abortController = new AbortController();

    const [ viewLayers, setViewLayers ] = useState<any>({});

    useEffect(() => {
        async function fetchData() {
            if (!circleCoords) {
                return;
            }

            if( isDrag ){
                return;
            }

            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();
            const lat = circleCoords[1];
            const lon = circleCoords[0];
            const params = new URLSearchParams({
                lat: lat.toString(),
                lon: lon.toString(),
                radius: brushingRadius.toString(),
            });
            const metricsMapping = {
                park: "landuse_park",
                parking: "landuse_parking",
                green: "landuse_green",
                equipment: "landuse_equipment",
                establishments: "establishments",
                building: "landuse_building",
            };
          // use visible to show or not the metrics
        //   Object.keys(visible)
        //     .filter((metric) => visible[metric] && metricsMapping[metric])
        //     .forEach((metric) => params.append("metrics", metricsMapping[metric]));

            Object.values(metricsMapping).forEach((metric) => params.append("metrics", metric ));
            const url = `http://127.0.0.1:8000/lens?${params.toString()}`;
            try {
                const response = await fetch(url, { signal: abortController.signal });
                const arrayBuffer = await response.arrayBuffer();
                const data = await load(arrayBuffer, FlatGeobufLoader);
                const idsFromCircle = data.features.map((feature: any) => feature.properties.ID);
                //setSelectedLots(idsFromCircle);
                //setOriginalData(data);

                let originalData = data;

                const METRIC_COLOR: GenericObject = {
                    landuse_parking: [120, 120, 120, 255],
                    landuse_equipment: [180, 0, 180, 255],
                    landuse_green: [160, 200, 160, 255],
                    landuse_park:[0, 130, 0, 255],
                    establishments: [0, 255, 0, 255],
                    landuse_building: [255, 255, 0, 255],
                }

                const dataLots = originalData.features.filter(
                    (feature: any) => feature.properties["metric"] === "lots"
                  );
                const dataPark = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "landuse_park"
                );
                const dataEquipment = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "landuse_equipment"
                );
                const dataGreen = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "landuse_green"
                );
                const dataParking = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "landuse_parking"
                );
                const dataEstablishments = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "establishments"
                );
                const dataBuildings = originalData.features.filter(
                (feature: any) => feature.properties["metric"] === "landuse_building"
                );

                const dataSections = [ dataPark, dataEquipment, dataGreen, dataPark, dataEquipment ]

                const layers: any = {}

                dataSections.forEach( (section, index) => {
                    const layer = new GeoJsonLayer({
                        id: "lens-"+index,
                        data: section,
                        filled: true,
                        wireframe: false,
                        getLineWidth: 0,
                        getFillColor: (d: any)=>{ return  METRIC_COLOR[d.properties?.metric] || [255,0,0]}
                    })

                    layers["lens-"+index] = layer;

                } )

                setViewLayers(
                    {
                        ...viewLayers,
                         ...layers
                    });

            } catch (error) {
                console.error(error);
            }
        }
        if( viewMode == "lens"){
            fetchData();
        }
    }, [ circleCoords ]);

    useEffect( ()=>{
       setViewLayers( [] );
       setCircleCoords( [-107.39367959923534, 24.753450686162093] );
    }, [viewMode])

    useEffect( ()=>{
        switch( viewMode ){
            case "full":
                break;

            case "lens":
                const circleLayer = new GeoJsonLayer({
                    key:"circle-layer",
                    id:"circle",
                    data: turf.circle(circleCoords, brushingRadius, { units: "meters" }),
                    filled: true,
                    getFillColor: [0, 120, 0, 25],
                    getLineColor: [0, 120, 0, 255],
                    getLineWidth: 5,
                    pickable: true,
                    onDragStart: () => { setIsDrag(true) },
                    onDrag: (info, event) => { if(info && info.coordinate) setCircleCoords( [info.coordinate[0], info.coordinate[1]] ) },
                    onDragEnd: (info, event) => {
                      setIsDrag(false)
                      debouncedHover(info);
                    }
                })

                setViewLayers(
                    {...viewLayers,
                        circle: circleLayer
                    });

                break;
        }
    }, [ viewMode, circleCoords ] )

    //END TODO

    useEffect(() => {
        async function updateProject() {
          await axios.get(`${API_URL}/project/${project}`);
          const coords = await axios.get(`${API_URL}/coords`);
          setCoords(coords.data);
        }
        updateProject();
    }, [project]);


    useEffect(()=> {
        if( queryMetric && dataLots ){
            axios.post(`${API_URL}/query`, {
                metric: queryMetric,
                // condition: configuration.condition,
                // accessibility_info: configuration.accessibility_info,
                accessibility_info: proximityOptions
            })
            .then( response => {
                if( response && response.data ){

                    const queryDataByProductId: GenericObject = {}

                    response.data.forEach( (data: any)=> {
                        queryDataByProductId[ data["ID"] ] = data["value"];
                    });

                    const values = Object.values( queryDataByProductId );
                    const domain = [ Math.min(...values), Math.max(...values) ];
                    const lightColor = lightenColor( baseColor, 0.3 )
                    const colors = d3.quantize(d3.interpolateRgb(
                        `rgba(${lightColor.join(",")})`, `rgba(${baseColor.join(",")})`)
                        , 8
                    );

                    const quantiles = d3.scaleQuantize<string>().domain(domain).range(colors);

                    const myFunc = () => (d: any): RGBAColor => {

                        if( !d ){
                            return baseColor;
                        }

                        const colorString = quantiles(queryDataByProductId[d.properties["ID"]]);
                        const color = d3.color(colorString)?.rgb();
                        return color ? [color.r, color.g, color.b] : [255, 255, 255];
                    };

                    setColorFunction( myFunc );
                }
            })
        }
    }, [queryMetric, dataLots, proximityOptions])

    useEffect( () => {
        if( dataLots && colorFunction ){
            const layer =
                new GeoJsonLayer({
                    key: "lots-layer",
                    id: 'lots-layer',
                    data: dataLots.features.filter( (d:any) => {
                        if( baseColor )
                          return true}),
                    filled: true,
                    getLineWidth: 0,
                    pickable: true,
                    autoHighlight: true,
                    getPosition: (d: any) => d.position,
                    opacity: isSatellite ? 0.4 : 1,
                    highlightColor: baseColor,
                    getFillColor: colorFunction
                })

            setLotsLayer( layer )
        }
    }, [dataLots, colorFunction, baseColor] );

    const poligonLayer =
        new GeoJsonLayer({
            id: 'poligono-layer',
            data: poligono,
            filled: true,
            getFillColor: [0, 0, 0, 0],
            getLineColor: [255, 0, 0, 255],
            getLineWidth: 10,
        });

    if (!coords) {
        return <div>Loading</div>;
    }

    return (
        //@ts-ignore
        <DeckGL
            initialViewState={{
                ...INITIAL_STATE,
                latitude: coords["latitud"],
                longitude: coords["longitud"]
            }}
            controller={{ dragPan: !isDrag }}
            layers={ [ poligonLayer, lotsLayer, ...Object.values(viewLayers) ]}
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

export default BaseMap;
