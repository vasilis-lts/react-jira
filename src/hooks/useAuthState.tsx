import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthState = () => {
  const [state, setState] = useContext(AuthContext);

  function setAuthStatus(Status: string) {
    setState(state => ({ ...state, AuthStatus: Status }));
  }

  function setAccessToken(token: string) {
    setState(state => ({ ...state, AccessToken: token }));
  }

  function setGUser(GUser: Record<string, any>) {
    setState(state => ({ ...state, GUser }));
  }

  function setGUserGroup(userGroup: string) {
    setState(state => ({ ...state, GUserGroup: userGroup }));
  }

  return {
    AuthStatus: state.AuthStatus,
    setAuthStatus,
    AccessToken: state.AccessToken,
    setAccessToken,
    GUser: state.GUser,
    setGUser,
    GUserGroup: state.GUserGroup,
    setGUserGroup
  }

}

export default useAuthState;