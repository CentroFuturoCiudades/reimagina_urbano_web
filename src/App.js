import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";

import { Custom3DMap } from "./Custom3DMap";
import { CustomMap } from "./CustomMap";
import { API_URL } from "./constants";
import { LotSidebar } from "./LotSidebar";
import "./App.css";
import { Chat } from "./Chat";
import { Toolbar } from "./ConfigurationToolbar";
import {Icon, IconButton} from '@chakra-ui/react';
import { MdAdd, MdOutlineMotionPhotosOff } from "react-icons/md";
import Legend from "./Legend"; 

function App() {
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);
  const [aggregatedInfo, setAggregatedInfo] = useState();
  const [configuration, setConfiguration] = useState({
    condition: undefined,
    metric: "wasteful_ratio",
    isSatellite: false,
    opacities: {
      parking: 0,
      building: 0,
      park: 0,
      green: 0,
      equipment: 0,
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
  console.log(selectedLots)
  const [coords, setCoords] = useState();
  const [parques, setParques] = useState({ activated: true, value: 0 });
  const [salud, setSalud] = useState({ activated: true, value: 0 });
  const [educacion, setEducacion] = useState({ activated: true, value: 0 });
  const [servicios, setServicios] = useState({ activated: true, value: 0 });
  const [supermercados, setSupermercados] = useState({ activated: true, value: 0 });
  const project = window.location.pathname.split("/")[1];

  const handleIsActive = () => 
  {
    setIsActive((isActive)=> !isActive)
  }

  useEffect(() => {
    async function updateProject() {
      await axios.get(`${API_URL}/project/${project}`);
      const coords = await axios.get(`${API_URL}/coords`);
      setCoords(coords.data);
    }
    updateProject();
  }, [project]);

  console.log(aggregatedInfo)

  useEffect(() => {
    console.log(selectedLots)

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

  useEffect(()=>{
    if(isActive)
      setSelectedLots([])
  },[isActive])

  useEffect(() => {
    async function fetchData() {
      console.log(configuration.metric);
      const response = await axios.post(`${API_URL}/query`, {
        metric: configuration.metric,
        condition: configuration.condition,
        accessibility_info: configuration.accessibility_info,
      });
      setData(response.data);
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
      <CustomMap
        aggregatedInfo={aggregatedInfo}
        data={data}
        selectedLots={selectedLots}
        setSelectedLots={setSelectedLots}
        opacities={configuration.opacities}
        coords={coords}
        metric={configuration.metric}
        activeSketch={isActive}
        isSatellite={configuration.isSatellite}
      />
      <Toolbar
        configuration={configuration}
        setConfiguration={setConfiguration}
        supermercados={supermercados}
        setParques={setParques}
        setSalud={setSalud}
        setEducacion={setEducacion}
        setServicios={setServicios}
        setSupermercados={setSupermercados}
      />
      <div
        style={{
          position: "absolute",
          top: '20px',
          right: '100px',
          marginRight: '250px'
        }}
      >
      <IconButton
          icon={isActive ? (<Icon as={MdOutlineMotionPhotosOff} />):(<Icon as={MdAdd} />)}
          size="lg"
          colorScheme={isActive ? "red" : "blue"}
          isRound
          onClick={handleIsActive}
        />
      </div>
      {selectedLots.length > 0 && isActive && (
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
