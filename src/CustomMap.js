import { useEffect, useMemo, useState } from "react";
import { BLOB_URL, INITIAL_STATE } from "./constants";
import { useFetch, useFetchGeo } from "./utils";

import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer, TextLayer } from "deck.gl";
import { Map as StaticMap } from "react-map-gl";
import { Tooltip, Legend } from "./components";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { DrawPolygonMode, ViewMode } from "@nebula.gl/edit-modes";

import * as d3 from "d3";
import { Icon, IconButton } from "@chakra-ui/react";
import { MdAdd, MdOutlineMotionPhotosOff } from "react-icons/md";

export const CustomMap = ({
  aggregatedInfo,
  data,
  selectedLots,
  setSelectedLots,
  visible,
  coords,
  metric,
  isSatellite,
}) => {
  const project = window.location.pathname.split("/")[1];
  const { data: poligono } = useFetch(`${BLOB_URL}/${project}/bounds.geojson`);
  const [hoverInfo, setHoverInfo] = useState(null);

  const [data2, setData2] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [mode, setMode] = useState(new DrawPolygonMode());
  const [editableLayers, setEditableLayers] = useState([]);
  const { data: dataLots } = useFetchGeo(`${BLOB_URL}/${project}/lots.fgb`);
  const [isLotsReady, setLotsReady] = useState(false);
  const [thisSelectedLots, setThisSelectedLots] = useState([]);
  const { data: coloniasData } = useFetch(
    `${BLOB_URL}/${project}/colonias.geojson`
  );
  const [sketchesCoords, setSketchesCoords] = useState([])


  // let abortController = new AbortController();
  // useEffect(() => {
  //   async function fetchData() {
  //     if (abortController) {
  //       abortController.abort();
  //     }
  //     abortController = new AbortController();
  //     const lat = hoverCenter[1];
  //     const lon = hoverCenter[0];
  //     const params = new URLSearchParams({
  //       lat: lat,
  //       lon: lon,
  //       radius: brushingRadius,
  //     });
  //     const metrics = [
  //       "landuse_park",
  //       "landuse_parking",
  //       // 'landuse_green',
  //       "landuse_equipment",
  //       "establishments",
  //       "landuse_building",
  //     ];
  //     metrics.forEach((metric) => params.append("metrics", metric));
  //     const url = `http://127.0.0.1:8000/lens?${params.toString()}`;
  //     const response = await fetch(url, { signal: abortController.signal });
  //     const arrayBuffer = await response.arrayBuffer();
  //     const data = await load(arrayBuffer, FlatGeobufLoader);
  //     setOriginalData(data);
  //   }
  //   fetchData();
  // }, [hoverCenter]);
  
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

  const dictData = useMemo(
    () =>
      data.reduce((acc, cur) => {
        let value = cur["value"];
        acc[cur["ID"]] = value;
        return acc;
      }, {}),
    [data, metric]
  );

  useEffect(()=> {
    if( dataLots && dataLots.features.length > 0 && data?.length ){
      setLotsReady( true );
    }
      
  }, [ dataLots, data ])

  // Memoized filtered GeoJSON data
  // const filteredGeoJsonData = useMemo(() => {
  //   if (!selectedLots || selectedLots.length === 0) {
  //     return null; // Or you could return an empty GeoJSON object if you prefer
  //   }
  //   return {
  //     ...dataBuildings,
  //     features: dataBuildings.features.filter((feature) =>
  //       selectedLots.includes(feature.properties.ID)
  //     ),
  //   };
  // }, [dataBuildings, selectedLots]);

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
  const [activeSketch, setActiveSketch] = useState(false);

  useEffect(() => {
    console.log("SketchesCoords: ", sketchesCoords);
  }, [sketchesCoords])

  const handleEdit2 = ({ updatedData, editType, editContext }) => {
    setData2(updatedData);

    // Switch to ModifyMode when a feature is added or moved
    if (
      editType === "addFeature" ||
      editType === "finishMovePosition" ||
      editType === "finish"
    ) {
      const selectedArea = updatedData.features[0];
      setSketchesCoords((sketchCoords) => [...sketchCoords, selectedArea.geometry.coordinates])
      console.log(selectedArea);
      const selectedData = dataLots.features
        .filter((feature) => turf.booleanIntersects(selectedArea, feature))
        .map((feature) => feature.properties.ID);
      console.log(selectedData);

      setSelectedLots(selectedData);
      setThisSelectedLots(selectedData);

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
      setSelectedLots(selectedData);
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
  });

  /*
  useEffect(() => {
    console.log('ACTIVE STATE', activeSketch)
    //console.log('Mode changed to:', mode);
    if(data2.features[0])
      console.log('ya se cerro el primer poligono')
  }, [mode, activeSketch]);*/

  useEffect(() => {
    if (activeSketch) setSelectedLots([]);
  }, [activeSketch]);

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
    >
      <StaticMap
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
      { dataLots && thisSelectedLots && isLotsReady && getFillColor && (
        <GeoJsonLayer
          key="geojson-layer"
          id="geojson-layer"
          data={dataLots.features.filter(d => {
            if( getFillColor )
              return true
          })}
          filled={true}
          getFillColor={getFillColor}
          getLineWidth={0}
          onClick={updateSelectedLots}
          pickable={true}
          autoHighlight={true}
          highlightColor={(d) => {
            return thisSelectedLots.includes(d.object.properties["ID"])
              ? [255, 0, 0, 150]
              : [255, 0, 0, 70];
          }}
          getPosition={(d) => d.position}
          opacity={isSatellite ? 0.4 : 1}
        />
      )}
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
      { isLotsReady && (
        <Legend
          colors={colors}
          domain={domain}
          metric={metric}
          legendTitles={{}}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "100px",
          marginRight: "250px",
        }}
      >
        <IconButton
          aria-label=""
          icon={
            activeSketch ? (
              <Icon as={MdOutlineMotionPhotosOff} />
            ) : (
              <Icon as={MdAdd} />
            )
          }
          size="lg"
          colorScheme={activeSketch ? "red" : "blue"}
          isRound
          onClick={() => setActiveSketch(!activeSketch)}
        />
      </div>
      {coloniasData && (
        <TextLayer
          id="municipios-text-layer"
          data={coloniasData.features}
          getPosition={(d) => [d.properties.longitude, d.properties.latitude]}
          getText={(d) => d.properties.NOM_COL}
          sizeUnits="pixels"
          getSize={10}
          backgroundPadding={[10, 10, 10, 10]}
          fontWeight={600}
          getPixelOffset={[0, -10]}
          getColor={[0, 0, 0, 150]}
          fontFamily="Inter, Courier, monospace"
        />
      )}
      {coloniasData && (
        <GeoJsonLayer
          id="colonias-layer"
          data={coloniasData.features}
          filled={false}
          stroked={true}
          getLineColor={[40, 40, 80, 100]}
          getLineWidth={5}
        />
      )}
    </DeckGL>
  );
};
