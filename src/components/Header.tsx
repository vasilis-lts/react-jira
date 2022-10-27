import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import useAuthState from '../hooks/useAuthState';
import { useNavigate } from "react-router-dom";
import filterIcon from '../assets/images/filter.png';
import { ReactComponent as LogoutIcon } from '../assets/images/logout.svg';

const HeaderContainer = styled('div')(({ theme }) => ({
  height: "55px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#bbdefb",
  paddingLeft: 10,
  paddingRight: 10,
}));

function Header({ title, showFilters }) {
  const { setAuthStatus } = useAuthState();
  let navigate = useNavigate();

  return (
    <HeaderContainer>
      <Box id="headerLeft">
        <Typography variant='h6' sx={{ color: "#222" }}>{title}</Typography>
      </Box>
      <Box id="headerRight" className='flex'>
        <Button variant='text' onClick={() => { setAuthStatus('loggedOut'); navigate("/") }}><LogoutIcon color="#444" style={{ width: 25, height: 25 }} /></Button>
        <Button variant='text' onClick={() => showFilters()}><img src={filterIcon} alt='Filter' style={{ width: 25 }} /></Button>
      </Box>
    </HeaderContainer>
  )
}

export default Header