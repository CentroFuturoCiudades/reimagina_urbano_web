import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "../../constants";

interface zoomLevelState {
    //baseColor: [number, number, number, number];
    latitude: number,
    longitude: number,
    zoom: number,
    transitionDuration: number,
    pitch: number,
    maxPitch: number,
    bearing: number,
    minZoom: number,
    maxZoom: number,
}

const zoomLevelSlice = createSlice ({
    name: 'zoomLevel',
    initialState: INITIAL_STATE,
    reducers: {
        setZoomLevel: (state, action: PayloadAction<number>) => {
        state.zoom = action.payload;
        }
    }
});

export const {setZoomLevel} = zoomLevelSlice.actions;
export default zoomLevelSlice.reducer;