import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "../../constants";

export interface ViewStateState {
    latitude: number;
    longitude: number;
    zoom: number;
    transitionDuration: number;
    pitch: number;
    maxPitch: number;
    bearing: number;
    minZoom: number;
    maxZoom: number;
}

const initialState: ViewStateState = {
    latitude: 25.65,
    longitude: -100.287419,
    zoom: 15,
    transitionDuration: 100,
    pitch: 60,
    maxPitch: 85,
    bearing: 0,
    minZoom: 12,
    maxZoom: 22,
};

const viewStateSlice = createSlice ({
    name: 'viewState',
    //initialState: INITIAL_STATE,
    initialState,
    /*reducers: {
        setViewState: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        }
    }*/
    reducers: {
        setViewState: (state, action: PayloadAction<ViewStateState>) => {
            return({...state, ...action.payload})
        }
    }
});

export const {setViewState} = viewStateSlice.actions;
export default viewStateSlice.reducer;