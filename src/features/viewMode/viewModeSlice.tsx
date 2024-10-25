import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { POLYGON_MODES, TABS, VIEW_MODES } from '../../constants';
import { setCoords } from '../lensSettings/lensSettingsSlice';

interface coordsInterface {
    latitude: number;
    longitude: number;
}

interface ViewModeState {
    viewMode: VIEW_MODES;
    poligonMode: POLYGON_MODES;
    activeTab: TABS;
    isLoading: boolean;
    legendLimits: { min: number, max: number } | null;
    activeAmenity?: string;
    coords?: coordsInterface
}

const initialState: ViewModeState = {
    viewMode: VIEW_MODES.FULL,
    poligonMode: POLYGON_MODES.VIEW,
    activeTab: TABS.VISOR,
    isLoading: false,
    legendLimits: null,
    activeAmenity: undefined
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
        setActiveAmenity: (state, action: PayloadAction< string | undefined >) => {
            state.activeAmenity = action.payload;
        },
        setCoordsState: (state, action: PayloadAction< coordsInterface >) => {
            state.coords = action.payload;
        },
    }
});

export const { setViewMode, setPoligonMode, setActiveTab, setIsLoading, setLegendLimits, setActiveAmenity, setCoordsState } = viewModeSlice.actions;

export default viewModeSlice.reducer;
