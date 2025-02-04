import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueryMetricState {
    scenariosAmenities: any;
    currentScenarioAmenity: any;
    isScenarioEdit: boolean;
}

const initialState: QueryMetricState = {
    scenariosAmenities: {
        type: "FeatureCollection",
        features: [],
    },
    currentScenarioAmenity: undefined,
    isScenarioEdit: false,
};

const scenariosSlice = createSlice({
    name: "scenarios",
    initialState,
    reducers: {
        setCurrentScenarioAmenity: (state, action: PayloadAction<any>) => {
            state.currentScenarioAmenity = action.payload;
        },
        addScenarioAmenity: (state, action: PayloadAction<any>) => {
            state.scenariosAmenities.features.push(action.payload);
        },
        removeScenarioAmenity: (state, action: PayloadAction<any>) => {
            state.scenariosAmenities.features =
                state.scenariosAmenities.features.filter(
                    (feature: any) => feature.properties.id !== action.payload
                );
        },
        editScenarioAmenity: (state, action: PayloadAction<any>) => {
            // state.scenariosAmenities.features =
            //     state.scenariosAmenities.features.map((feature: any) =>
            //         feature.properties.id === action.payload.properties.id
            //             ? action.payload
            //             : feature
            //     );
            const index = state.scenariosAmenities.features.findIndex(
                (feature: any) =>
                    feature.properties.id === action.payload.properties.id
            );
            state.scenariosAmenities.features[index] = action.payload;
        },
        setScenarioEdit: (state, action: PayloadAction<boolean>) => {
            state.isScenarioEdit = action.payload;
        }
    },
});

export const {
    setCurrentScenarioAmenity,
    addScenarioAmenity,
    removeScenarioAmenity,
    editScenarioAmenity,
    setScenarioEdit,
} = scenariosSlice.actions;

export default scenariosSlice.reducer;
