import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import TabNav from './TabNav'
import { Routes, Route } from 'react-router-dom'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`

export default function Layout() {
  return (
    <LayoutWrapper>
      <Header />
      <ContentWrapper>
        <Sidebar />
        <MainContent>
          <Breadcrumb />
          <TabNav />
          <Routes>
            {/* Add your routes here */}
            <Route path="/" element={<h1>Welcome to Dashboard</h1>} />
            <Route path="/users" element={<h1>Users Page</h1>} />
            <Route path="/products" element={<h1>Products Page</h1>} />
          </Routes>
        </MainContent>
      </ContentWrapper>
    </LayoutWrapper>
  )
}