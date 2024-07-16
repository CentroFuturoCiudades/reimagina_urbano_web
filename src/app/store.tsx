import { configureStore } from '@reduxjs/toolkit';
import baseColorReducer from '../features/baseColor/baseColorSlice';
import queryMetricReducer from "../features/queryMetric/queryMetricSlice"
import viewModeReducer from "../features/viewMode/viewModeSlice";
import accSettingsReducer from '../features/accSettings/accSettingsSlice';
import accessibilityListReducer from '../features/accessibilityList/accessibilityListSlice';
import selectedLotsReducer from '../features/selectedLots/selectedLotsSlice'

const store = configureStore({
  reducer: {
    baseColor: baseColorReducer,
    queryMetric: queryMetricReducer,
    viewMode: viewModeReducer,
    accSettings: accSettingsReducer,
    accessibilityList: accessibilityListReducer,
    selectedLots: selectedLotsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
