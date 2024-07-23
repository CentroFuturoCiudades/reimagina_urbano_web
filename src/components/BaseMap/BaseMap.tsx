import React, { useCallback, useEffect, useState } from 'react';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { lightenColor, useFetch, useFetchGeo } from '../../utils';
import { API_URL, BLOB_URL, INITIAL_STATE, VIEW_MODES } from '../../constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import * as d3 from "d3";
import { GenericObject } from '../../types';
import { Layer, PickInfo, RGBAColor } from 'deck.gl';
import * as turf from "@turf/turf";
import { debounce } from 'lodash';
import { load } from '@loaders.gl/core';
import { FlatGeobufLoader } from '@loaders.gl/flatgeobuf';
import { setSelectedLots } from '../../features/selectedLots/selectedLotsSlice';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { DrawPolygonMode, ViewMode, TranslateMode } from "@nebula.gl/edit-modes";
import { setDrag } from '../../features/lensSettings/lensSettingsSlice';
import { Layers } from '../index';

interface BaseMapProps {
  isSatellite?: boolean;
}

const BaseMap: React.FC<BaseMapProps> = ( { isSatellite } : BaseMapProps) => {

    const project = window.location.pathname.split("/")[1];
    const [ coords, setCoords ] = useState();

    const { data: poligono } = useFetch(`${BLOB_URL}/${project}/bounds.geojson`);

    const { layers } = Layers();

    //Redux
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag );

    useEffect(() => {
        async function updateProject() {
          await axios.get(`${API_URL}/project/${project}`);
          const coords = await axios.get(`${API_URL}/coords`);
          setCoords(coords.data);
        }
        updateProject();
    }, [project]);

    //LAYER THAT MARKS THE LIMIT OF THE POLIGON
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
        <>
            {/* @ts-ignore */}
            <DeckGL
                initialViewState={{
                    ...INITIAL_STATE,
                    latitude: coords["latitud"],
                    longitude: coords["longitud"]
                }}
                controller={{ dragPan: !isDrag }}
                layers={ [ poligonLayer, ...layers ] }
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
        </>
    );
};

export default BaseMap;
