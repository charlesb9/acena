import React from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";

import Header from './Header'
import Footer from './Footer'

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 81px;
`

const Subheader = styled.div`
  display: flex;
  max-width: 1140px;
  margin: auto;
  position: relative;
  margin-bottom: -20px;
  height: 50px;
`

const BackButton = styled(IconButton)`
  border: 1px solid grey !important;
  position: absolute;
  top: 40px;
  left: -75px;
  
@media (max-width: 780px) {
  left: 20px;
  top: 35px;
}
`

function Layout(props) {
  const history = useHistory()
  return (
    <Container>
      <Header />
      {!props.noSubHeader && (<Subheader>
        {['flights', 'hours', 'previsions'].includes(history.location.pathname.split('/')[1]) && (
          <BackButton
            color="primary"
            onClick={() =>
              history.goBack()
            }
          >
            <ArrowBackIcon />
          </BackButton>
        )}
      </Subheader>)}
      {props.children}
      <Footer />
    </Container>
  )
}

export default Layout