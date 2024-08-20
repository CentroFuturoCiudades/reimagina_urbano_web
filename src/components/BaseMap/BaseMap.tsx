import React, { useCallback, useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import { useFetch } from "../../utils";
import { API_URL, BLOB_URL, INITIAL_STATE } from "../../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { debounce } from "lodash";
import { Layers, Legend } from "../index";
import { setViewState } from "../../features/viewState/viewStateSlice";

interface BaseMapProps {
    isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ({ isSatellite }: BaseMapProps) => {
    const project = window.location.pathname.split("/")[1];

    const [coords, setCoords] = useState();
    const [localViewState, setLocalViewState] = useState(INITIAL_STATE);

    // TODO: Use fetch from backend.
    const { data: poligono } = useFetch(
        `${BLOB_URL}/${project}/bounds.geojson`
    );
    const { data: colonias } = useFetch(
        `${BLOB_URL}/${project}/colonias.geojson`
    );

    const { layers } = Layers();

    //Redux
    const dispatch: AppDispatch = useDispatch();

    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewState = useSelector((state: RootState) => state.viewState);

    useEffect(() => {
        async function updateProject() {
            await axios.get(`${API_URL}/project/${project}`);
            const coords = await axios.get(`${API_URL}/coords`);
            setCoords(coords.data);
        }
        updateProject();
    }, [project]);

    useEffect(() => {
        setLocalViewState({
            ...localViewState,
            zoom: viewState.zoom,
        });

        if (viewState.zoom > 16) {
            checkZoomLevel();
        }
    }, [viewState]);

    useEffect(() => {
        if (coords) {
            setLocalViewState({
                ...localViewState,
                latitude: coords["latitud"],
                longitude: coords["longitud"],
            });
        }
    }, [coords]);

    useEffect(() => {
        dispatch(
            setViewState({
                zoom: localViewState.zoom,
            })
        );
    }, [localViewState.zoom]);

    const checkZoomLevel = () => {
        console.log("x zoom reached");
    };

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
        getLineWidth: 8,
    });

    if (!coords) {
        return <div>Loading</div>;
    }

    return (
        <>
            {/* @ts-ignore */}
            <DeckGL
                initialViewState={{
                    ...INITIAL_STATE,
                    latitude: coords["latitud"],
                    longitude: coords["longitud"],
                }}
                controller={{ dragPan: !isDrag }}
                layers={[poligonLayer, ...layers, coloniasLayer]}
                viewState={{ ...localViewState }}
                onViewStateChange={handleViewStateChange}
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
