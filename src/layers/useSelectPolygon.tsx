import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useMemo, useState } from "react";
import { GeoJsonLayer, PickInfo } from "deck.gl";
import { VIEW_MODES } from "../constants";
import { useFetchGeo } from "../utils";
import { setCoordinates } from "../features/coordinates/coordinatesSlice";

const useSelectLayer = () => {
    const dispatch = useDispatch();
    const project = window.location.pathname.split("/")[1];
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const [hoveredObject, setHoveredObject] = useState<any>(null);
    const { data: colonias } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/colonias`
    );
    const { data: poligono } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/${project}_bounds`
    );
    const [selectedPolygons, setSelectedPolygons] = useState<any[]>([]);

    useEffect(() => {
        if (viewMode !== VIEW_MODES.FULL) return;
        const coords =
            selectedPolygons.length > 0
                ? selectedPolygons?.map((x: any) => x.geometry.coordinates[0])
                : poligono
                ? (poligono as any).features[0].geometry.coordinates
                : [];
        dispatch(setCoordinates(coords));
    }, [selectedPolygons, poligono, viewMode]);

    if (viewMode !== VIEW_MODES.FULL)
        return { layers: [], selectedPolygons: [] };

    const onSelect = (info: PickInfo<unknown>) => {
        if (info.object) {
            setSelectedPolygons((prev: any) => {
                if (prev.includes(info.object)) {
                    return prev.filter((x: any) => x !== info.object);
                }
                return [...prev, info.object];
            });
        }
    };

    const mapFillSelection = (d: any): any =>
        selectedPolygons
            .map((x: any) => x.properties.OBJECTID_1)
            .includes(d.properties.OBJECTID_1)
            ? [0, 120, 0, 255]
            : hoveredObject &&
              hoveredObject.properties.OBJECTID_1 === d.properties.OBJECTID_1
            ? [0, 120, 0, 200]
            : [0, 120, 0, 100];
    const mapWidthSelection = (d: any) =>
        selectedPolygons
            .map((x: any) => x.properties.OBJECTID_1)
            .includes(d.properties.OBJECTID_1)
            ? 15
            : hoveredObject &&
              hoveredObject.properties.OBJECTID_1 === d.properties.OBJECTID_1
            ? 12
            : 5;

    const selectLayer = new GeoJsonLayer({
        id: "select",
        data: colonias,
        filled: true,
        getFillColor: [255, 255, 255, 0],
        getLineColor: mapFillSelection,
        getLineWidth: mapWidthSelection,
        pickable: true,
        highlightColor: [255, 255, 255, 100],
        highlightLineWidth: 20,
        autoHighlight: true,
        updateTriggers: {
            getLineColor: [hoveredObject, selectedPolygons],
            getLineWidth: [hoveredObject, selectedPolygons],
        },
        onHover: (info: PickInfo<unknown>) => {
            setHoveredObject(info.object);
        },
        onClick: onSelect,
    });

    const poligonLayer = new GeoJsonLayer({
        id: "poligono-layer",
        data: poligono,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        getLineColor: (d: any) =>
            selectedPolygons.length > 0 ? [200, 0, 0, 200] : [255, 0, 0, 255],
        getLineWidth: (d: any) => (selectedPolygons.length > 0 ? 12 : 20),
        updateTriggers: {
            getLineColor: [selectedPolygons],
            getLineWidth: [selectedPolygons],
        },
    });

    return {
        layers: [poligonLayer, selectLayer],
    };
};

export default useSelectLayer;
