import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericObject } from '../../types';


interface AccessibilityListState {
    accessibilityList: GenericObject[];
    accessibilityPoints: GenericObject[];
    selectedAmenity: any | undefined;
}

const initialState: AccessibilityListState = {
    accessibilityList: [], // Default
    accessibilityPoints: [],
    selectedAmenity: undefined
};

const accessibilityListSlice = createSlice({
    name: 'accessibilityList',
    initialState,
    reducers: {
        setAccessibilityList: (state, action: PayloadAction<GenericObject[]>) => {
            state.accessibilityList = action.payload;
        },
        setAccessibilityPoints: (state, action: PayloadAction<GenericObject[]>) => {
            state.accessibilityPoints = action.payload;
        },
        setSelectedAmenity: (state, action: PayloadAction<any>) => {
            let amenity = action.payload;
            if (amenity.extra_data) {
                const fixedJsonString = amenity.extra_data
                    .replace(/'/g, '"')
                    .replace(/\s+/g, ' ')
                    .replace(/None/g, 'null');
                amenity = { ...amenity, ...JSON.parse(fixedJsonString) };
            }
            console.log(amenity);
            state.selectedAmenity = amenity;
        },
        clearSelectedAmenity: (state) => {
            state.selectedAmenity = undefined;
        }
    }
});

export const { setAccessibilityList, setAccessibilityPoints, setSelectedAmenity, clearSelectedAmenity } = accessibilityListSlice.actions;

export default accessibilityListSlice.reducer;
