import styled from '@emotion/styled';
import React from 'react'

const ScreenContainer = styled('div')(({ theme }) => ({
  padding: 20,
  height: "100%",
  overflowY: "auto",

}));

function Screen(props: any) {
  return (
    <ScreenContainer className='screen-container'>{props.children}</ScreenContainer>
  )
}

export default Screen