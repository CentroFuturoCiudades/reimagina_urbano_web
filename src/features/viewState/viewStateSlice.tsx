import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_COORDS, INITIAL_STATE } from "../../constants";

export interface ViewStateState {
    viewState: any;
}

const initialState: ViewStateState = {
    viewState: {
        ...INITIAL_STATE,
        latitude: INITIAL_COORDS["culiacan_sur"][1],
        longitude: INITIAL_COORDS["culiacan_sur"][0],
    },
};

const viewStateSlice = createSlice({
    name: "viewState",
    initialState,
    reducers: {
        setZoom: (state, action: PayloadAction<number>) => {
            state.viewState.zoom = action.payload;
        },
        setViewState: (state, action: PayloadAction<any>) => {
            state.viewState = action.payload;
        },
    },
});

export const { setZoom, setViewState } = viewStateSlice.actions;
export default viewStateSlice.reducer;
