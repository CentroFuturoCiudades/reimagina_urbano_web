import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LensSettingsState {
    brushingRadius: number;
    coords: [number, number];
    isDrag: boolean;
}

const initialState: LensSettingsState = {
    brushingRadius: 400,
    coords: [-107.39367959923534, 24.753450686162093],
    isDrag: false
};

const lensSettingsSlice = createSlice({
    name: 'lensSettings',
    initialState,
    reducers: {
        setBrushingRadius: (state, action: PayloadAction< number >) => {
            state.brushingRadius = action.payload;
        },
        setCoords: (state, action: PayloadAction< [number, number] >) => {
            state.coords = action.payload;
        },
        setDrag: (state, action: PayloadAction< boolean >) => {
            state.isDrag = action.payload;
        },
    }
});

export const { setBrushingRadius, setCoords, setDrag } = lensSettingsSlice.actions;

export default lensSettingsSlice.reducer;
