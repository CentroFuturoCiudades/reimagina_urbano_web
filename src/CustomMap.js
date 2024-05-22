import { useMemo, useState } from "react";
import { API_URL, INITIAL_STATE } from "./constants";
import { useFetch } from "./utils";
import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer } from "deck.gl";
import { Map } from "react-map-gl";
import { Tooltip } from "./Tooltip";
import { Legend } from "./Legend";
import * as d3 from "d3";

const legendTitles = {
  "ID": "Clave de Lote",
  "POBTOT": "Población total",
  "TVIVHAB": "Total de viviendas habitadas",
  "VIVPAR_DES": "Viviendas particulares deshabitadas",
  "VIVTOT": "Viviendas totales",
  "VPH_AUTOM": "Viviendas con automóvil",
  "building_area": "Área de edificación",
  "building_ratio": "Porcentaje de edificación",
  "equipment_area": "Área de equipamiento",
  "equipment_ratio": "Porcentaje de equipamiento",
  "park_area": "Área de parque",
  "park_ratio": "Porcentaje de parque",
  "green_area": "Área con vegetación",
  "green_ratio": "Porcentaje de área con vegetación",
  "parking_area": "Área de estacionamiento",
  "parking_ratio": "Porcentaje de estacionamiento",
  "unused_area": "Área sin utilizar",
  "unused_ratio": "Porcentaje de área sin utilizar",
  "num_establishments": "Número de establecimientos",
  "num_workers": "Número de trabajadores",
  "educacion": "Educación",
  "salud": "Salud",
  "servicios": "Servicios",
  "underutilized_area": "Área subutilizada",
  "underutilized_ratio": "Porcentaje de Subutilización",
  "wasteful_area": "Área desperdiciada",
  "wasteful_ratio": "Porcentaje de área desperdiciada",
  "combined_score": "Puntuación combinada",
  "minutes": "Minutos",
  "accessibility": "Accesibilidad",
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

  const center = !!aggregatedInfo && [
    aggregatedInfo["longitud"],
    aggregatedInfo["latitud"],
  ];
  const circleGeoJson =
    !!center && turf.circle(center, 0.5, { units: "miles" });

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
    const lote = info.object.properties["ID"];
    if (selectedLots.includes(lote)) {
      setSelectedLots(selectedLots.filter((lot) => lot !== lote));
    } else {
      setSelectedLots([...selectedLots, lote]);
    }
  };

  // ------------------------------------------ New legend -------------------------------

  const colors = useMemo(() => {
    if (!dataLots) return [];
    const interpolator = d3.interpolate("white", "darkblue");
    return d3.quantize(interpolator, 8);
  }, [dataLots]);

  const domain = useMemo(() => {
    const values = Object.values(dictData);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return metric === "minutes" ? [0, max] : [min, max];
  }, [metric, dictData]);

  // const domain = useMemo(() => {
  //   return metric === "minutes"
  //     ? [0, Math.max(...Object.values(dictData))]
  //     : Object.values(dictData);
  // }, [metric, dictData]);

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
    >
      <Map
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
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
      <Legend colors={colors} domain={domain} metric={metric} legendTitles={legendTitles} />
    </DeckGL>
  );
};
