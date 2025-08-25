import React from 'react'
import styled from 'styled-components'

import { device } from '../utils/Constants'
import SecondaryLinks from './footer/SecondaryLinks'
import FooterLogo from './footer/FooterLogo'

const Container = styled.div`
  background-color: #0f1a26;
  padding: 1.5rem 2rem;

  @media ${device.tablet} {
    padding: 2rem 2rem 0 2rem;
  }

  @media ${device.desktop} {
    padding: 2rem 2rem 0 0;
  }
`

const InnerWrapper = styled.div`
  margin: 0 auto;
  max-width: 1140px;
`

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
`

function Footer() {
  return (
    <Container>
      <InnerWrapper>
        <FooterLogo />
        <MainInfo>
          <SecondaryLinks />
        </MainInfo>
      </InnerWrapper>
    </Container>
  )
}

export default Footer