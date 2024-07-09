import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewModeState {
    viewMode: string;
}

const initialState: ViewModeState = {
    viewMode: "full"
};

const viewModeSlice = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction< string >) => {
            state.viewMode = action.payload;
        }
    }
});

export const { setViewMode } = viewModeSlice.actions;

export default viewModeSlice.reducer;
