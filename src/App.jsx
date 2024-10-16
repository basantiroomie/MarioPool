import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterLogin from './pages/RegisterLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegisterLogin />} />
        <Route path="/login" element={<RegisterLogin />} />
        {/* Add other routes as you add more pages */}
      </Routes>
    </Router>
  );
}

export default App;
