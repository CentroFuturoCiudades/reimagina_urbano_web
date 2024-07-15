import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VIEW_MODES } from '../../constants';

interface ViewModeState {
    viewMode: VIEW_MODES;
}

const initialState: ViewModeState = {
    viewMode: VIEW_MODES.FULL
};

const viewModeSlice = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction< VIEW_MODES >) => {
            state.viewMode = action.payload;
        }
    }
});

export const { setViewMode } = viewModeSlice.actions;

export default viewModeSlice.reducer;
