import { GeoJsonLayer } from "@deck.gl/layers";
import { fetchPolygonData } from "../utils";

const PointsLayer = async ({ coordinates, getFillColor }: any) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }
    const data = await fetchPolygonData({ coordinates, layer: "points" });

    return new GeoJsonLayer({
        id: "lots",
        data: data,
        filled: true,
        getFillColor: getFillColor,
        getLineWidth: 0,
        pickable: true,
    });
};

export default PointsLayer;
