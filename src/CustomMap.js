import { useMemo, useState, useEffect} from "react";
import { API_URL, INITIAL_STATE } from "./constants";
import { useFetch } from "./utils";
import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer } from "deck.gl";
import { Map } from "react-map-gl";
import { Tooltip } from "./Tooltip";
import { Legend } from "./Legend";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import {DrawPolygonMode, ModifyMode} from "@nebula.gl/edit-modes";



import * as d3 from "d3";

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
  
  const [data2, setData2] = useState({
    type: 'FeatureCollection',
    features: []
  });

  const [mode, setMode] = useState(new DrawPolygonMode());


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
    if(!activeSketch)
    {
      const lote = info.object.properties["ID"];
    if (selectedLots.includes(lote)) {
      setSelectedLots(selectedLots.filter((lot) => lot !== lote));
    } else {
      setSelectedLots([...selectedLots, lote]);
    }

    }
    
  };

  // ------------------------------------------ New legend -------------------------------

  const colors = useMemo(() => {
    if (!dataLots) return [];
    const interpolator = d3.interpolate("white", "darkblue");
    return d3.quantize(interpolator, 8);
  }, [dataLots]);

  const domain = useMemo(() => {
    return metric === "minutes"
      ? [0, Math.max(...Object.values(dictData))]
      : Object.values(dictData);
  }, [metric, dictData]);

  const getFillColor = useMemo(() => {
    if (!dataLots) return [255, 0, 0, 150];
    const quantiles = d3.scaleQuantile().domain(domain).range(colors);

    return (d) => {
      const color = d3.color(quantiles(dictData[d.properties["ID"]])).rgb();
      return selectedLots.includes(d.properties["ID"])
        ? [255, 0, 0, 150]
        : [color.r, color.g, color.b];
    };
  }, [dataLots, domain, colors, selectedLots, dictData]);

  // -------------------------------------------------------------------------

  // const getFillColor = useMemo(() => {   // Solo da lista de colores
  //   if (!dataLots) return [255, 0, 0, 150];
  //   const interpolator = d3.interpolate("white", "darkblue");
  //   const colors = d3.quantize(interpolator, 8);
  //   const domain =       // Define los rangos a tomar la info
  //     metric === "minutes"
  //       ? [0, Math.max(...Object.values(dictData))]
  //       : Object.values(dictData);
  //   const quantiles = d3.scaleQuantile().domain(domain).range(colors);

  //   return (d) => {
  //     const color = d3.color(quantiles(dictData[d.properties["ID"]])).rgb(); // Asigna color a los valores dados
  //     return selectedLots.includes(d.properties["ID"])
  //       ? [255, 0, 0, 150]
  //       : [color.r, color.g, color.b];
  //   };
  // }, [dataLots, metric, selectedLots, dictData]);


  const handleEdit2 = ({ updatedData, editType, editContext }) => {
    console.log('On Edit:', editType, editContext);
  
    setData2(updatedData);

    if(updatedData.features.length)
    {
      setMode(new ModifyMode())
    }

  };    

  const editableLayer = new EditableGeoJsonLayer({
    id: 'editable-layer',
    data: data2,
    mode: mode,
    selectedFeatureIndexes: [0],
    onEdit: handleEdit2,
    pickable: true,
    getTentativeFillColor: [255,0,0,100],
    getFillColor: [255,0,0,100],
    getTentativeLineColor: [255,0,0,200],
    getLineColor: [255,0,0,200],
  });

  /*
  useEffect(() => {
    console.log('ACTIVE STATE', activeSketch)
    //console.log('Mode changed to:', mode);
    if(data2.features[0])
      console.log('ya se cerro el primer poligono')
  }, [mode, activeSketch]);*/


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
      layers={ activeSketch  ? [editableLayer] : []}
      //layers={ [editableLayer] }

    >
      <Map
        width="100%"
        height="100%"
        mapStyle={isSatellite ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/lameouchi/clw841tdm00io01ox4vczgtkl"}
        mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        attributionControl={false}
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
          opacity={isSatellite ? 0.4 : 1}
        />
      )}
      {circleGeoJson && !activeSketch && (
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
      <Legend colors={colors} domain={domain} metric={metric} />
    </DeckGL>
  );
};
