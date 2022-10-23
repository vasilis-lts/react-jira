import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import CheckingAuth from './components/CheckingAuth';
import useAuthState from './hooks/useAuthState';
import AssetDetails from './screens/AssetDetails';
import Assets from './screens/Assets';
import Login from './screens/Login';

function App() {
  const { AuthStatus } = useAuthState();

  return <div className="App">
    {AuthStatus === 'checkingAuth' && <CheckingAuth />}
    {AuthStatus === 'loggedOut' && <Routes><Route path="/" element={<Login />} /></Routes>}

    {AuthStatus === 'loggedIn' &&
      <Routes>
        <Route path="/" element={<Assets />} />
        <Route path="asset/:id" element={<AssetDetails />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    }

  </div>
}

export default App;
