import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { formatNumber, INITIAL_COORDS, INITIAL_STATE } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Layers, Legend } from "../index";
import "./BaseMap.scss";
import { Spinner } from "@chakra-ui/react";
import { setCoordsState } from "../../features/viewMode/viewModeSlice";
import axios from "axios";
import { FlyToInterpolator, ViewStateChangeParameters } from "@deck.gl/core";
import { setViewState } from "../../features/viewState/viewStateSlice";
import _, { throttle } from "lodash";

interface BaseMapProps {
    isSatellite?: boolean;
}

const getTooltip = ({ object }: any): any => {
    if (!object) return null;
    if (object.properties && object.properties.NOM_COL) {
        return {
            html: `<div>
                <p style="font-size:14px"><b>Colonia:</b> ${object.properties.NOM_COL}</p>
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
    }
    if (!object || !object.properties || !object.properties.amenity)
        return null;
    const visitsColor =
        object.properties.visits_category === "Baja"
            ? "lightcoral"
            : object.properties.visits_category === "Media"
            ? "orange"
            : "lightgreen";
    const ratioOpportunities = 100 / object.properties.opportunities_ratio;
    const opportunitiesColor =
        ratioOpportunities <= 30 || ratioOpportunities > 500
            ? "lightcoral"
            : ratioOpportunities > 50 && ratioOpportunities <= 200
            ? "green"
            : "orange";
    const opportunitiesTitle =
        ratioOpportunities > 500
            ? "Saturado"
            : ratioOpportunities < 30
            ? "Sub-utilizado"
            : "Adecuado";
    const opportunitiesValue =
        ratioOpportunities > 100
            ? ratioOpportunities / 100
            : 100 / ratioOpportunities;
    return {
        html: `<div>
            <p style="font-size:18px"><b>${object.properties.amenity}</b></p>
            <p style="font-size:16px">${_.capitalize(
                object.properties.name
            )}</p>
            ${
                object.properties.visits_category
                    ? `
                        <p style="font-size:12px">
                            Afluencia de Visitantes:
                        </p>
                        <p>
                            <div style="background-color: ${visitsColor}; border-radius: 50%; width: 8px; height: 8px; display: inline-block;">
                            </div>
                            <span style="font-size:16px">
                                <b>${object.properties.visits_category}</b>
                            </span>
                        </p>`
                    : ""
            }
            ${
                object.properties.opportunities_ratio
                    ? `
                        <p style="font-size:12px">
                            Uso Potencial del Equipamiento
                        </p>
                        <p>
                            <div style="background-color: ${opportunitiesColor}; border-radius: 50%; width: 8px; height: 8px; display: inline-block;">
                            </div>
                            <span style="font-size:16px">
                                <b>${opportunitiesTitle}</b>
                            </span>
                            <br>
                            <span style="font-size:14px">
                                <b>
                                    ${formatNumber(opportunitiesValue)}x más ${
                          ratioOpportunities > 100 ? "demanda" : "capacidad"
                      }
                                </b>
                            </span>
                        </p>`
                    : ""
            }
            ${
                object.properties.pob_reach
                    ? `
                    <p style="font-size:12px">Alcance potencial a pie</p>
                    <p style="font-size:16px">
                        <b>
                            ${formatNumber(
                                object.properties.pob_reach
                            )} habitantes
                        </b>
                    </p>`
                    : ""
            }
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
};

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const dispatch: AppDispatch = useDispatch();
    const isLoading = useSelector(
        (state: RootState) => state.viewMode.isLoading
    );
    const viewState = useSelector(
        (state: RootState) => state.viewState.viewState
    );
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const project = useSelector((state: RootState) => state.viewMode.project);
    const [localViewState, setLocalViewState] = useState<any>(viewState);

    const { layers } = Layers();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/coords?project=${project}`
            );
            if (data) {
                dispatch(setCoordsState(data));
                setLocalViewState({
                    ...INITIAL_STATE,
                    latitude: INITIAL_COORDS[project].latitude,
                    longitude: INITIAL_COORDS[project].longitude,
                    zoom: INITIAL_COORDS[project].zoom,
                });
            }
        };
        fetchData();
    }, [project, dispatch]);


    useEffect(() => {
        if (localViewState) {
            dispatch(setViewState(localViewState));
        }
    }, [localViewState]);

    if (!localViewState?.latitude) {
        return null;
    }

    return (
        <>
            {isLoading && (
                <div className="loading-container">
                    <Spinner
                        thickness="6px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="gray.500"
                        size="xl"
                    />
                    <div className="loading-text">Cargando...</div>
                </div>
            )}
            <DeckGL
                controller={{ dragPan: !isDrag }}
                layers={layers}
                viewState={{...viewState}}
                onViewStateChange={(e: any) => {
                    setLocalViewState(e.viewState);
                    console.log(e);
                    if (!e.interactionState.isZooming && !e.interactionState.isPanning) {
                        if (e.oldViewState.zoom.toFixed(0) !== e.viewState.zoom.toFixed(0)) {
                            dispatch(setViewState({...e.viewState}));
                        }
                    }
                }}
                getTooltip={getTooltip}
            >
                <Map
                    reuseMaps
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
