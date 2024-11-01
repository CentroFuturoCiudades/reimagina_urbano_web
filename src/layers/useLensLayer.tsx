import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useCallback, useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { GeoJsonLayer, PickInfo } from "deck.gl";
import { debounce } from "lodash";
import { VIEW_MODES, ZOOM_SHOW_DETAILS } from "../constants";
import { setDrag } from "../features/lensSettings/lensSettingsSlice";
import { setCoordinates } from "../features/coordinates/coordinatesSlice";

const useLensLayer = () => {
    const dispatch: AppDispatch = useDispatch();
    const isDrag = useSelector((state: RootState) => state.lensSettings.isDrag);
    const viewMode = useSelector((state: RootState) => state.viewMode.viewMode);
    const zoom = useSelector((state: RootState) => state.viewState.zoom);
    const coords = useSelector((state: RootState) => state.viewMode.coords);
    const lensRadius = useSelector(
        (state: RootState) => state.viewMode.lensRadius
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
            lensRadius,
            {
                units: "meters",
            }
        );
        setPolygon(temp);
    }, [circleCoords, lensRadius]);

    useEffect(() => {
        if (viewMode !== VIEW_MODES.LENS || isDrag) return;
        const coords = [polygon?.geometry.coordinates[0]];
        dispatch(setCoordinates(coords));
    }, [polygon, viewMode, isDrag]);

    const handleHover = useCallback((info: PickInfo<unknown>) => {
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
        pickable: zoom < ZOOM_SHOW_DETAILS,
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
        data: circleCoords ? [{
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [circleCoords.longitude, circleCoords.latitude],
            },
        }] : [],
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
