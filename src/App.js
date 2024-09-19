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
          } />
          <Route path="/login" element={<Login />} />

          {/* 其他路由 - 包含 Header */}
          <Route path="*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/resource-help" element={<ResourceHelp />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
