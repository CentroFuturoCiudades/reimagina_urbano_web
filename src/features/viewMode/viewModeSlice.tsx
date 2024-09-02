import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { POLYGON_MODES, VIEW_MODES } from '../../constants';

interface ViewModeState {
    viewMode: VIEW_MODES;
    poligonMode: POLYGON_MODES
}

const initialState: ViewModeState = {
    viewMode: VIEW_MODES.FULL,
    poligonMode: POLYGON_MODES.VIEW
};

const viewModeSlice = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction< VIEW_MODES >) => {
            state.viewMode = action.payload;
        },
        setPoligonMode: (state, action: PayloadAction< POLYGON_MODES >) => {
            state.poligonMode = action.payload;
        },
    }
});

export const { setViewMode, setPoligonMode } = viewModeSlice.actions;

export default viewModeSlice.reducer;
