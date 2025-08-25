import React from 'react'
import styled from 'styled-components'

import { device } from '../../utils/Constants'
import logoWhite from '../../assets/logo_white_crop_small.png'

const Container = styled.div`

  @media ${device.desktop} {
    margin: 0 3rem;
  }
`

const LogoWrapper = styled.div`
  cursor: pointer;
  padding: 1.5rem 0;
`


function FooterLogo() {
  return (
    <Container>
      <LogoWrapper onClick={() => console.log('')}>
        <img src={logoWhite} alt="Acena Logo" width="120" />
      </LogoWrapper>
    </Container>
  )
}

export default FooterLogo
