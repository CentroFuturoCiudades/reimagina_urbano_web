import React, { useCallback, useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import { useFetchGeo } from "../../utils";
import { INITIAL_STATE } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { debounce } from "lodash";
import { Layers, Legend } from "../index";
import { setViewState } from "../../features/viewState/viewStateSlice";
import "./BaseMap.scss";
import _ from "lodash";
import { Spinner } from "@chakra-ui/react";

interface BaseMapProps {
    isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const [localViewState, setLocalViewState] = useState(INITIAL_STATE);

    const isLoading = useSelector((state: RootState) => state.viewMode.isLoading );

    const { data: poligono } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/bounds`
    );
    const { data: colonias } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/colonias`
    );

    const { layers } = Layers();

    //Redux
    const dispatch: AppDispatch = useDispatch();

    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewState = useSelector((state: RootState) => state.viewState);

    useEffect(() => {
        setLocalViewState({
            ...localViewState,
            zoom: viewState.zoom,
        });
    }, [viewState]);

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

    //LAYER THAT MARKS THE LIMIT OF THE POLIGON
    const poligonLayer = new GeoJsonLayer({
        id: "poligono-layer",
        data: poligono,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 0, 0, 255],
        getLineWidth: 10,
    });

    const coloniasLayer = new GeoJsonLayer({
        id: "colonias-layer",
        data: colonias,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [0, 0, 10, 255],
        getLineWidth: 5,
    });

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
                initialViewState={INITIAL_STATE}
                controller={{ dragPan: !isDrag }}
                layers={[poligonLayer, ...layers, coloniasLayer]}
                viewState={{ ...localViewState }}
                onViewStateChange={handleViewStateChange}
                getTooltip={({ object }: any): any => {
                    if (!object || !object.properties.name) return null;
                    return {
                        html: `<div>
                            <p><b>Nombre:</b> ${_.capitalize(object.properties.name)}</p>
                            <p><b>Categoría:</b> ${object.properties.amenity}</p>
                            ${object.properties.opportunities_ratio ? `<p><b>Potencial de Aprovechamiento:</b> ${Math.round(object.properties.opportunities_ratio * 100)}%</p>` : ''}
                            <p><b>Visitas:</b> XX</p>
                            <p><b>Población Alcance:</b> XX</p>
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
