import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedLotsStat {
    selectedLots: string[];
}

const initialState: SelectedLotsStat = {
    selectedLots: []
};

const selectedLotsSlice = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        setSelectedLots: (state, action: PayloadAction< string[] >) => {
            state.selectedLots = action.payload;
        }
    }
});

export const { setSelectedLots } = selectedLotsSlice.actions;

export default selectedLotsSlice.reducer;
