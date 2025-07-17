import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import ResetPass from './components/ResetPass/ResetPass';
import DashBoard from './components/DashBoard/DashBoard'; // Import your Dashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ResetPass" element={<ResetPass />} />
        <Route path="/DashBoard" element={<DashBoard />} />
        <Route path="/" element={<Navigate to="/SignIn" />} />
      </Routes>
    </Router>
  );
}


export default App;
