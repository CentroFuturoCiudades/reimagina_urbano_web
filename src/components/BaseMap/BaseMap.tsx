import React, { useCallback, useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { Map } from "react-map-gl";
import { formatNumber, INITIAL_COORDS, INITIAL_STATE } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { debounce } from "lodash";
import { Layers, Legend } from "../index";
import { setViewState } from "../../features/viewState/viewStateSlice";
import "./BaseMap.scss";
import _ from "lodash";
import { border, Spinner } from "@chakra-ui/react";
import { setCoordsState, setProject, setProjectCoords } from "../../features/viewMode/viewModeSlice";
import { zoom } from "d3";
import axios from "axios";

interface BaseMapProps {
    isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const [localViewState, setLocalViewState] = useState<any>(INITIAL_STATE);

    const isLoading = useSelector((state: RootState) => state.viewMode.isLoading );
    const projectCoords = useSelector((state: RootState) => state.viewMode.projectCoords);
    const coords = useSelector((state: RootState) => state.viewMode.coords);

    const { layers } = Layers();

    //Redux
    const dispatch: AppDispatch = useDispatch();

    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewState = useSelector((state: RootState) => state.viewState);
    const project = useSelector((state: RootState) => state.viewMode.project);

    useEffect(()=> {
        const fetchData = async () => {
            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/coords?project=${project}` )
            if(data){
                dispatch(setProjectCoords(data));
                dispatch(setCoordsState(data));
            }
        }
        fetchData();
    }, [project])

    useEffect(() => {

        if( !localViewState.latitude ){
            setLocalViewState({
                ...localViewState,
                ...projectCoords,
                zoom: viewState.zoom,
            });
        } else {
            setLocalViewState({
                ...localViewState,
                zoom: viewState.zoom,
            });
        }
    }, [viewState, projectCoords]);

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
                            <p style="font-size:18px"><b>${object.properties.amenity}</b></p>
                            <p style="font-size:16px">${_.capitalize(object.properties.name)}</p>
                            ${object.properties.visits_category ? `<p style="font-size:12px">Visitas (estimadas por datos celular):</p><p style="font-size:14px"><b>${object.properties.visits_category}</b></p>` : ''}
                            ${object.properties.opportunities_ratio ? 
                                `<p style="font-size:12px">Uso Potencial del Equipamiento</p><p style="font-size:14px"><b>${formatNumber(100 / object.properties.opportunities_ratio)}%</b></p>` : ''}
                            ${object.properties.attraction ?
                                `<p style="font-size:12px">Demanda estimada</p><p style="font-size:14px"><b>${formatNumber(object.properties.attraction)} visitas</b></p>` : ''}
                            ${object.properties.pob_reach ? 
                                `<p style="font-size:12px">Alcance potencial a pie</p><p style="font-size:14px"><b>${formatNumber(object.properties.pob_reach)} habitantes</b></p>` : ''}
                        </div>`,
                        style: {
                            backgroundColor: "white",
                            color: "#333",
                            borderRadius: "10px",
                            borderWidth: "1px",
                            padding: "8px",
                            boxShadow: "0 0 1px rgba(0,0,0,0.1)",
                        },
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
