import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FindaRide from './pages/FindaRide'; // Import Find a Ride page
import StartCarpooling from './pages/StartCarpooling'; // Import Start Carpooling page
import Layout from './components/Layout'; // Import the Layout component
import RegisterLogin from './pages/RegisterLogin'; // Import the Layout component
import Login from './pages/Login'; 
import ChatBot from './components/Mariobot.jsx'; // Adjust the path as necessary
import About from './pages/About'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/findaride" element={<FindaRide />} /> {/* Route for Find a Ride */}
          <Route path="/startcarpooling" element={<StartCarpooling />} />
          <Route path="/RegisterLogin" element={<RegisterLogin />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/About" element={<About />} /> 
        </Route>
      </Routes>
      <ChatBot /> {/* Make sure this is included */}
    </Router>
  );
}

export default App;