import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
// import TabComponent from './components/TabComponent/TabComponent';
import ErrorBoundary from './views/ErrorBoundary/ErrorBoundary';
import HomePage from './views/HomePage/HomePage';
import ResourceHelp from './views/ResourceHelp/ResourceHelp';
import NotFound from './views/NotFound/NotFound';
import CategoryPage from './views/CategoryPage/CategoryPage';

function App() {
  return (
    <ErrorBoundary>
        <Router>
          <div className="app-container">
            <Header />
            {/* <TabComponent /> */}
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resource-help" element={<ResourceHelp />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
    </ErrorBoundary>
  );
}

export default App;
