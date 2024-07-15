import React, { useEffect, useRef, useState } from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import "./MainSidebar.scss";
import { API_URL } from "../../constants";
import axios from "axios";
import Visor from "../../content/Visor";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { setBaseColor } from "../../features/baseColor/baseColorSlice";
import Toolbar from "../Toolbar";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { Accesibilidad } from "../../content";

const MainSidebar = () => {
    const [metrics, setMetrics] = useState<any>({});

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        axios.get(`${API_URL}/predios/`).then((response) => {
            if (response && response.data) {
                setMetrics(response.data);
            }
        });
    }, []);

    return (
        <Tabs className="mainSidebar" variant="soft-rounded" colorScheme="green">
            <TabList>
                <Tab
                    className="tab-visor"
                    _selected={{ bg: "rgba(137, 151, 77, 0.8)", color: "white" }}
                    onClick={() => {
                        dispatch(setBaseColor([137, 151, 77, 255]));
                        dispatch(setQueryMetric("POBTOT"));
                    }}
                >
                    Visor
                </Tab>
                <Tab
                    className="tab-accesibilidad"
                    _selected={{ bg: "rgba(133, 156, 190, 0.8)", color: "white" }}

                    onClick={() => {
                        dispatch(setBaseColor([133, 156, 190, 255]));
                        dispatch(setQueryMetric("minutes"));
                    }}
                >
                    Accesibilidad
                </Tab>
                <Tab
                    className="tab-potencial"
                    _selected={{ bg: "rgba(206, 173, 102, 0.8)", color: "white" }}

                    onClick={() => {
                        dispatch(setBaseColor([206, 173, 102, 255]));
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
                    <Accesibilidad></Accesibilidad>
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
