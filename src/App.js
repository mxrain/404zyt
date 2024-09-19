import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import ErrorBoundary from './views/ErrorBoundary/ErrorBoundary';
import HomePage from './views/HomePage/HomePage';
import ResourceHelp from './views/ResourceHelp/ResourceHelp';
import NotFound from './views/NotFound/NotFound';
import CategoryPage from './views/CategoryPage/CategoryPage';
import AdminDashboard from './views/AdminDashboard/AdminDashboard';
import Login from './views/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import PeriodicVerification from './components/PeriodicVerification/PeriodicVerification';
// 导入管理后台子页面
import Overview from './views/AdminDashboard/components/Overview/Overview';
import Settings from './views/AdminDashboard/components/Settings/Settings';
import Users from './views/AdminDashboard/components/Users/Users';

function App() {
  return (
    <ErrorBoundary>
      <PeriodicVerification />
      <Router>
        <Routes>
          {/* AdminDashboard 路由 - 不包含 Header */}
          <Route path="/sys" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="/sys/settings" element={<Settings />} />
            <Route path="/sys/users" element={<Users />} />
            <Route path="/sys/products" element={<h1>产品页面</h1>} />
            <Route path="/sys/analytics" element={<h1>分析页面</h1>} />
          </Route>
          
          <Route path="/login" element={<Login />} />

          {/* 其他路由 - 包含 Header */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="resource-help" element={<ResourceHelp />} />
                  <Route path="category/:categoryName" element={<CategoryPage />} />
                </Routes>
              </main>
            </>
          } />

          {/* NotFound 路由应该放在最后 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
