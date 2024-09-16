import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './views/HomePage/HomePage';
import CategoryPage from './views/CategoryPage/CategoryPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<CategoryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
