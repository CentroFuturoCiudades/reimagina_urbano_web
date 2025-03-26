import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import Map from "react-map-gl";
import { formatNumber, INITIAL_COORDS, INITIAL_STATE } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Layers, Legend } from "../index";
import "./BaseMap.scss";
import { Spinner } from "@chakra-ui/react";
import { setCoordsState } from "../../features/viewMode/viewModeSlice";
import axios from "axios";
import { setViewState } from "../../features/viewState/viewStateSlice";
import _ from "lodash";
import { clearSelectedAmenity } from "../../features/accessibilityList/accessibilityListSlice";

const getTooltip = ({ object }: any): any => {
    if (!object) return null;
    if (object.properties && object.properties.NOM_COL) {
        return {
            html: `<div>
                <p style="font-size:min(2.2vh, 1.1vw)">
                    <b>Colonia:</b> ${_.startCase(_.toLower(object.properties.NOM_COL))}
                </p>
            </div>`,
            style: {
                backgroundColor: "white",
                color: "#333",
                borderRadius: "min(1.2vh, 0.6vw)",
                borderWidth: "min(0.2vh, 0.1vw)",
                padding: "min(0.8vh, 0.4vw)",
                boxShadow: "0 0 1px rgba(0,0,0,0.1)",
            },
        };
    }
    if (!object || !object.properties || !object.properties.amenity) return null;
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
        ratioOpportunities > 500 ? "Saturado" : ratioOpportunities < 30 ? "Sub-utilizado" : "Adecuado";
    const opportunitiesValue = ratioOpportunities > 100 ? ratioOpportunities / 100 : 100 / ratioOpportunities;
    return {
        html: `<div>
            <p style="font-size:min(2.4vh, 1.2vw)">
                <b>${object.properties.amenity}</b>
            </p>
            <p style="font-size:min(2.2vh, 1.1vw)">
                ${_.capitalize(object.properties.name)}
            </p>
            ${object.properties.visits_category
                ? `
                        <p style="font-size:min(1.8vh, 0.9vw)">
                            Afluencia de Visitantes
                        </p>
                        <p>
                            <div style="background-color: ${visitsColor}; border-radius: 50%; display: inline-block; width: min(1.2vh, 0.6vw); height: min(1.2vh, 0.6vw); padding: 0px">
                            </div>
                            <span style="font-size:min(2.2vh, 1.1vw)">
                                <b>${object.properties.visits_category}</b>
                            </span>
                        </p>`
                : ""
            }
            ${object.properties.opportunities_ratio
                ? `
                        <p style="font-size:min(1.8vh, 0.9vw)">
                            Uso Potencial del Equipamiento
                        </p>
                        <p>
                            <div style="background-color: ${opportunitiesColor}; border-radius: 50%; display: inline-block; width: min(1.2vh, 0.6vw); height: min(1.2vh, 0.6vw);">
                            </div>
                            <span style="font-size:min(2.2vh, 1.1vw)">
                                <b>${opportunitiesTitle}</b>
                            </span>
                            <span style="font-size:min(1.8vh, 0.9vw)">
                                <b>
                                    (${formatNumber(opportunitiesValue)}x más ${ratioOpportunities > 100 ? "demanda" : "capacidad"
                })
                                </b>
                            </span>
                        </p>`
                : ""
            }
            ${object.properties.pob_reach
                ? `
                    <p style="font-size:min(1.8vh, 0.9vw)">
                        Alcance potencial a pie
                    </p>
                    <p style="font-size:min(2.2vh, 1.1vw)">
                        <b>
                            ${formatNumber(object.properties.pob_reach)} habitantes
                        </b>
                    </p>`
                : ""
            }
        </div>`,
        style: {
            backgroundColor: "white",
            color: "#333",
            borderRadius: "min(1.2vh, 0.6vw)",
            borderWidth: "min(0.2vh, 0.1vw)",
            padding: "min(1.2vh, 0.6vw)",
            boxShadow: "0 0 1px rgba(0,0,0,0.1)",
        },
    };
};

const BaseMap = () => {
    const dispatch: AppDispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.viewMode.isLoading);
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const project = useSelector((state: RootState) => state.viewMode.project);
    const isSatellite = useSelector((state: RootState) => state.viewMode.isSatellite);
    const selectedAmenity = useSelector((state: RootState) => state.accessibilityList.selectedAmenity);
    const [localViewState, setLocalViewState] = useState<any>(viewState);

    const { layers } = Layers();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/coords?project=${project}`);
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
    }, [localViewState, dispatch]);

    if (!localViewState?.latitude) {
        return null;
    }

    return (
        <>
            {isLoading && (
                <div className="loading-container">
                    <Spinner
                        thickness="min(1vh, 0.5vw)"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="gray.500"
                        height="min(7vh, 3.5vw)"
                        width="min(7vh, 3.5vw)"
                    />
                    <div className="loading-text">Cargando...</div>
                </div>
            )}
            {/* @ts-ignore */}
            <DeckGL
                controller={{ dragPan: !isDrag }}
                layers={layers}
                viewState={{ ...viewState }}
                onViewStateChange={(e: any) => {
                    setLocalViewState(e.viewState);
                    if (!e.interactionState.isZooming && !e.interactionState.isPanning) {
                        if (e.oldViewState.zoom.toFixed(0) !== e.viewState.zoom.toFixed(0)) {
                            dispatch(setViewState({ ...e.viewState }));
                        }
                    }
                }}
                getTooltip={getTooltip}
                onClick={(info: any) => {
                    // If there's a selected amenity and we click on empty space, clear the selection
                    if (selectedAmenity && !info.object) {
                        dispatch(clearSelectedAmenity());
                    }
                }}
            >
                <Map
                    reuseMaps
                    {...viewState}
                    mapStyle={
                        isSatellite
                            ? "mapbox://styles/mapbox/satellite-v9"
                            : "mapbox://styles/lameouchi/clw841tdm00io01ox4vczgtkl"
                    }
                    mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
                    attributionControl={false}
                />
            </DeckGL>
            {!isLoading && <Legend />}
        </>
    );
};

export default BaseMap;
