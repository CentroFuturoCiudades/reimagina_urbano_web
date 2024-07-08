// src/features/baseColor/baseColorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BaseColorState {
    baseColor: [number, number, number, number];
}

const initialState: BaseColorState = {
    baseColor: [137, 151, 77, 255] // Default
};

const baseColorSlice = createSlice({
    name: 'baseColor',
    initialState,
    reducers: {
        setBaseColor: (state, action: PayloadAction< [number, number, number, number] >) => {
        state.baseColor = action.payload;
        }
    }
});

export const { setBaseColor } = baseColorSlice.actions;

export default baseColorSlice.reducer;
