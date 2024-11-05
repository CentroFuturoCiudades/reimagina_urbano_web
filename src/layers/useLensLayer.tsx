import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useCallback, useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { GeoJsonLayer } from "@deck.gl/layers";
import { debounce } from "lodash";
import { VIEW_MODES, ZOOM_SHOW_DETAILS } from "../constants";
import { setDrag } from "../features/lensSettings/lensSettingsSlice";
import { setCoordinates } from "../features/coordinates/coordinatesSlice";

const useLensLayer = () => {
    const dispatch: AppDispatch = useDispatch();
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const viewState = useSelector((state: RootState) => state.viewState.viewState);
    const coords = useSelector((state: RootState) => state.viewMode.coords);
    const radius = useSelector(
        (state: RootState) => state.lensSettings.radius
    );
    const [circleCoords, setCircleCoords] = useState(coords);
    const [polygon, setPolygon] = useState<any>();

    useEffect(() => {
        setCircleCoords(coords);
    }, [coords]);

    useEffect(() => {
        if (!circleCoords) return;
        const temp = turf.circle(
            [circleCoords.longitude, circleCoords.latitude],
            radius,
            {
                units: "meters",
            }
        );
        setPolygon(temp);
    }, [circleCoords, radius]);

    useEffect(() => {
        if (viewMode !== VIEW_MODES.LENS || isDrag) return;
        const coords = [polygon?.geometry.coordinates[0]];
        dispatch(setCoordinates(coords));
    }, [polygon, viewMode, isDrag]);

    const handleHover = useCallback((info: any) => {
        if (info && info.coordinate) {
            setCircleCoords({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
            });
        } else {
            setCircleCoords(undefined);
        }
    }, []);
    const debouncedHover = useCallback(debounce(handleHover, 100), [
        handleHover,
    ]);

    if (viewMode !== VIEW_MODES.LENS || !coords) return { layers: [] };

    const lensLayer = new GeoJsonLayer({
        id: "lens-layer",
        data: polygon,
        filled: true,
        getFillColor: [255, 255, 255, 0],
        getLineColor: [0, 120, 0, 255],
        getLineWidth: 10,
        pickable: viewState.zoom < ZOOM_SHOW_DETAILS,
        onDragStart: () => {
            dispatch(setDrag(true));
        },
        onDrag: (info: any, event: any) => {
            if (!info || !info.coordinate) return;
            setCircleCoords({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
            });
        },
        onDragEnd: (info: any, event: any) => {
            debouncedHover(info);
            dispatch(setDrag(false));
        },
    });

    const centerPointLayer = new GeoJsonLayer({
        id: "center-point-layer",
        data: circleCoords ? turf.point([circleCoords.longitude, circleCoords.latitude]) : undefined,
        filled: true,
        getLineColor: [150, 150, 150, 255],
        getLineWidth: 5,
        getFillColor: [200, 200, 200, 200],
        getRadius: 15,
        pickable: false,
    });

    return { layers: [lensLayer, centerPointLayer] };
};

export default useLensLayer;
