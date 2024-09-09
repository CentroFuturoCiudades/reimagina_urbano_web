import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericObject } from '../../types';

interface QueryDataState {
    queryData: any[];
}

const initialState: QueryDataState = {
    queryData: []
};

const queryDataSlice = createSlice({
    name: 'queryData',
    initialState,
    reducers: {
        setQueryData: (state, action: PayloadAction<any[]>) => {
            state.queryData = action.payload;
        }
    }
});

export const { setQueryData } = queryDataSlice.actions;

export default queryDataSlice.reducer;
