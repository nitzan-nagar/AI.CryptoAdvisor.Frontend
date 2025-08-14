import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Onboarding from './pages/Onboarding/Onboarding.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
