import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericObject } from '../../types';


interface AccessibilityListState {
    accessibilityList: GenericObject[];
}

const initialState: AccessibilityListState = {
    accessibilityList: [] // Default
};

const accessibilityListSlice = createSlice({
    name: 'accessibilityList',
    initialState,
    reducers: {
        setAccessibilityList: (state, action: PayloadAction< GenericObject[] >) => {
        state.accessibilityList = action.payload;
        }
    }
});

export const { setAccessibilityList } = accessibilityListSlice.actions;

export default accessibilityListSlice.reducer;
