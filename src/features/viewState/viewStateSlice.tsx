import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "../../constants";

export interface ViewStateState {

    zoom: number;

}

const initialState: ViewStateState = {
    zoom: 15,
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
