import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layer } from 'deck.gl';

interface LayersState {
    layers: any[];
}

const initialState: LayersState = {
    layers: []
};

const layersSlice = createSlice({
    name: 'layers',
    initialState,
    reducers: {
        setLayers: (state, action: PayloadAction< any[] >) => {
            state.layers = action.payload;
        }
    }
});

export const { setLayers } = layersSlice.actions;

export default layersSlice.reducer;
