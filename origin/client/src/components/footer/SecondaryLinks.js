import React from 'react'
import styled from 'styled-components'
import { device, colours } from '../../utils/Constants'
import PDF from '../../assets/agrement.pdf';
import { AlternateEmail, Call, QuestionAnswer } from '@material-ui/icons';

const Container = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 15px;
  width: 100%;
  justify-content: space-between;

  @media ${device.tablet} {
    display: flex;
    flex-direction: row;
  }

  @media ${device.desktop} {
    margin: 0 3rem;
  }
`

const Title = styled.div`
  color: ${colours.grey};
  cursor: default;
  margin: 2rem 0;
`

const StyledLink = styled.a`
  color: white;
  cursor: ${props => props.inactive ? 'inherit' : 'pointer'};
  margin: ${props => props.inactive ? '0 0 0.75rem 0' : '0 0 1.5rem 0'};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    opacity: ${props => props.inactive ? 1 : 0.6};
    transition: 0.3s;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;

  &:last-of-type {
    padding-top: 0.1rem;
  }

  @media ${device.tablet} {
    margin-bottom: 2rem;

    &:last-of-type {
      padding-top: 0;
    }
  }

`

function SecondaryLinks() {
  return (
    <Container>
      <Column>
        <Title>A propos</Title>
        <StyledLink inactive>
          Aircraft Engineering Assistance
        </StyledLink>
        <StyledLink inactive>
          Organisme de gestion
          de navigabilité et renouvellement de CEN
        </StyledLink>
        <StyledLink inactive>
          Part CAO FR.CAO.0067
        </StyledLink>
      </Column>
      <Column>
        <Title>Informations légales</Title>
        <StyledLink href={PDF} target="_blank">
          Notre agrément
        </StyledLink>
        <StyledLink>
          Nos partenaires
        </StyledLink>
        <StyledLink href="/tools">
          Nos outils
        </StyledLink>
      </Column>
      <Column>
        <Title>Nous contacter</Title>
        <StyledLink href="/contact">
          <QuestionAnswer style={{ marginRight: 6, fontSize: 14 }} /> En ligne
        </StyledLink>
        <StyledLink href="mailto:contact@acena.fr">
          <AlternateEmail style={{ marginRight: 6, fontSize: 14 }} /> Par email
        </StyledLink>
        <StyledLink href="tel:0662242792">
          <Call style={{ marginRight: 6, fontSize: 14 }} /> Par téléphone
        </StyledLink>
      </Column>
    </Container>
  )
}

export default SecondaryLinks
