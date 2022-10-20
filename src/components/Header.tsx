import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import useAuthState from '../hooks/useAuthState';
import { useNavigate } from "react-router-dom";
import filterIcon from '../assets/images/filter.png';

const HeaderContainer = styled('div')(({ theme }) => ({
  height: "55px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#E0E0E0",
  paddingLeft: 10,
  paddingRight: 10,
}));

function Header({ title, showFilters }) {
  let navigate = useNavigate();
  const { setAuthStatus } = useAuthState();

  return (
    <HeaderContainer>
      <Box id="headerLeft">
        <Typography variant='h6' sx={{ color: "#222" }}>{title}</Typography>
      </Box>
      <Box id="headerRight" className='flex'>
        <Button variant='text' onClick={() => { setAuthStatus('loggedOut'); navigate("/") }}>Logout</Button>
        <Button variant='text' onClick={() => showFilters()}><img src={filterIcon} alt='Filter' style={{ width: 25 }} /></Button>
      </Box>
    </HeaderContainer>
  )
}

export default Header