import { useMemo, useState } from "react";
import { AMOUNT, API_URL, COLORS, INITIAL_STATE } from "./constants";
import { colorInterpolate, useFetch } from "./utils";
import * as turf from "@turf/turf";
import { DeckGL, GeoJsonLayer } from "deck.gl";
import { Map } from "react-map-gl";
import { Tooltip } from "./Tooltip";

export const CustomMap = ({
  aggregatedInfo,
  data,
  selectedLots,
  setSelectedLots,
  opacities,
  coords,
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
        acc[cur["ID"]] = cur["value"];
        return acc;
      }, {}),
    [data]
  );

  const quantiles = useMemo(() => {
    const filteredData = data.map((feature) => feature["value"]);
    const max = Math.max(...filteredData);
    const min = 0;
    return Array.from(
      { length: AMOUNT },
      (_, i) => (i * (max - min)) / AMOUNT + min
    );
  }, [data]);

  const updateSelectedLots = (info) => {
    const lote = info.object.properties["ID"];
    if (selectedLots.includes(lote)) {
      setSelectedLots(selectedLots.filter((lot) => lot !== lote));
    } else {
      setSelectedLots([...selectedLots, lote]);
    }
  };

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
      {dataLots && selectedLots && (
        <GeoJsonLayer
          id="geojson-layer"
          data={dataLots.features.filter((x) => dictData[x.properties["ID"]])}
          filled={true}
          getFillColor={(d) =>
            selectedLots.includes(d.properties["ID"])
              ? [255, 0, 0, 150]
              : colorInterpolate(
                  dictData[d.properties["ID"]],
                  quantiles,
                  COLORS,
                  0.6
                )
          }
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
      <GeoJsonLayer
        id="building-layer"
        data={dataBuildings}
        filled={true}
        extruded={true}
        // getElevation={(d) => dictData[d.properties['ID']].ALTURA * 20}
        getElevation={3}
        getLineWidth={0}
        getFillColor={[255, 255, 0, 255]}
        opacity={opacities.building}
      />
      <GeoJsonLayer
        id="green-layer"
        data={dataGreen}
        filled={true}
        getFillColor={[160, 200, 160, 255]}
        getLineWidth={0}
        opacity={opacities.green}
      />
      <GeoJsonLayer
        id="parking-layer"
        data={dataParking}
        filled={true}
        getFillColor={[120, 120, 120, 255]}
        getLineWidth={0}
        opacity={opacities.parking}
      />
      <GeoJsonLayer
        id="equipment-layer"
        data={dataEquipment}
        filled={true}
        getFillColor={[180, 0, 180, 255]}
        getLineWidth={0}
        opacity={opacities.equipment}
      />
      <GeoJsonLayer
        id="park-layer"
        data={dataPark}
        filled={true}
        getFillColor={[0, 130, 0, 255]}
        getLineWidth={0}
        opacity={opacities.park}
      />
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
