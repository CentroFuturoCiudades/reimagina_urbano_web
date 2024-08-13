import { GeoJsonLayer } from "deck.gl";
import { fetchPolygonData } from "../utils";
import { VIEW_MODES } from "../constants";

const LotsLayer = async ({ coordinates, getFillColor, viewMode }: any) => {

    if ( ( !coordinates || coordinates.length === 0) && viewMode != VIEW_MODES.FULL ) {
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
