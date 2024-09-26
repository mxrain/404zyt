import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tabs: JSON.parse(localStorage.getItem('tabs')) || [],
  activeTab: localStorage.getItem('activeTab') || '',
  activeTabTitle: localStorage.getItem('activeTabTitle') || ''
}

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action) => {
      const tabExists = state.tabs.some(tab => tab.path === action.payload.path)
      if (!tabExists) {
        state.tabs.push(action.payload)
        localStorage.setItem('tabs', JSON.stringify(state.tabs))
      }
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter(tab => tab.path !== action.payload)
      localStorage.setItem('tabs', JSON.stringify(state.tabs))
    },
    removeAllTabs: (state) => {
      state.tabs = []
      state.activeTab = ''
      state.activeTabTitle = ''
      localStorage.removeItem('tabs')
      localStorage.removeItem('activeTab')
      localStorage.removeItem('activeTabTitle')
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
      localStorage.setItem('activeTab', state.activeTab)
    },
    setActiveTabTitle: (state, action) => {
      state.activeTabTitle = action.payload
      localStorage.setItem('activeTabTitle', state.activeTabTitle)
    }
  }
})

export const { addTab, removeTab, removeAllTabs, setActiveTab, setActiveTabTitle } = tabSlice.actions
export default tabSlice.reducer