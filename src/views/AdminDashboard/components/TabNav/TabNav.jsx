import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeTab, setActiveTab, setActiveTabTitle } from '../../../../features/sysTabs/tabSlice'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import styles from './TabNav.module.css'

export default function TabNav() {
  const { tabs, activeTab } = useSelector((state) => state.tabs)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (tabs.length === 0) {
      navigate('/sys')
    }
  }, [tabs, navigate])

  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab')
    const savedActiveTabTitle = localStorage.getItem('activeTabTitle')
    if (savedActiveTab && savedActiveTabTitle) {
      dispatch(setActiveTab(savedActiveTab))
      dispatch(setActiveTabTitle(savedActiveTabTitle))
    }
  }, [dispatch])

  const handleCloseTab = (e, path) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeTab(path))
  }

  const handleSetActiveTab = (path, title) => {
    dispatch(setActiveTab(path))
    dispatch(setActiveTabTitle(title))
  }

  return (
    <div className={styles.tabNavWrapper}>
      {tabs.length === 0 ? (
        <div style={{ minHeight: '41px' }}></div> // 空的占位 div
      ) : (
        tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`${styles.tab} ${tab.path === activeTab ? styles.active : ''}`}
            onClick={() => handleSetActiveTab(tab.path, tab.title)}
          >
            {tab.title}
            <button className={styles.closeButton} onClick={(e) => handleCloseTab(e, tab.path)}>
              <X size={14} />
            </button>
          </Link>
        ))
      )}
    </div>
  )
}