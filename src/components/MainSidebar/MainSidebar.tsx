import React, { useEffect, useState } from "react";
import {
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Button,
} from "@chakra-ui/react";
import "./MainSidebar.scss";
import { TABS, VIEW_MODES } from "../../constants";
import axios from "axios";
import Visor from "../../content/Visor";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalData, setQueryMetric } from "../../features/queryMetric/queryMetricSlice";
import { Accesibilidad, Potencial } from "../../content";
import { setActiveTab } from "../../features/viewMode/viewModeSlice";
import { FaChevronUp } from "react-icons/fa";
import { GenericObject } from "../../types";

const MainSidebar = () => {
    const [metrics, setMetrics] = useState<any>({});

    const selectedLots = useSelector(
        (state: RootState) => state.selectedLots.selectedLots
    );
    const accessibilityList: GenericObject = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/predios`,
                {
                    lots: [],
                    type: "blocks",
                    accessibility_info: [],
                }
            );
            if (response && response.data) {
                dispatch(setGlobalData(response.data));
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedLots.length === 0) return;
            const lots =
                selectedLots &&
                selectedLots.length &&
                selectedLots.filter((x) => x !== undefined);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/predios`,
                {
                    lots,
                    type: viewMode === VIEW_MODES.FULL ? "blocks" : "lots",
                    accessibility_info: accessibilityList.map(
                        (x: any) => x.value
                    ),
                }
            );
            if (response && response.data) {
                setMetrics(response.data);
            }
        };
        fetchData();
    }, [selectedLots, accessibilityList]);

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
                            dispatch(setActiveTab(TABS.VISOR));
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
                            dispatch(setActiveTab(TABS.ACCESIBILIDAD));
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
                            dispatch(setActiveTab(TABS.POTENCIAL));
                            dispatch(setQueryMetric("density"));
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
                        <Potencial metrics={metrics}></Potencial>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

export default MainSidebar;
