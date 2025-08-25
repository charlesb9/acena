import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout'


const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  padding: 20px;
  margin-bottom: 100px;
`
const Label = styled.p`
  font-weight: bold;
`

const Block = styled.div`
  margin-left: 75px;
`

const StyledLi = styled.li`
  &:before {
  }
`

const NestedLi = styled.li`
  margin-left: 40px;
  position: relative;
  list-style-type: none;
  padding-left: 1.2rem;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 2px;
    width: 5px;
    height: 11px;
    border-width: 0 2px 2px 0;
    border-style: solid;
    border-color: #103358;
    transform-origin: bottom left;
    transform: rotate(45deg);
  }
`

function Data() {
  const { t } = useTranslation()

  return (
    <Layout>
      <Container>
        <h3 className="page-title">{t('Types de données réceptionnées et analysées par ACENA')}</h3>

        <Label>Exploitant:</Label>
        <Block>
          <ul>
            <StyledLi>- Heures de vol, cycles, atterrissages</StyledLi>
            <StyledLi>- Incidents et accidents en exploitation (CEE)</StyledLi>
            <StyledLi>- Demande de création de dossier pour modifications (mineur/majeur)</StyledLi>
          </ul>
        </Block>

        <Label>Autorités:</Label>
        <Block>
          <ul>
            <StyledLi>- Consignes de Navigabilité et Airwothiness Directive</StyledLi>
            <StyledLi>- Réglementation applicable à l’aviation générale</StyledLi>
          </ul>
        </Block>

        <Label>Constructeurs:</Label>
        <Block>
          <ul>
            <StyledLi>- Aircraft maintenance manuel</StyledLi>
            <StyledLi>- Illustrated part catalogue</StyledLi>
            <StyledLi>- Service bulletin, Service Advisory, Service letters</StyledLi>
          </ul>
        </Block>

        <Label>Atelier de maintenance:</Label>
        <Block>
          <ul>
            <StyledLi>
              - Compte rendu de travaux:
              <ul>
                <NestedLi>Travaux programmés</NestedLi>
                <NestedLi>Travaux découverts</NestedLi>
                <NestedLi>Pièces remplacées (avec documents libératoires)</NestedLi>
                <NestedLi>Travaux reportés</NestedLi>
              </ul>
            </StyledLi>
            <StyledLi>- Demande de création de dossier pour réparation (mineur/majeur)</StyledLi>
            <StyledLi>- Compte rendu d’intervention sur matériel (CIM)</StyledLi>
          </ul>
        </Block>

        <h3 className="page-title">{t('Types de données restituées après traitement')}</h3>

        <Label>Exploitant:</Label>
        <Block>
          <ul>
            <StyledLi>
              - Prévision des actions de maintenance intégrant le lancement et le suivi:
              <ul>
                <NestedLi>Des items protocolaires du programme d’entretien
                  (Section 2 et 6)</NestedLi>
                <NestedLi>Des équipements (section 3)</NestedLi>
                <NestedLi> Des directives constructeurs (SB, SA, SIL)</NestedLi>
                <NestedLi>Des directives des autorités (AD/CN)</NestedLi>
                <NestedLi>Des travaux reportés</NestedLi>
                <NestedLi>Des travaux additionnels (criques, réparation, etc.)</NestedLi>
              </ul>
            </StyledLi>
            <StyledLi>
              - Status de l’ensemble des actions de maintenance effectuées:
              <ul>

                <NestedLi>Protocolaires et hors protocolaires (out of phase)
                  (Visite,AD/CN,VB, SA, SIL)</NestedLi>
                <NestedLi>Équipements (Révision générale, vie limite, passage au banc, etc..)</NestedLi>
              </ul>

            </StyledLi>
            <StyledLi>- Informations sur l’évolution des dossiers de modification</StyledLi>
            <StyledLi>- Analyse de la fiabilité sur la flotte client et sur la totalité des flottes
              de même type gérées</StyledLi>
            <StyledLi>- Classification des problèmes rencontrés et des actions effectuées
              sur l’ensemble d’une flotte de même type</StyledLi>
          </ul>
        </Block>

        <Label>Autorités:</Label>
        <Block>
          <ul>
            <StyledLi>
              - Demande de renouvellement CDN
            </StyledLi>
            <StyledLi>
              - Retour d’information (incident/accident)
            </StyledLi>
            <StyledLi>- Demande de validation programme d’entretien (création et évolution)</StyledLi>
            <StyledLi>- Dépôt de dossier de modification (mineure/majeure)</StyledLi>
            <StyledLi>- Dépôt de dossier de réparation (mineure/majeure)</StyledLi>
            <StyledLi>- Demande de convoyage</StyledLi>
            <StyledLi>- Demande de prolongation / tolérances</StyledLi>
          </ul>
        </Block>

        <Label>Constructeurs:</Label>
        <Block>
          <ul>
            <StyledLi>
              - Retour d’informations (application SB, incidents/accidents, fiabilité)
            </StyledLi>
            <StyledLi>
              - Demande d’information pour constitution dossier de modification
            </StyledLi>
            <StyledLi>- Demande d’information pour constitution dossier de réparation (hors SRM)</StyledLi>

          </ul>
        </Block>

        <Label>Ateliers de maintenance:</Label>
        <Block>
          <ul>
            <StyledLi>
              - Mise à disposition du programme d’entretien
            </StyledLi>
            <StyledLi>
              - Demande d’exécution de travaux (Work order)intégrant:
              <ul>
                <NestedLi> Les items protocolaires du programme d’entretien
                  (Section 2 et 6)</NestedLi>
                <NestedLi>Les équipements (section 3)</NestedLi>
                <NestedLi>Les directives constructeurs (SB, SA, SIL)</NestedLi>
                <NestedLi>Les directives des autorités (AD/CN)</NestedLi>
                <NestedLi>Les travaux reportés</NestedLi>
                <NestedLi>Les travaux additionnels (criques, réparation, etc.)</NestedLi>
              </ul>
            </StyledLi>
            <StyledLi>- Procédure d’exécution de réparation (mineur/majeur) hors SRM</StyledLi>
            <StyledLi>- Procédure d’exécution de modification (mineur/majeur)</StyledLi>
          </ul>
        </Block>
      </Container>
    </Layout >
  )
}

export default Data