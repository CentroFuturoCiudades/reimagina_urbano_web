// src/features/baseColor/baseColorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericObject } from '../../types';

interface AccSettingsState {
    accSettings: GenericObject;
}

const initialState: AccSettingsState = {
    accSettings: {
        proximity_small_park: 2,
        proximity_salud: 2,
        proximity_educacion: 1,
        proximity_servicios: 5,
        proximity_supermercado: 1,
    }
};

const accSettingSlice = createSlice({
    name: 'accSettings',
    initialState,
    reducers: {
        setAccSettings: (state, action: PayloadAction< GenericObject >) => {
            state.accSettings = action.payload;
        }
    }
});

export const { setAccSettings } = accSettingSlice.actions;

export default accSettingSlice.reducer;
