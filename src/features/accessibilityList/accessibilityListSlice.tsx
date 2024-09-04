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
        setAccesibilityPoints: (state, action: PayloadAction< GenericObject[] >) => {
            state.accessibilityPoints = action.payload;
        }
    }
});

export const { setAccessibilityList, setAccesibilityPoints } = accessibilityListSlice.actions;

export default accessibilityListSlice.reducer;
