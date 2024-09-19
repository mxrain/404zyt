import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'; // 

// 验证 GitHub 访问的异步 thunk
export const verifyGithubAccess = createAsyncThunk(
  'auth/verifyGithubAccess',
  async ({ githubApi, owner, repo }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${githubApi}`,
        },
      });
      if (!response.ok) throw new Error('验证失败');
      return { githubApi, owner, repo };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 新增：定期验证的异步 thunk
export const checkAuthenticationStatus = createAsyncThunk(
  'auth/checkAuthenticationStatus',
  async (_, { dispatch, getState }) => {
    const { githubApi, owner, repo } = getState().auth;
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true';
    
    if (isAuthenticated && githubApi && owner && repo) {
      await dispatch(verifyGithubAccess({ githubApi, owner, repo }));
    }
    
    return isAuthenticated;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: Cookies.get('isAuthenticated') === 'true',
    githubApi: Cookies.get('githubApi') || '',
    owner: Cookies.get('owner') || '',
    repo: Cookies.get('repo') || '',
    error: null,
  },
  reducers: {
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
      Cookies.set('isAuthenticated', action.payload, { sameSite: 'None', secure: true });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.githubApi = '';
      state.owner = '';
      state.repo = '';
      Cookies.remove('githubApi', { sameSite: 'None', secure: true });
      Cookies.remove('owner', { sameSite: 'None', secure: true });
      Cookies.remove('repo', { sameSite: 'None', secure: true });
      Cookies.remove('isAuthenticated', { sameSite: 'None', secure: true });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyGithubAccess.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.githubApi = action.payload.githubApi;
        state.owner = action.payload.owner;
        state.repo = action.payload.repo;
        Cookies.set('githubApi', action.payload.githubApi, { sameSite: 'None', secure: true });
        Cookies.set('owner', action.payload.owner, { sameSite: 'None', secure: true });
        Cookies.set('repo', action.payload.repo, { sameSite: 'None', secure: true });
        Cookies.set('isAuthenticated', 'true', { sameSite: 'None', secure: true });
      })
      .addCase(verifyGithubAccess.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
        Cookies.remove('isAuthenticated', { sameSite: 'None', secure: true });
      })
      .addCase(checkAuthenticationStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
      });
  },
});

export const { setAuthStatus, logout } = authSlice.actions;
export default authSlice.reducer;
