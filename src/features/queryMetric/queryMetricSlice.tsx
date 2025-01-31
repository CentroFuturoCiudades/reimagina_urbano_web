import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueryMetricState {
    queryMetric: string;
    globalData: any;
    groupAges: string[];
    dataInfo: any;
}

const initialState: QueryMetricState = {
    queryMetric: "poblacion",
    globalData: {},
    groupAges: ["0-2", "3-5"],
    dataInfo: {},
};

const queryMetricSlice = createSlice({
    name: "queryMetric",
    initialState,
    reducers: {
        setQueryMetric: (state, action: PayloadAction<string>) => {
            state.queryMetric = action.payload;
        },
        setGlobalData: (state, action: PayloadAction<any>) => {
            state.globalData = action.payload;
        },
        setGroupAges: (state, action: PayloadAction<string[]>) => {
            state.groupAges = action.payload;
        },
        setDataInfo: (state, action: PayloadAction<any>) => {
            state.dataInfo = action.payload;
        },
    },
});

export const { setQueryMetric, setGlobalData, setGroupAges, setDataInfo } =
    queryMetricSlice.actions;

export default queryMetricSlice.reducer;
