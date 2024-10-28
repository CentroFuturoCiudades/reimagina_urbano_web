import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
    coordinates: number[][];
}

const initialState: Coordinates = {
    coordinates: [],
};

const coordinatesSlice = createSlice({
    name: "coordinates",
    initialState,
    reducers: {
        setCoordinates: (state, action: PayloadAction<number[][]>) => {
            state.coordinates = action.payload;
        },
    },
});

export const { setCoordinates } = coordinatesSlice.actions;

export default coordinatesSlice.reducer;
