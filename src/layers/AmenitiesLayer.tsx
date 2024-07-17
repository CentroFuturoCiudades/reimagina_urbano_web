import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";

const AmenitiesLayer = async () => {

    let response = await fetch(`http://127.0.0.1:8000/layers?layers=landuse_park`, {
        cache: "reload"
    });

    const arrayBuffer = await response.arrayBuffer();
    let loadedData = await load(arrayBuffer, FlatGeobufLoader);

    const layers = [
        {
            id: "points",
            data: loadedData.features,
            filled: true,
            wireframe: false,
            getLineWidth: 0,
            getFillColor: [255, 0, 0, 255],
        },
    ];


   return layers
}

export default AmenitiesLayer;
