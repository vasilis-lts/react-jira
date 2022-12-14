import styled from '@emotion/styled';
import { Typography, TextField, Button } from '@mui/material';
import logo from '../assets/images/logo.png';
import Screen from '../components/Screen';
import useAuthState from '../hooks/useAuthState';
import { useNavigate } from "react-router-dom";

const LoginContainer = styled('div')(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  '& #loginForm': {
    width: '100%',
    maxWidth: 370,
    flexDirection: "column",
    display: "flex",
    marginTop: 15
  },
  '& label': {
    fontWeight: 700,
    paddingLeft: 3
  }
}));

function Login() {
  const { setAuthStatus } = useAuthState();
  let navigate = useNavigate();

  async function handleSubmit() {
    localStorage.setItem('ReactJiraLoggedIn', 'true');
    setAuthStatus('loggedIn');
    navigate('assets');
  }

  return (
    <Screen id='Login'>
      <LoginContainer>

        <img src={logo} style={{ width: 120 }} alt="logo" />

        <Typography sx={{ mt: 1 }} variant='h4'>Login</Typography>
        <Typography variant='subtitle1'>Please enter your e-mail</Typography>

        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label>
          <TextField sx={{ mt: .5 }} id="email" type="email" variant="outlined" size="small" required />
          <Button sx={{ mt: 1 }} variant='contained' color="info" type="submit" size='large'>Submit</Button>
        </form>

      </LoginContainer>
    </Screen>
  )
}

export default Login