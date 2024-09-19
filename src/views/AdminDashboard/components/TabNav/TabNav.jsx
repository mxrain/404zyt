import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { removeTab, setActiveTab } from '../../../../features/sysTabs/tabSlice'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const TabNavWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`

const Tab = styled(Link)`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-bottom: none;
  margin-right: 5px;
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;

  &.active {
    background-color: #f0f0f0;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 5px;
  }
`

export default function TabNav() {
  const { tabs, activeTab } = useSelector((state) => state.tabs)
  const dispatch = useDispatch()

  const handleCloseTab = (e, path) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeTab(path))
  }

  return (
    <TabNavWrapper>
      {tabs.map((tab) => (
        <Tab
          key={tab.path}
          to={tab.path}
          className={tab.path === activeTab ? 'active' : ''}
          onClick={() => dispatch(setActiveTab(tab.path))}
        >
          {tab.title}
          <button onClick={(e) => handleCloseTab(e, tab.path)}>
            <X size={14} />
          </button>
        </Tab>
      ))}
    </TabNavWrapper>
  )
}