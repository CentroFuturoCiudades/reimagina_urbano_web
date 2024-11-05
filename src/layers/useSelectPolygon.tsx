import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useMemo, useState } from "react";
import { GeoJsonLayer, TextLayer } from "@deck.gl/layers";
import { VIEW_MODES } from "../constants";
import { fetchGeo, useFetchGeo } from "../utils";
import { setCoordinates } from "../features/coordinates/coordinatesSlice";
import { PathStyleExtension } from "@deck.gl/extensions";
import {
    setColonias,
    toggleSelectedColonias,
} from "../features/viewMode/viewModeSlice";

const useSelectLayer = () => {
    const dispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const [hoveredObject, setHoveredObject] = useState<any>(null);
    const { data: colonias } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/colonias`
    ) as any;
    // const { data: poligono } = useFetchGeo(
    //     `${process.env.REACT_APP_API_URL}/polygon/${project}_bounds`, undefined, undefined, [project]
    // ) as any;
    const [poligono, setPoligono] = useState<any>(null);
    const selectedColonias = useSelector(
        (state: RootState) => state.viewMode.selectedColonias
    );

    useEffect(() => {
        const fetchPoligono = async () => {
            if (project) {
                const response = await fetchGeo(
                    `${process.env.REACT_APP_API_URL}/polygon/${project}_bounds`
                );
                setPoligono(response);
            }
        };
        fetchPoligono();
    }, [project]);

    useEffect(() => {
        if (colonias) {
            dispatch(setColonias(colonias?.features));
        }
    }, [colonias]);

    useEffect(() => {
        if (viewMode === VIEW_MODES.FULL) {
            dispatch(
                setCoordinates(poligono?.features[0].geometry.coordinates)
            );
        } else if (viewMode === VIEW_MODES.POLIGON) {
            const coords =
                selectedColonias && selectedColonias.length > 0
                    ? colonias.features
                          .filter((x: any) =>
                              selectedColonias.includes(x.properties.OBJECTID_1)
                          )
                          .map((x: any) => x.geometry.coordinates[0])
                    : [];
            dispatch(setCoordinates(coords));
        }
    }, [selectedColonias, poligono, viewMode]);

    const onSelect = (info: any) => {
        if (info.object) {
            dispatch(toggleSelectedColonias(info.object.properties.OBJECTID_1));
        }
    };

    const mapFillSelection = (d: any): any =>
        selectedColonias.includes(d.properties.OBJECTID_1)
            ? [140, 100, 65]
            : hoveredObject &&
              hoveredObject.properties.OBJECTID_1 === d.properties.OBJECTID_1
            ? [115, 80, 60]
            : [90, 60, 50];
    const mapWidthSelection = (d: any) =>
        selectedColonias.includes(d.properties.OBJECTID_1)
            ? 18
            : hoveredObject &&
              hoveredObject.properties.OBJECTID_1 === d.properties.OBJECTID_1
            ? 15
            : 8;

    const mapFillColor = (d: any): any =>
        hoveredObject &&
        hoveredObject.properties.OBJECTID_1 === d.properties.OBJECTID_1
            ? [255, 255, 255, 100]
            : [255, 255, 255, 0];

    const selectLayer = new GeoJsonLayer({
        id: "select",
        data: colonias,
        filled: true,
        getFillColor: mapFillColor,
        getLineColor: mapFillSelection,
        getLineWidth: mapWidthSelection,
        pickable: true,
        updateTriggers: {
            getLineColor: [hoveredObject, selectedColonias],
            getLineWidth: [hoveredObject, selectedColonias],
            getFillColor: [hoveredObject, selectedColonias],
        },
        onHover: (info: any) => {
            setHoveredObject(info.object);
        },
        getText: (x: any) => x.properties.NOM_COL,
        getTextSize: 12,
        onClick: onSelect,
    });

    const selectedColoniaTextLayer = new TextLayer({
        id: "selected-colonia-text",
        data: colonias,
        pickable: true,
        getPosition: (d: any) => d.geometry.coordinates[0],
        getText: (d: any) => d.properties.NOM_COL,
        getSize: 24,
        getColor: [255, 255, 255],
        getAngle: 0,
        getTextAnchor: "middle",
        getAlignmentBaseline: "center",
    });

    const poligonLayer = new GeoJsonLayer({
        id: "poligono-layer",
        data: poligono,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 0, 0, 255],
        getLineWidth: 20,
        getDashArray: [10, 5],
        dashJustified: true,
        dashGapPickable: false,
        updateTriggers: {
            getLineColor: [selectedColonias],
            getLineWidth: [selectedColonias],
        },
        extensions: [new PathStyleExtension({ dash: true })],
    });

    return {
        layers: [
            poligonLayer,
            ...(viewMode === VIEW_MODES.POLIGON
                ? [selectLayer, selectedColoniaTextLayer]
                : []),
        ],
    };
};

export default useSelectLayer;
