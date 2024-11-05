import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { POLYGON_MODES, TABS, VIEW_MODES } from '../../constants';

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
    coords?: coordsInterface;
    projectCoords?: coordsInterface;
    colonias?: any[];
    selectedColonias: any[];
    project: string;
}

const initialState: ViewModeState = {
    viewMode: VIEW_MODES.FULL,
    poligonMode: POLYGON_MODES.VIEW,
    activeTab: TABS.VISOR,
    isLoading: false,
    legendLimits: null,
    projectCoords: undefined,
    activeAmenity: undefined,
    colonias: [],
    selectedColonias: [],
    project: window.location.hash.replace("#", ""),
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
        setProjectCoords: (state, action: PayloadAction< coordsInterface >) => {
            state.projectCoords = action.payload;
        },
        setColonias: (state, action: PayloadAction< any[] >) => {
            state.colonias = action.payload;
        },
        toggleSelectedColonias: (state, action: PayloadAction< any >) => {
            const col = state.selectedColonias;
            if (col.includes(action.payload)) {
                state.selectedColonias = col.filter((x: any) => x !== action.payload);
            } else {
                state.selectedColonias = [...col, action.payload];
            }
        },
        clearSelectedColonias: (state) => {
            state.selectedColonias = [];
        },
        setProject: (state, action: PayloadAction< string >) => {
            state.project = action.payload;
            window.location.href = "#" + state.project;
        },
    }
});

export const { setViewMode, setPoligonMode, setActiveTab, setIsLoading, setLegendLimits, setActiveAmenity, setCoordsState, setColonias, toggleSelectedColonias, clearSelectedColonias, setProject, setProjectCoords } = viewModeSlice.actions;

export default viewModeSlice.reducer;
