import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueryMetricState {
    queryMetric: string;
    globalData: any;
}

const initialState: QueryMetricState = {
    queryMetric: "poblacion",
    globalData: {},
};

const queryMetricSlice = createSlice({
    name: 'queryMetric',
    initialState,
    reducers: {
        setQueryMetric: (state, action: PayloadAction< string >) => {
            state.queryMetric = action.payload;
        },
        setGlobalData: (state, action: PayloadAction< any >) => {
            state.globalData = action.payload;
        }
    }
});

export const { setQueryMetric, setGlobalData } = queryMetricSlice.actions;

export default queryMetricSlice.reducer;
