import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { VIEW_MODES } from "../constants";

const PopulationPointsLayer = async ( props: any ) => {

    let lat = 0
    let lon = 0
    let radius = 0;

    console.log( props )

    if( props.coords && props.viewMode != VIEW_MODES.FULL ){
        lon = props.coords[0];
        lat = props.coords[1];
        radius = props.radius
    }

    let response = await fetch(`http://127.0.0.1:8000/layers?layers=points&lat=${lat}&lon=${lon}&radius=${radius}`, {
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

export default PopulationPointsLayer;
