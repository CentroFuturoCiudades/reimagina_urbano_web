import React, { useEffect, useState } from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import "./MainSidebar.scss";
import { API_URL, TABS, VIEW_MODES } from "../../constants";
import axios from "axios";
import Visor from "../../content/Visor";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import Toolbar from "../Toolbar";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { Accesibilidad } from "../../content";
import { setActiveTab } from "../../features/viewMode/viewModeSlice";

const MainSidebar = () => {
    const [metrics, setMetrics] = useState<any>({});

    const selectedLots = useSelector(
        (state: RootState) => state.selectedLots.selectedLots
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const lots =
                selectedLots &&
                selectedLots.length &&
                viewMode !== VIEW_MODES.FULL
                    ? selectedLots.filter((x) => x !== undefined)
                    : undefined;
            const response = await axios.post(`${API_URL}/predios`, { lots });
            if (response && response.data) {
                setMetrics(response.data);
            }
        };
        fetchData();
    }, [selectedLots]);

    return (
        <Tabs
            className="mainSidebar"
            variant="soft-rounded"
            colorScheme="green"
        >
            <TabList>
                <Tab
                    className="tab-visor"
                    _selected={{
                        bg: "var(--visor-primary-opacity)",
                        color: "white",
                    }}
                    onClick={() => {
                        dispatch( setActiveTab( TABS.VISOR ) )
                        dispatch(setQueryMetric("POBTOT"));
                    }}
                >
                    Visor
                </Tab>
                <Tab
                    className="tab-accesibilidad"
                    _selected={{
                        bg: "var(--accesibilidad-primary-opacity)",
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
                        bg: "rgba(206, 173, 102, 0.8)",
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
    );
};

export default MainSidebar;
