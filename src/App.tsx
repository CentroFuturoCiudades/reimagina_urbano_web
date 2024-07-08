import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";

import { Custom3DMap } from "./Custom3DMap";
import { CustomMap } from "./CustomMap";
import { API_URL } from "./constants";
import "./App.css";
import { Chat, LotSidebar, ConfigurationToolbar, MainSidebar, BaseMap } from "./components";
import { Icon, IconButton } from "@chakra-ui/react";
import { MdAdd, MdOutlineMotionPhotosOff } from "react-icons/md";
import React from "react";
import { Configuration, GenericObject } from "./types";
import { LensMap } from "./LensMap";
import { useFetchGeo } from "./utils";
//import Legend from "./Legend";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [aggregatedInfo, setAggregatedInfo] = useState<GenericObject>();
  const [minutesData, setMinutesData] = useState<any[]>();
  const [configuration, setConfiguration] = useState<GenericObject>({
    condition: undefined,
    metric: "POBTOT",
    isSatellite: false,
    visible: {
      parking: true,
      building: true,
      potential_building: true,
      park: true,
      green: false,
      equipment: true,
    },
    accessibility_info: {
      // Initialize this with default values for proximity settings
      proximity_small_park: 2,
      proximity_salud: 2,
      proximity_educacion: 1,
      proximity_servicios: 5,
      proximity_supermercado: 1,
    },
  });
  // console.log(selectedLots); // igual a selected Ids
  const [coords, setCoords] = useState();
  const [parques, setParques] = useState<Configuration>({
    activated: true,
    value: 0,
  });
  const [salud, setSalud] = useState({ activated: true, value: 0 });
  const [educacion, setEducacion] = useState({ activated: true, value: 0 });
  const [servicios, setServicios] = useState({ activated: true, value: 0 });
  const [supermercados, setSupermercados] = useState({
    activated: true,
    value: 0,
  });
  const project = window.location.pathname.split("/")[1];
  const [mode, setMode] = useState("analysis");

  // if project is undefined, redirect to /primavera
  if (project === "") {
    window.location.href = "/primavera";
  }

  useEffect(() => {
    async function updateProject() {
      await axios.get(`${API_URL}/project/${project}`);
      const coords = await axios.get(`${API_URL}/coords`);
      setCoords(coords.data);
    }
    updateProject();
  }, [project]);

  // console.log(aggregatedInfo)

  useEffect(() => {
    // console.log(selectedLots)

    const fetchData = async () => {
      if (selectedLots.length > 0) {
        const response = await axios.get(
          `${API_URL}/predios/?${selectedLots
            .map((x) => `predio=${x}`)
            .join("&")}`
        );
        setAggregatedInfo(response.data);
      } else {
        setAggregatedInfo(undefined);
      }
    };
    fetchData();
  }, [selectedLots, coords]);

  useEffect(()=> {
    setMinutesData( [] );
  }, [configuration.accessibility_info])

  useEffect(() => {
    async function fetchData() {
      // console.log(configuration.metric); // wasteful_ratio, la metrica que se muestra

      if( configuration.metric == "minutes" ){

        if( minutesData && minutesData.length ){
          setData( minutesData );
          return;
        }

        const url = `${API_URL}/minutes`;
        const body = {
          accessibility_info: configuration.accessibility_info
        }

        axios.post(url, body)
          .then( (response) => {
            setMinutesData( response.data );
            setData(response.data)
          } )

      } else {
        const response = await axios.post(`${API_URL}/query`, {
          metric: configuration.metric,
          condition: configuration.condition,
          accessibility_info: configuration.accessibility_info,
        });
        setData(response.data);
      }
    }
    fetchData();
  }, [
    configuration.metric,
    configuration.condition,
    configuration.accessibility_info,
  ]);

  return (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      {/* <Chat
        onSend={(query) =>
          setConfiguration({
            ...configuration,
            metric: query.metric,
            condition: query.condition,
          })
        }
      /> */}
      <MainSidebar>
      </MainSidebar>
      <BaseMap></BaseMap>
      {/* {mode === "explore" ? (
        <LensMap
          aggregatedInfo={aggregatedInfo}
          data={data}
          selectedLots={selectedLots}
          setSelectedLots={setSelectedLots}
          visible={configuration.visible}
          coords={coords}
          metric={configuration.metric}
          isSatellite={configuration.isSatellite}
        />
      ) : (
        <CustomMap
          aggregatedInfo={aggregatedInfo}
          data={data}
          selectedLots={selectedLots}
          setSelectedLots={setSelectedLots}
          visible={configuration.visible}
          coords={coords}
          metric={configuration.metric}
          isSatellite={configuration.isSatellite}
        />
      )} */}
      {/* <ConfigurationToolbar
        configuration={configuration}
        setConfiguration={setConfiguration}
        supermercados={supermercados}
        setParques={setParques}
        setSalud={setSalud}
        setEducacion={setEducacion}
        setServicios={setServicios}
        setSupermercados={setSupermercados}
      /> */}

      {selectedLots.length > 0 && (
        <Box
          style={{
            position: "absolute",
            width: "25%",
            height: "100dvh",
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 1000,
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <LotSidebar
            aggregatedInfo={aggregatedInfo}
            selectedLots={selectedLots}
            setSelectedLots={setSelectedLots}
            parques={parques}
            salud={salud}
            educacion={educacion}
            servicios={servicios}
            supermercados={supermercados}
          />
        </Box>
      )}
    </div>
  );
}

export default App;
