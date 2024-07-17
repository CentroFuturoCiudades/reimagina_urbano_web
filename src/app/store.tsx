import { configureStore } from '@reduxjs/toolkit';
import baseColorReducer from '../features/baseColor/baseColorSlice';
import queryMetricReducer from "../features/queryMetric/queryMetricSlice"
import viewModeReducer from "../features/viewMode/viewModeSlice";
import accSettingsReducer from '../features/accSettings/accSettingsSlice';
//import zoomLevelReducer from '../features/viewState/viewStateSlice';
import viewStateReducer from '../features/viewState/viewStateSlice';

const store = configureStore({
  reducer: {
    baseColor: baseColorReducer,
    queryMetric: queryMetricReducer,
    viewMode: viewModeReducer,
    accSettings: accSettingsReducer,
    //zoomLevel: zoomLevelReducer
    viewState: viewStateReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
