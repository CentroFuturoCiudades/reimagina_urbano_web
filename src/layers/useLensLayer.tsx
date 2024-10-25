import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useCallback, useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { GeoJsonLayer, PickInfo } from "deck.gl";
import { debounce } from "lodash";
import { VIEW_MODES, ZOOM_SHOW_DETAILS } from "../constants";
import { setDrag } from "../features/lensSettings/lensSettingsSlice";

const useLensLayer = ({ coords }: any) => {

    const dispatch: AppDispatch = useDispatch();
    const viewMode = useSelector( (state: RootState) => state.viewMode.viewMode );
    const zoom = useSelector((state: RootState) => state.viewState.zoom);

    const [circleRadius, setBrushingRadius] = useState(400); //radio esta en metros
    const [circleCoords, setCircleCoords] = useState([
        coords.longitude,
        coords.latitude,
    ]);
    const [isDrag, setIsDrag] = useState(false);
    const [data, setData] = useState<any>();

    useEffect(() => {
        if( coords.longitude ){
            const temp = turf.circle(circleCoords, circleRadius, {
                units: "meters",
            });
            setData(temp);
        }
    }, [ circleCoords ]);

    const handleHover = useCallback((info: PickInfo<unknown>) => {
        if (info && info.coordinate) {
            setCircleCoords([info.coordinate[0], info.coordinate[1]]);
        } else {
            setCircleCoords([]);
        }
    }, []);

    const debouncedHover = useCallback(debounce(handleHover, 100), [
        handleHover,
    ]);

    if( viewMode != VIEW_MODES.LENS || !coords.longitude ){
        return {
            layers: [],
            lensData: {},
        };
    }

    const lensLayer = new GeoJsonLayer({
        id: "circle",
        data: data,
        filled: true,
        getFillColor: [ 255, 255, 255, 0],
        getLineColor: [0, 120, 0, 255],
        getLineWidth: 10,
        pickable: zoom < ZOOM_SHOW_DETAILS,
        onDragStart: () => {
            setIsDrag(true);
            dispatch( setDrag( true ) );
        },
        onDrag: (info: any, event: any) => {
            if (info && info.coordinate)
                setCircleCoords([info.coordinate[0], info.coordinate[1]]);
        },
        onDragEnd: (info: any, event:any ) => {
            setIsDrag(false);
            debouncedHover(info);
            const temp = turf.circle(circleCoords, circleRadius, {
                units: "meters",
            });
            setData(temp);
            dispatch( setDrag( false ) );
        },
    });

    return {
        layers: [lensLayer],
        lensData: data,
    };

};

export default useLensLayer;
