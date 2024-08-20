import { configureStore } from '@reduxjs/toolkit';
import queryMetricReducer from "../features/queryMetric/queryMetricSlice"
import viewModeReducer from "../features/viewMode/viewModeSlice";
import accessibilityListReducer from '../features/accessibilityList/accessibilityListSlice';
import selectedLotsReducer from '../features/selectedLots/selectedLotsSlice'
import lensSettingsReducer from '../features/lensSettings/lensSettingsSlice';
import queryDataReducer from '../features/queryData/queryDataSlice';
import viewStateReducer from '../features/viewState/viewStateSlice';

const store = configureStore({
  reducer: {
    queryMetric: queryMetricReducer,
    viewMode: viewModeReducer,
    accessibilityList: accessibilityListReducer,
    selectedLots: selectedLotsReducer,
    lensSettings: lensSettingsReducer,
    queryData: queryDataReducer,
    viewState: viewStateReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
