import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueryMetricState {
    queryMetric: string;
}

const initialState: QueryMetricState = {
    queryMetric: "poblacion"
};

const queryMetricSlice = createSlice({
    name: 'queryMetric',
    initialState,
    reducers: {
        setQueryMetric: (state, action: PayloadAction< string >) => {
            state.queryMetric = action.payload;
        }
    }
});

export const { setQueryMetric } = queryMetricSlice.actions;

export default queryMetricSlice.reducer;
