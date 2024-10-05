import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDbData = createAsyncThunk(
    'db/fetchData',
    async () => {
        const response = await axios.get('https://raw.gitmirror.com/mxrain/404zyt/master/src/db/db.json');
        return response.data;
    }
);

const dbSlice = createSlice({
    name: 'db',
    initialState: {
        data: null,
        status: 'idle', // 状态：加载中、成功、失败
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDbData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDbData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchDbData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default dbSlice.reducer;