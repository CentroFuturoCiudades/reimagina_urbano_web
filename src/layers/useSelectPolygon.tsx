import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useState } from "react";
import { GeoJsonLayer, PickInfo } from "deck.gl";
import { VIEW_MODES } from "../constants";
import { useFetchGeo } from "../utils";

const useSelectLayer = () => {
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const { data: colonias } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/colonias`
    );
    const { data: poligono } = useFetchGeo(
        `${process.env.REACT_APP_API_URL}/polygon/bounds`
    );
    const [selectedPolygons, setSelectedPolygons] = useState<any[]>([]);

    if (viewMode !== VIEW_MODES.FULL) return { layers: [], selectedPolygons };

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

    const selectLayer = new GeoJsonLayer({
        id: "select",
        data: colonias,
        filled: true,
        getFillColor: [255, 255, 255, 0],
        getLineColor: [0, 120, 0, 255],
        getLineWidth: 10,
        pickable: true,
        highlightColor: [255, 255, 255, 100],
        autoHighlight: true,
        onClick: onSelect,
    });

    const poligonLayer = new GeoJsonLayer({
        id: "poligono-layer",
        data: poligono,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 0, 0, 255],
        getLineWidth: 10,
    });

    return { layers: [poligonLayer, selectLayer], selectedPolygons };
};

export default useSelectLayer;
