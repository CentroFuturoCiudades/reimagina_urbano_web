import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { POLYGON_MODES, TABS, VIEW_MODES } from '../../constants';

interface ViewModeState {
    viewMode: VIEW_MODES;
    poligonMode: POLYGON_MODES;
    activeTab: TABS;
    isLoading: boolean;
    legendLimits: { min: number, max: number } | null;
}

const initialState: ViewModeState = {
    viewMode: VIEW_MODES.FULL,
    poligonMode: POLYGON_MODES.VIEW,
    activeTab: TABS.VISOR,
    isLoading: false,
    legendLimits: null
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
        setActiveTab: (state, action: PayloadAction< TABS >) => {
            state.activeTab = action.payload;
        },
        setIsLoading: (state, action: PayloadAction< boolean >) => {
            state.isLoading = action.payload;
        },
        setLegendLimits: (state, action: PayloadAction< { min: number, max: number }  | null >) => {
            state.legendLimits = action.payload;
        },
    }
});

export const { setViewMode, setPoligonMode, setActiveTab, setIsLoading, setLegendLimits } = viewModeSlice.actions;

export default viewModeSlice.reducer;
