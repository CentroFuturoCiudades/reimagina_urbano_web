import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueryDataState {
    queryData: any[];
}

const initialState: QueryDataState = {
    queryData: [],
};

const queryDataSlice = createSlice({
    name: "queryData",
    initialState,
    reducers: {
        setQueryData: (state, action: PayloadAction<any[]>) => {
            state.queryData = action.payload;
        },
    },
});

export const { setQueryData } = queryDataSlice.actions;

export default queryDataSlice.reducer;
