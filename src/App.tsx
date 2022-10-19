import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route path="assets" element={<Assets />} />
        <Route path="asset/:id/details" element={<AssetDetails />} />
      </Routes>
    }

  </div>
}

export default App;
