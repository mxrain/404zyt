import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuthCookie } from './utils/auth';

import Header from './components/Header';
import ErrorBoundary from './views/ErrorBoundary/ErrorBoundary';
import HomePage from './views/HomePage/HomePage';
import ResourceHelp from './views/ResourceHelp/ResourceHelp';
import NotFound from './views/NotFound/NotFound';
import CategoryPage from './views/CategoryPage/CategoryPage';
import AdminDashboard from './views/AdminDashboard/AdminDashboard';
import Login from './views/Login/Login';

const ProtectedRoute = ({ children }) => {
  const authData = getAuthCookie();
  if (!authData) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
        <Router>
          <div className="app-container">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resource-help" element={<ResourceHelp />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sys" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
    </ErrorBoundary>
  );
}

export default App;
