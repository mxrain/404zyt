import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tabs: [],
  activeTab: '/',
}

export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action) => {
      if (!state.tabs.find((tab) => tab.path === action.payload.path)) {
        state.tabs.push(action.payload)
      }
      state.activeTab = action.payload.path
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.path !== action.payload)
      if (state.activeTab === action.payload) {
        state.activeTab = state.tabs[state.tabs.length - 1]?.path || '/'
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
  },
})

export const { addTab, removeTab, setActiveTab } = tabSlice.actions

export default tabSlice.reducer