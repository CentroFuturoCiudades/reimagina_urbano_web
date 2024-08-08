import React, { useEffect, useRef, useState } from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import "./MainSidebar.scss";
import { API_URL, VIEW_MODES } from "../../constants";
import axios from "axios";
import Visor from "../../content/Visor";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setBaseColor } from "../../features/baseColor/baseColorSlice";
import Toolbar from "../Toolbar";
import { setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { Accesibilidad } from "../../content";

const MainSidebar = () => {
    const [metrics, setMetrics] = useState<any>({});

    const selectedLots = useSelector((state: RootState) => state.selectedLots.selectedLots );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode );

    const dispatch: AppDispatch = useDispatch();

    useEffect( ()=> {
        let url = `${API_URL}/predios/`;

        if( selectedLots && selectedLots.length && viewMode != VIEW_MODES.FULL ){

            url += "?";

            url += selectedLots
                .filter(x => x != undefined )
                .map((x) => {
                    return `predio=${x}`
                })
                .join("&");

        }

        axios.get( url, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
            }
        } )
            .then( (response) => {
                if( response && response.data ){
                    setMetrics( response.data )
                }
            } )
    }, [ selectedLots ])

    return (
        <Tabs className="mainSidebar" variant="soft-rounded" colorScheme="green">
            <TabList>
                <Tab
                    className="tab-visor"
                    _selected={{ bg: "var(--visor-primary-opacity)", color: "white" }}
                    onClick={() => {
                        dispatch(setQueryMetric("POBTOT"));
                    }}
                >
                    Visor
                </Tab>
                <Tab
                    className="tab-accesibilidad"
                    _selected={{ bg: "rgba(133, 156, 190, 0.8)", color: "white" }}

                    onClick={() => {
                        dispatch(setQueryMetric("minutes"));
                    }}
                >
                    Accesibilidad
                </Tab>
                <Tab
                    className="tab-potencial"
                    _selected={{ bg: "rgba(206, 173, 102, 0.8)", color: "white" }}

                    onClick={() => {

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
