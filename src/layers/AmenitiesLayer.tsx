import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { GenericObject } from '../types';

const METRIC_COLOR: GenericObject = {
  landuse_parking: [120, 120, 120, 255],
  landuse_equipment: [180, 0, 180, 255],
  landuse_green: [160, 200, 160, 255],
  landuse_park:[0, 130, 0, 255],
  establishments: [0, 255, 0, 255],
  landuse_building: [255, 255, 0, 255],
  points: [255, 0, 0, 255]
}

const AmenitiesLayer = async (props: any) => {
  const amenitiesArray = props;
  const layers: any[] = []; // Initialize layers as an empty array


  for (let i = 0; i < amenitiesArray.length; i++) {
    console.log("layer", amenitiesArray[i]);
    let response = await fetch(`http://127.0.0.1:8000/layers?layers=${amenitiesArray[i].value}`, {
      cache: "reload"
    });
    let arrayBuffer = await response.arrayBuffer();
    let loadedData = await load(arrayBuffer, FlatGeobufLoader);

    layers.push({
      id: `points-${i}`,
      data: loadedData.features,
      filled: true,
      wireframe: false,
      getLineWidth: 0,
      getFillColor: METRIC_COLOR[amenitiesArray[i].value],
    });

  }

  return layers;
};

export default AmenitiesLayer;
