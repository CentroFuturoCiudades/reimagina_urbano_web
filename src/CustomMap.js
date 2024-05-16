import { useMemo, useState } from "react";
import { API_URL, INITIAL_STATE } from "./constants";
import { useFetch } from "./utils";
import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer } from "deck.gl";
import { Map } from "react-map-gl";
import { Tooltip } from "./Tooltip";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import {DrawPolygonMode, ModifyMode} from "@nebula.gl/edit-modes"

import * as d3 from "d3";

export const CustomMap = ({
  aggregatedInfo,
  data,
  selectedLots,
  setSelectedLots,
  opacities,
  coords,
  metric,
}) => {
  const { data: dataLots } = useFetch(`${API_URL}/geojson/lots`);
  const { data: poligono } = useFetch(`${API_URL}/geojson/bounds`);
  const { data: dataBuildings } = useFetch(`${API_URL}/geojson/building`);
  const { data: dataParking } = useFetch(`${API_URL}/geojson/parking`);
  const { data: dataEstablishments } = useFetch(
    `${API_URL}/geojson/establishments`
  );
  const { data: dataPark } = useFetch(`${API_URL}/geojson/park`);
  const { data: dataGreen } = useFetch(`${API_URL}/geojson/green`);
  const { data: dataEquipment } = useFetch(`${API_URL}/geojson/equipment`);
  const [hoverInfo, setHoverInfo] = useState();
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [isDrawing, setIsDrawing] = useState(true);
  

  const [drawingCoor, setDrawingCoor] = useState(null);


  const center = !!aggregatedInfo && [
    aggregatedInfo["longitud"],
    aggregatedInfo["latitud"],
  ];
  const circleGeoJson =
    !!center && turf.circle(center, 0.5, { units: "miles" });

  const dictData = useMemo(
    () =>
      data.reduce((acc, cur) => {
        acc[cur["ID"]] = cur["value"];
        return acc;
      }, {}),
    [data]
  );

  const updateSelectedLots = (info) => {
    const lote = info.object.properties["ID"];
    if (selectedLots.includes(lote)) {
      setSelectedLots(selectedLots.filter((lot) => lot !== lote));
    } else {
      setSelectedLots([...selectedLots, lote]);
    }
  };

  const getFillColor = useMemo(() => {
    if (!dataLots) return [255, 0, 0, 150];
    const interpolator = d3.interpolate("white", "darkblue");
    const colors = d3.quantize(interpolator, 8);
    const domain =
      metric === "minutes"
        ? [0, Math.max(...Object.values(dictData))]
        : Object.values(dictData);
    const quantiles = d3.scaleQuantile().domain(domain).range(colors);

    return (d) => {
      const color = d3.color(quantiles(dictData[d.properties["ID"]])).rgb();
      return selectedLots.includes(d.properties["ID"])
        ? [255, 0, 0, 150]
        : [color.r, color.g, color.b];
    };
  }, [dataLots, metric, selectedLots, dictData]);


  const handleSketch = (event) => {
    if(!isDrawing) return; 

    console.log('onLayer Click',event)
    const newCoordinate = event;

    const updatedPolygonCoordinates = [...polygonCoordinates, newCoordinate];
    console.log(updatedPolygonCoordinates)

    /*if(updatedPolygonCoordinates.length > 2 && closingCoordinate(newCoordinate,updatedPolygonCoordinates[0])){
      updatedPolygonCoordinates.push(updatedPolygonCoordinates[0]);
      setIsDrawing(false);
      console.log('Poligono cerrado', updatedPolygonCoordinates)
      return;
    }*/
    
    if(updatedPolygonCoordinates.length > 2)
    {
      //console.log(updatedPolygonCoordinates.length-1)
      /*if(updatedPolygonCoordinates[updatedPolygonCoordinates.length-1].layer === 'EditableGeoJsonLayer')
        {
          console.log('YAA')
        }*/
      console.log(updatedPolygonCoordinates[updatedPolygonCoordinates.length-1].layer)
    }
    
    //setPolygonCoordinates([...polygonCoordinates, newCoordinate])
    setPolygonCoordinates(updatedPolygonCoordinates)
  };


  const closingCoordinate = (lastCoor, firstCoor, threshold = 0.0001) => {
    const [x1, y1] = lastCoor.coordinate;
    const [x2, y2] = firstCoor.coordinate;
    return Math.abs(x1 - x2) < threshold && Math.abs(y1 - y2) < threshold;
  };


  const editableLayer = new EditableGeoJsonLayer ({
    id: 'editable-layer',
    data: {
      type: 'FeatureCollection',
      features: [
       {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: polygonCoordinates
        }
      }
        
      ]
    },
    mode: DrawPolygonMode,
    selectedFeatureIndexes: [],
    getTentativeFillColor: () => [255, 0, 255, 100],
    //mode: isDrawing ? DrawPolygonMode : ModifyMode,
    /*onEdit: ({ updatedData }) => {
      console.log('Updated data:', updatedData);
      //console.log('Updated data:', updatedData.features[0].geometry.coordinates[0])
      setPolygonCoordinates(updatedData.features[0].geometry.coordinates[0]);
    },*/
  })
  

  if (!coords || !dataLots) {
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
      onClick={handleSketch}
      layers={[editableLayer]}

    >
      <Map
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        attributionControl={false}
        //onClick={handleSketch}  //cuando se hace click en el mapa se activa 
      />
      <GeoJsonLayer
        id="poligono"
        data={poligono}
        filled={true}
        getFillColor={[0, 0, 0, 0]}
        getLineColor={[255, 0, 0, 255]}
        getLineWidth={10}
      />
      {/* Layer de color gris abajo del amarillo  */}
      {dataLots && selectedLots && (
        <GeoJsonLayer
          id="geojson-layer"
          data={dataLots.features.filter((x) => dictData[x.properties["ID"]])}
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
        />
      )}
      {circleGeoJson && (
        <GeoJsonLayer
          id="circle"
          data={circleGeoJson}
          filled={true}
          getFillColor={[0, 120, 0, 50]}
          getLineColor={[0, 120, 0, 255]}
          getLineWidth={5}
        />
      )}

      {/* Layer de color amarillo */}
      {opacities.building > 0 && (
        <GeoJsonLayer
          id="building-layer"
          data={dataBuildings}
          filled={true}
          extruded={true}
          // getElevation={(d) => dictData[d.properties['ID']].ALTURA * 20}
          getElevation={3}
          getLineWidth={0}
          getFillColor={[255, 255, 0, 100]}
          opacity={opacities.building}
        />
      )}
      {opacities.green > 0 && (
        <GeoJsonLayer
          id="green-layer"
          data={dataGreen}
          filled={true}
          getFillColor={[160, 200, 160, 255]}
          getLineWidth={0}
          opacity={opacities.green}
        />
      )}
      {opacities.parking > 0 && (
        <GeoJsonLayer
          id="parking-layer"
          data={dataParking}
          filled={true}
          getFillColor={[120, 120, 120, 255]}
          getLineWidth={0}
          opacity={opacities.parking}
        />
      )}
      {opacities.equipment > 0 && (
        <GeoJsonLayer
          id="equipment-layer"
          data={dataEquipment}
          filled={true}
          getFillColor={[180, 0, 180, 255]}
          getLineWidth={0}
          opacity={opacities.equipment}
        />
      )}
      {opacities.park > 0 && (
        <GeoJsonLayer
          id="park-layer"
          data={dataPark}
          filled={true}
          getFillColor={[0, 130, 0, 255]}
          getLineWidth={0}
          opacity={opacities.park}
        />
      )}
      <GeoJsonLayer
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
    </DeckGL>
  );
};
