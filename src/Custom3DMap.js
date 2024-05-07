import { useMemo } from "react";
import { colorInterpolate, useFetch } from "./utils";
import { DeckGL, GeoJsonLayer, Tile3DLayer } from "deck.gl";
import { AMOUNT, API_URL, COLORS, INITIAL_STATE } from "./constants";
import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";

export const Custom3DMap = ({ data, selectedLots }) => {
  console.log('enter Custom3DMap')
  const { data: dataLots } = useFetch(`${API_URL}/geojson/lots`);
  const { data: dataBuildings } = useFetch(`${API_URL}/geojson/building`);
  const { data: coords } = useFetch(`${API_URL}/coords`);
  const filteredLots = useMemo(
    () =>
      dataLots
        ? dataLots.features.filter((x) =>
            data.find((y) => y["ID"] === x.properties['ID'])
          )
        : [],
    [dataLots, data]
  );
  const filteredBuildings = useMemo(
    () => (dataBuildings ? dataBuildings.features : []),
    [dataBuildings]
  );

  const dictData = useMemo(
    () =>
      data.reduce((acc, cur) => {
        acc[cur["ID"]] = cur["value"];
        return acc;
      }, {}),
    [data]
  );

  const filteredData = data.map((feature) => feature["value"]);
  const max = Math.max(...filteredData);
  const min = 0;
  const quantiles = Array.from(
    { length: AMOUNT },
    (_, i) => (i * (max - min)) / AMOUNT + min
  );

  if (!dataLots) {
    return <div>Loading</div>
  }

  return (
    <DeckGL
      initialViewState={
        coords
          ? {
              ...INITIAL_STATE,
              latitude: coords["latitud"],
              longitude: coords["longitud"],
            }
          : INITIAL_STATE
      }
      controller={true}
    >
      <Tile3DLayer
        id="tile-3d-layer"
        data="https://tile.googleapis.com/v1/3dtiles/root.json"
        loadOptions={{
          fetch: {
            headers: {
              "X-GOOG-API-KEY": "AIzaSyBEI4Awt9VjqJurW3rqAdkIFdU34ihhPBE",
            },
          },
        }}
        operation="terrain+draw"
      />
      {filteredLots && selectedLots && (
        <>
          <GeoJsonLayer
            id="geojson-layer"
            data={filteredLots}
            filled={true}
            getFillColor={(d) =>
              colorInterpolate(
                dictData[d.properties['ID']],
                quantiles,
                COLORS,
                0.6
              )
            }
            getLineWidth={0}
            extensions={[new TerrainExtension()]}
          />
          <GeoJsonLayer
            id="building-layer"
            data={filteredBuildings}
            filled={true}
            getLineWidth={0}
            opacity={0.2}
            getFillColor={[255, 255, 0, 255]}
            extensions={[new TerrainExtension()]}
          />
        </>
      )}
    </DeckGL>
  );
};
