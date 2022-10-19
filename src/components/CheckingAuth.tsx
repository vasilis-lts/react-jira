

import React, { useEffect } from 'react'
import useAuthState from '../hooks/useAuthState';
import { useNavigate } from "react-router-dom";

function CheckingAuth() {
  let navigate = useNavigate();
  const { setAuthStatus } = useAuthState();

  useEffect(() => {

    const loggedStatusStr = localStorage.getItem('ReactJiraLoggedIn');
    if (loggedStatusStr) {
      setAuthStatus('loggedIn');
      navigate('/assets');
    } else {
      setAuthStatus('loggedOut')
      navigate('/');
    }
    // eslint-disable-next-line
  }, [setAuthStatus]);

  return <div>Checking Authorization...</div>;
}

export default CheckingAuth