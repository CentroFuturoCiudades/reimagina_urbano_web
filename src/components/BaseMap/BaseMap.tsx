import React, { useCallback, useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { Map } from "react-map-gl";
import { INITIAL_COORDS, INITIAL_STATE } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { debounce } from "lodash";
import { Layers, Legend } from "../index";
import { setViewState } from "../../features/viewState/viewStateSlice";
import "./BaseMap.scss";
import _ from "lodash";
import { Spinner } from "@chakra-ui/react";
import { setCoordsState } from "../../features/viewMode/viewModeSlice";
import { zoom } from "d3";
import axios from "axios";

interface BaseMapProps {
    isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const [localViewState, setLocalViewState] = useState<any>(INITIAL_STATE);

    const isLoading = useSelector((state: RootState) => state.viewMode.isLoading );
    const [initialCoords, setInitialCoords] = useState<any>(null);


    const { layers } = Layers();

    //Redux
    const dispatch: AppDispatch = useDispatch();

    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewState = useSelector((state: RootState) => state.viewState);

    useEffect( ()=> {
        const project = window.location.pathname.split("/")[1];


        axios.get(`${process.env.REACT_APP_API_URL}/coords?project=${project}` )
        .then( response => {
            if( response && response.data ){
                setInitialCoords( response.data );
                dispatch( setCoordsState( response.data ));
            }
        })

    }, [])

    useEffect(() => {

        if( !localViewState.latitude ){
            setLocalViewState({
                ...localViewState,
                ...initialCoords,
                zoom: viewState.zoom,
            });
        } else {
            setLocalViewState({
                ...localViewState,
                zoom: viewState.zoom,
            });
        }
    }, [viewState, initialCoords]);

    useEffect(() => {
        dispatch(
            setViewState({
                zoom: localViewState.zoom,
            })
        );
    }, [localViewState.zoom]);

    const handleViewStateChange = useCallback(
        debounce(({ viewState }) => {
            setLocalViewState(viewState);
        }, 5),
        []
    );

    if( !localViewState.latitude ){
        return <></>
    }

    return (
        <>
            { isLoading &&
                <div className="loading-container">
                    {/* <div className="spinner"></div> */}
                    <Spinner
                        thickness='6px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='gray.500'
                        size='xl'
                    />
                    <div className="loading-text">Cargando...</div>
                </div>
            }
            {/* @ts-ignore */}
            <DeckGL
                onWebGLInitialized={ (gl) => {
                    gl.canvas.addEventListener('webglcontextlost', (event) => {
                      event.preventDefault();
                      console.log('WebGL context lost');
                    });
                    gl.canvas.addEventListener('webglcontextrestored', () => {
                      console.log('WebGL context restored');
                    });
                  }}
                initialViewState={ localViewState }
                controller={{ dragPan: !isDrag }}
                layers={layers}
                viewState={{ ...localViewState }}
                onViewStateChange={handleViewStateChange}
                getTooltip={({ object }: any): any => {
                    if (!object || !object.properties.amenity) return null;
                    return {
                        html: `<div>
                            <p><b>Nombre:</b> ${_.capitalize(object.properties.name)}</p>
                            <p><b>Categoría:</b> ${object.properties.amenity}</p>
                            ${object.properties.visits_category ? `<p><b>Visitas (estimadas por datos celular):</b> ${object.properties.visits_category}</p>` : ''}
                            ${object.properties.opportunities_ratio ? `<p><b>Población potencialmente atendida:</b> ${Math.round(100 / object.properties.opportunities_ratio).toLocaleString()}%</p>` : ''}
                            ${object.properties.attraction ? `<p><b>Capacidad estimada:</b> ${Math.round(object.properties.attraction).toLocaleString()}</p>` : ''}
                            ${object.properties.pob_reach ? `<p><b>Población Alcance:</b> ${Math.round(object.properties.pob_reach).toLocaleString()}</p>` : ''}
                        </div>`
                };
                }}
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
            <Legend />
        </>
    );
};

export default BaseMap;
