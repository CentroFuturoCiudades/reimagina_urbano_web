import { GeoJsonLayer } from "deck.gl";
import { fetchPolygonData } from "../utils";

const LotsLayer = async ({ coordinates, getFillColor }: any) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }
    const data = await fetchPolygonData({ coordinates, layer: "lots" });

    return new GeoJsonLayer({
        id: "lots",
        data: data,
        filled: true,
        getFillColor: getFillColor,
        getLineWidth: 0,
        pickable: true,
    });
};

export default LotsLayer;
