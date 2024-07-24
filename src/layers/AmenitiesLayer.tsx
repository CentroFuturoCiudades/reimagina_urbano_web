import { load } from "@loaders.gl/core";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { GenericObject } from '../types';
import { fetchPolygonData } from "../utils";
import { GeoJsonLayer } from "deck.gl";

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
  const amenitiesArray = props.amenitiesArray;
  const layers: any[] = [];
  const coordinates = props.coordinates;


  for (let i = 0; i < amenitiesArray.length; i++) {
    const layer = amenitiesArray[i].value
    const data = await fetchPolygonData({ coordinates, layer: layer });

    layers.push( new GeoJsonLayer({
        id: layer,
        data: data,
        filled: true,
        getFillColor: METRIC_COLOR[amenitiesArray[i].value],
        getLineWidth: 0,
        pickable: true,
    }))

  }

  return layers;
};

export default AmenitiesLayer;
