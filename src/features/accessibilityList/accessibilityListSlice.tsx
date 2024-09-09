import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericObject } from '../../types';


interface AccessibilityListState {
    accessibilityList: GenericObject[];
    accessibilityPoints: GenericObject[];
}

const initialState: AccessibilityListState = {
    accessibilityList: [], // Default
    accessibilityPoints: []
};

const accessibilityListSlice = createSlice({
    name: 'accessibilityList',
    initialState,
    reducers: {
        setAccessibilityList: (state, action: PayloadAction< GenericObject[] >) => {
            state.accessibilityList = action.payload;
        },
        setAccessibilityPoints: (state, action: PayloadAction< GenericObject[] >) => {
            state.accessibilityPoints = action.payload;
        }
    }
});

export const { setAccessibilityList, setAccessibilityPoints } = accessibilityListSlice.actions;

export default accessibilityListSlice.reducer;
