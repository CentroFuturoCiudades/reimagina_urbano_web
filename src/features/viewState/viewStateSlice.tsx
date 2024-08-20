import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ViewStateState {
    zoom: number;
}

const initialState: ViewStateState = {
    zoom: 15,
};

const viewStateSlice = createSlice ({
    name: 'viewState',
    initialState,
    reducers: {
        setViewState: (state, action: PayloadAction<ViewStateState>) => {
            return({...state, ...action.payload})
        }
    }
});

export const {setViewState} = viewStateSlice.actions;
export default viewStateSlice.reducer;
