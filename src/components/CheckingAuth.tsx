

import React, { useEffect } from 'react'
import useAuthState from '../hooks/useAuthState';

function CheckingAuth() {
  const { setAuthStatus } = useAuthState();

  useEffect(() => {

    const loggedStatusStr = localStorage.getItem('ReactJiraLoggedIn');
    if (loggedStatusStr) {
      setAuthStatus('loggedIn');
    } else {
      setAuthStatus('loggedOut')
    }

  }, [setAuthStatus]);

  return <div>Checking Authorization...</div>;
}

export default CheckingAuth