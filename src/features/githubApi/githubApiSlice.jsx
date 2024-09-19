import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 异步 thunk 用于获取用户数据
export const fetchUserData = createAsyncThunk(
  'githubApi/fetchUserData',
  async (_, { getState }) => {
    const { githubApi, githubUsername } = getState().githubApi;
    if (!githubApi || !githubUsername) {
      throw new Error('GitHub 凭证未设置');
    }
    const response = await axios.get(`https://api.github.com/users/${githubUsername}`, {
      headers: { Authorization: `token ${githubApi}` }
    });
    return response.data;
  }
);

const githubApiSlice = createSlice({
  name: 'githubApi',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
    githubApi: null,
    githubUsername: null,
    repoUrl: null
  },
  reducers: {
    setGithubInfo: (state, action) => {
      state.githubApi = action.payload.githubApi;
      state.githubUsername = action.payload.githubUsername;
      state.repoUrl = action.payload.repoUrl;
    },
    clearGithubInfo: (state) => {
      state.githubApi = null;
      state.githubUsername = null;
      state.repoUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setGithubInfo, clearGithubInfo } = githubApiSlice.actions;

export const selectGithubInfo = (state) => ({
  githubApi: state.githubApi.githubApi,
  githubUsername: state.githubApi.githubUsername,
  repoUrl: state.githubApi.repoUrl
});

export const selectGithubData = (state) => state.githubApi.data;
export const selectGithubStatus = (state) => state.githubApi.status;
export const selectGithubError = (state) => state.githubApi.error;

export default githubApiSlice.reducer;
