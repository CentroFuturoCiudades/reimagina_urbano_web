import { useEffect, useMemo, useState, useCallback } from "react";
import { INITIAL_STATE } from "./constants";
import { useFetch } from "./utils";
import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer } from "deck.gl";
import { Map } from "react-map-gl";
import { Tooltip, Legend } from "./components";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { DrawPolygonMode, ViewMode } from "@nebula.gl/edit-modes";

import * as d3 from "d3";
import { debounce } from "lodash";
import { FlatGeobufLoader } from "@loaders.gl/flatgeobuf";
import { load } from "@loaders.gl/core";

const legendTitles = {
  // Your legend titles here
};

const areaMetrics = [
  "building_area",
  "equipment_area",
  "park_area",
  "green_area",
  "parking_area",
  "unused_area",
];

const ratioMetrics = [
  "building_ratio",
  "equipment_ratio",
  "park_ratio",
  "green_ratio",
  "parking_ratio",
  "unused_ratio",
  "underutilized_ratio",
  "wasteful_ratio",
];

const BLOB_URL = "https://reimaginaurbanostorage.blob.core.windows.net";

export const CustomMap = ({
  aggregatedInfo,
  data,
  selectedLots,
  setSelectedLots,
  opacities,
  coords,
  metric,
  activeSketch,
  isSatellite,
}) => {
  const project = window.location.pathname.split("/")[1];
  const [hoverCenter, setHoverCenter] = useState(null);
  const [brushingRadius, setBrushingRadius] = useState(500); //radio esta en metros

  const [originalData, setOriginalData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const { data: poligono } = useFetch(`${BLOB_URL}/${project}/bounds.geojson`);
  const [hoverInfo, setHoverInfo] = useState();
  const dataLots = originalData.features.filter(
    (feature) => feature.properties["metric"] === "lots"
  );
  const dataPark = originalData.features.filter(
    (feature) => feature.properties["metric"] === "landuse_park"
  );
  const dataEquipment = originalData.features.filter(
    (feature) => feature.properties["metric"] === "landuse_equipment"
  );
  const dataGreen = originalData.features.filter(
    (feature) => feature.properties["metric"] === "landuse_green"
  );
  const dataParking = originalData.features.filter(
    (feature) => feature.properties["metric"] === "landuse_parking"
  );
  const dataEstablishments = originalData.features.filter(
    (feature) => feature.properties["metric"] === "establishments"
  );
  const dataBuildings = originalData.features.filter(
    (feature) => feature.properties["metric"] === "landuse_building"
  );

  const [data2, setData2] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [mode, setMode] = useState(new DrawPolygonMode());
  const [editableLayers, setEditableLayers] = useState([]);

  let abortController = new AbortController();
  useEffect(() => {
    async function fetchData() {
      if (!hoverCenter) {
        setOriginalData({ features: [] });
        return;
      }
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();
      const lat = hoverCenter[1];
      const lon = hoverCenter[0];
      const params = new URLSearchParams({
        lat: lat,
        lon: lon,
        radius: brushingRadius,
      });
      const metrics = [
        "landuse_park",
        "landuse_parking",
        // 'landuse_green',
        "landuse_equipment",
        "establishments",
        "landuse_building",
      ];
      metrics.forEach((metric) => params.append("metrics", metric));
      const url = `http://127.0.0.1:8000/lens?${params.toString()}`;
      const response = await fetch(url, { signal: abortController.signal });
      const arrayBuffer = await response.arrayBuffer();
      const data = await load(arrayBuffer, FlatGeobufLoader);
      setOriginalData(data);
    }
    fetchData();
  }, [hoverCenter]);

  useEffect(() => {
    let editableLayer = new EditableGeoJsonLayer({
      id: "editable-layer",
      data: data2,
      mode: mode,
      selectedFeatureIndexes: [0],
      onEdit: handleEdit2,
      pickable: true,
      getTentativeFillColor: [255, 0, 0, 100],
      getFillColor: [255, 0, 0, 100],
      getTentativeLineColor: [255, 0, 0, 200],
      getLineColor: [255, 0, 0, 200],
    });

    setEditableLayers([editableLayer]);
  }, [mode, data2]);

  const circleGeoJson =
    !!hoverCenter &&
    turf.circle(hoverCenter, brushingRadius, { units: "meters" });

  const dictData = useMemo(
    () =>
      data.reduce((acc, cur) => {
        let value = cur["value"];
        if (areaMetrics.includes(metric)) {
          value *= 10000; // Convertir hectáreas a metros cuadrados
        }
        if (ratioMetrics.includes(metric)) {
          value *= 100; // Convertir ratio a porcentaje
        }
        acc[cur["ID"]] = value;
        return acc;
      }, {}),
    [data, metric]
  );

  const updateSelectedLots = (info) => {
    if (!activeSketch) {
      const lote = info.object.properties["ID"];
      if (selectedLots.includes(lote)) {
        setSelectedLots(selectedLots.filter((lot) => lot !== lote));
      } else {
        setSelectedLots([...selectedLots, lote]);
      }
      console.log("selected lots", selectedLots);
    }
  };

  const colors = useMemo(() => {
    if (!dataLots) return [];
    const interpolator = d3.interpolate("#a7c9c8", "darkblue");
    return d3.quantize(interpolator, 8);
  }, [dataLots]);

  const domain = useMemo(() => {
    const values = Object.values(dictData);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return metric === "minutes" ? [0, max] : [min, max];
  }, [metric, dictData]);

  const getFillColor = useMemo(() => {
    if (!dataLots) return [255, 0, 0, 150];
    const quantiles = d3.scaleQuantize().domain(domain).range(colors);

    return (d) => {
      const color = d3.color(quantiles(dictData[d.properties["ID"]])).rgb();
      return selectedLots.includes(d.properties["ID"])
        ? [255, 0, 0, 150]
        : [color.r, color.g, color.b];
    };
  }, [dataLots, domain, colors, selectedLots, dictData]);

  const handleHover = useCallback((info) => {
    if (info.coordinate) {
      setHoverCenter([info.coordinate[0], info.coordinate[1]]);
      console.log("center", [info.coordinate[0], info.coordinate[1]]);
    } else {
      setHoverCenter(null);
    }
  }, []);

  const debouncedHover = useCallback(debounce(handleHover, 50), [handleHover]);

  const handleEdit2 = ({ updatedData, editType, editContext }) => {
    setData2(updatedData);

    // Switch to ModifyMode when a feature is added or moved
    if (
      editType === "addFeature" ||
      editType === "finishMovePosition" ||
      editType === "finish"
    ) {
      const selectedArea = updatedData.features[0];
      const selectedData = dataLots.features
        .filter((feature) => turf.booleanIntersects(selectedArea, feature))
        .map((feature) => feature.properties.ID);

      setSelectedLots(selectedData);

      // Set the existing editable layer to ViewMode
      setEditableLayers((layers) =>
        layers.map(
          (layer) =>
            new EditableGeoJsonLayer({
              ...layer.props,
              id: layer.id,
              mode: new ViewMode(),
            })
        )
      );

      // Create a new editable layer with a unique ID
      const newEditableLayer = new EditableGeoJsonLayer({
        id: `editable-layer-${editableLayers.length + 1}`, // Unique ID for the new editable layer
        data: { type: "FeatureCollection", features: [] },
        mode: new DrawPolygonMode(),
        selectedFeatureIndexes: [0],
        onEdit: handleEdit2,
        pickable: true,
        getTentativeFillColor: [0, 0, 255, 100],
        getFillColor: [0, 0, 255, 100],
        getTentativeLineColor: [0, 0, 255, 200],
        getLineColor: [0, 0, 255, 200],
      });

      // Add the new editable layer to the state
      setEditableLayers((layers) => [...layers, newEditableLayer]);
    }
  };

  const editableLayer = new EditableGeoJsonLayer({
    id: "editable-layer",
    data: data2,
    mode: mode,
    selectedFeatureIndexes: [0],
    onEdit: handleEdit2,
    pickable: true,
    getTentativeFillColor: [255, 0, 0, 100],
    getFillColor: [255, 0, 0, 100],
    getTentativeLineColor: [255, 0, 0, 200],
    getLineColor: [255, 0, 0, 200],
    //brushingEnabled: true,
    //brushingRadius: 1000,
    //extensions:[brushingExtension]
  });

  /*
  useEffect(() => {
    console.log('ACTIVE STATE', activeSketch)
    //console.log('Mode changed to:', mode);
    if(data2.features[0])
      console.log('ya se cerro el primer poligono')
  }, [mode, activeSketch]);*/

  if (!coords) {
    return <div>Loading</div>;
  }

  return (
    <DeckGL
      initialViewState={{
        ...INITIAL_STATE,
        latitude: coords["latitud"],
        longitude: coords["longitud"],
      }}
      controller={true}
      layers={
        activeSketch
          ? [editableLayer]
          : [
              /*hoverCenter && new ScatterplotLayer({
        id: 'circle-layer',
        data: [{ position: hoverCenter, size: 1000 }],
        pickable: true,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 1,
        getPosition: hoverCenter,
        getRadius: 1100,
        getFillColor: [0, 0, 0, 20],// Circle color
        getLineWidth: 80,
        getLineColor: [80, 80, 80] // Border color
      })*/
            ]
      }
      onHover={(info, event) => {
        debouncedHover(info, event);
      }}
    >
      <Map
        width="100%"
        height="100%"
        mapStyle={
          isSatellite
            ? "mapbox://styles/mapbox/satellite-v9"
            : "mapbox://styles/lameouchi/clw841tdm00io01ox4vczgtkl"
        }
        mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        attributionControl={false}
      />
      <GeoJsonLayer
        key="poligono-layer"
        id="poligono"
        data={poligono}
        filled={true}
        getFillColor={[0, 0, 0, 0]}
        getLineColor={[255, 0, 0, 255]}
        getLineWidth={10}
      />
      {/* {selectedLots.length === 0 && !activeSketch  && (
        <ScatterplotLayer
        id= 'circle-layer'
        data= {[{ position: hoverCenter, size: 1000 }]}
        pickable= {true}
        stroked= {true}
        filled= {true}
        lineWidthMinPixels= {1}
        getPosition= {hoverCenter}
        getRadius= {1100}
        getFillColor= {[0, 0, 0, 20]} // Circle color
        getLineWidth= {80}
        getLineColor= {[80, 80, 80]} // Border color
        />
      )} */}
      {/* Layer de color gris abajo del amarillo  */}
      {dataLots && selectedLots && (
        <GeoJsonLayer
          key="geojson-layer"
          id="geojson-layer"
          data={dataLots}
          filled={true}
          getFillColor={getFillColor}
          getLineWidth={0}
          onClick={updateSelectedLots}
          pickable={true}
          autoHighlight={true}
          highlightColor={(d) => {
            return selectedLots.includes(d.object.properties["ID"])
              ? [255, 0, 0, 150]
              : [255, 0, 0, 70];
          }}
          getPosition={(d) => d.position}
          opacity={isSatellite ? 0.4 : 1}
        />
      )}
      {circleGeoJson && !activeSketch && (
        <GeoJsonLayer
          key="circle-layer"
          id="circle"
          data={circleGeoJson}
          filled={true}
          getFillColor={[0, 120, 0, 25]}
          getLineColor={[0, 120, 0, 255]}
          getLineWidth={5}
        />
      )}
      {dataBuildings && (
        <GeoJsonLayer
          key="building-layer"
          id="building-layer"
          data={dataBuildings}
          filled={true}
          extruded={true}
          getElevation={3}
          getLineWidth={0}
          getFillColor={[255, 255, 0, 100]}
          opacity={opacities.building}
        />
      )}
      {opacities.green > 0 && dataGreen && (
        <GeoJsonLayer
          key="green-layer"
          id="green-layer"
          data={dataGreen}
          filled={true}
          getFillColor={[160, 200, 160, 255]}
          getLineWidth={0}
          opacity={opacities.green}
        />
      )}
      {opacities.parking > 0 && dataParking && (
        <GeoJsonLayer
          key="parking-layer"
          id="parking-layer"
          data={dataParking}
          filled={true}
          getFillColor={[120, 120, 120, 255]}
          getLineWidth={0}
          opacity={opacities.parking}
        />
      )}
      {opacities.equipment > 0 && dataEquipment && (
        <GeoJsonLayer
          key="equipment-layer"
          id="equipment-layer"
          data={dataEquipment}
          filled={true}
          getFillColor={[180, 0, 180, 255]}
          getLineWidth={0}
          opacity={opacities.equipment}
        />
      )}
      {opacities.park > 0 && dataPark && (
        <GeoJsonLayer
          key="park-layer"
          id="park-layer"
          data={dataPark}
          filled={true}
          getFillColor={[0, 130, 0, 255]}
          getLineWidth={0}
          opacity={opacities.park}
        />
      )}
      <GeoJsonLayer
        key="establishments-layer"
        id="establishments-layer"
        data={dataEstablishments}
        filled={true}
        getFillColor={[0, 255, 0, 255]}
        getLineColor={[0, 0, 0, 255]}
        getLineWidth={0.5}
        onHover={(info) => setHoverInfo(info)}
        pickable={true}
        autoHighlight={true}
        getPosition={(d) => d.position}
      />
      
      {/*<ScatterplotLayer
        id= 'circle-layer'
        data= {[{ position: hoverCenter, size: 1000 }]}
        pickable= {true}
        stroked= {true}
        filled= {true}
        lineWidthMinPixels= {1}
        getPosition= {hoverCenter}
        getRadius= {1100}
        getFillColor= {[0, 0, 0, 20]} // Circle color
        getLineWidth= {80}
        getLineColor= {[80, 80, 80]} // Border color
      
      />*/}
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>Nombre:</b> {hoverInfo.object.properties["nom_estab"]}
          </span>
          <span className="tooltip-label">
            <b>Numero de Trabajadores:</b>{" "}
            {hoverInfo.object.properties["num_workers"]}
          </span>
          <span className="tooltip-label">
            <b>Sector:</b> {hoverInfo.object.properties["sector"]}
          </span>
        </Tooltip>
      )}
      {dataLots && dataLots.length > 0 && (
        <Legend
          colors={colors}
          domain={domain}
          metric={metric}
          legendTitles={legendTitles}
        />
      )}
    </DeckGL>
  );
};
