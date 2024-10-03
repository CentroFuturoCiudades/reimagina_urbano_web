import React, { useEffect, useState } from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel, Button } from "@chakra-ui/react";
import "./MainSidebar.scss";
import { TABS, VIEW_MODES } from "../../constants";
import axios from "axios";
import Visor from "../../content/Visor";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import Toolbar from "../Toolbar";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { Accesibilidad } from "../../content";
import { setActiveTab } from "../../features/viewMode/viewModeSlice";
import { FaChevronUp } from "react-icons/fa";


    
  const MainSidebar = () => {    
    const [metrics, setMetrics] = useState<any>({});

    const selectedLots = useSelector(
        (state: RootState) => state.selectedLots.selectedLots
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedLots.length === 0) return;
            const lots =
                selectedLots &&
                selectedLots.length &&
                viewMode !== VIEW_MODES.FULL
                    ? selectedLots.filter((x) => x !== undefined)
                    : undefined;
            console.log('--PREDIOS--');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/predios`, { lots });
            if (response && response.data) {
                console.log(response.data);
                setMetrics(response.data);
            }
        };
        fetchData();
    }, [selectedLots]);

    return (
        <>

        <Tabs
            className="mainSidebar"
            variant="soft-rounded"
            colorScheme="green"
        >
            <TabList>
                <Tab
                    className="tab-visor"
                    _selected={{
                        bg: "var(--visor-primary)",
                        color: "white",
                    }}
                    onClick={() => {
                        dispatch( setActiveTab( TABS.VISOR ) )
                        dispatch(setQueryMetric("poblacion"));
                    }}
                >
                    Visor
                </Tab>
                <Tab
                    className="tab-accesibilidad"
                    _selected={{
                        bg: "var(--accesibilidad-primary)",
                        color: "white",
                    }}
                    onClick={() => {
                        dispatch( setActiveTab( TABS.ACCESIBILIDAD ) )
                        dispatch(setQueryMetric("minutes"));
                    }}
                >
                    Accesibilidad
                </Tab>
                <Tab
                    className="tab-potencial"
                    _selected={{
                        bg: "var(--potencial-primary)",
                        color: "white",
                    }}
                    onClick={() => {
                        dispatch( setActiveTab( TABS.POTENCIAL ) )
                    }}
                >
                    Potencial
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Visor metrics={metrics}></Visor>
                </TabPanel>
                <TabPanel>
                    <Accesibilidad metrics={metrics}></Accesibilidad>
                </TabPanel>
                <TabPanel>
                    <p>Contenido de Potencial</p>
                    {/* Agrega el contenido específico de Infraestructura aquí */}
                </TabPanel>
            </TabPanels>
            <Toolbar></Toolbar>
        </Tabs>
        </>

            
    );
};

export default MainSidebar;
