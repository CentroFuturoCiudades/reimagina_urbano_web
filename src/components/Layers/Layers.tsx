import React, { useCallback, useEffect, useState } from "react";
import * as LayersMapping from "../../layers/index";
import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setLayers } from "../../features/layers/layersSlice";
import PopulationPointsLayer from "../../layers/PopulationPointsLayer";
import { VIEW_MODES } from "../../constants";
import * as turf from "@turf/turf";
import { debounce } from "lodash";
import { Layer, PickInfo } from "deck.gl";
import { setCoords, setDrag } from "../../features/lensSettings/lensSettingsSlice";

const Layers = () => {
    const dispatch: AppDispatch = useDispatch();

    const [ toolLayers, setToolLayers ] = useState<any>([]);

    const selectedLots = useSelector( (state: RootState) => state.selectedLots.selectedLots );

    //LENS PROPS
    const viewMode = useSelector( (state: RootState) => state.viewMode.viewMode );
    const circleCoords = useSelector( (state: RootState) => state.lensSettings.coords );
    const brushingRadius = useSelector( (state: RootState) => state.lensSettings.brushingRadius );
    const isDrag = useSelector( (state: RootState) => state.lensSettings.isDrag );

    const handleHover = useCallback((info: PickInfo<unknown>) => {
        if (info && info.coordinate) {
            dispatch( setCoords([info.coordinate[0], info.coordinate[1]]) );
        } else {
            dispatch( setCoords( [0, 0] ) );
        }
      }, []);
    const debouncedHover = useCallback(debounce(handleHover, 100), [handleHover]);


    useEffect(()=> {

        switch( viewMode ){
            case VIEW_MODES.FULL:
                dispatch( setLayers( [] ))
                break;

            case VIEW_MODES.LENS:
                const circleLayer = {
                    key:"circle-layer",
                    id:"circle",
                    data: turf.circle(circleCoords, brushingRadius, { units: "meters" }),
                    filled: true,
                    getFillColor: [0, 120, 0, 25],
                    getLineColor: [0, 120, 0, 255],
                    getLineWidth: 5,
                    pickable: true,
                    onDragStart: () => { dispatch( setDrag( true ) ) },
                    onDrag: (info: any, _: any) => { if(info && info.coordinate) dispatch( setCoords([info.coordinate[0], info.coordinate[1]]) ); },
                    onDragEnd: (info: any, _: any) => {
                        dispatch( setDrag( false ) )
                        debouncedHover(info);
                    }
                }

                setToolLayers( [ circleLayer ] )

                break;
        }

    }, [ viewMode, circleCoords ])

    useEffect(() => {

        const fetchData = async () => {
            dispatch(
                setLayers([
                    ...toolLayers,
                    ...await LayersMapping.PopulationPoints( { viewMode: viewMode ,coords: circleCoords, radius: brushingRadius } ),
                    ...await LayersMapping.AmenitiesLayer()
                ])
             );
        };

        if(!isDrag){
            fetchData();
        } else {
            dispatch(
                setLayers( toolLayers )
            )
        }

    }, [ circleCoords, toolLayers ]);


    return <></>
};

export default Layers;
