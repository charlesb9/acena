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

function Tools() {
  const { t } = useTranslation()

  return (
    <Layout>
      <Container>
        <h3 className="page-title">{t('Nos outils')}</h3>
        <Label>Un site Internet dynamique ayant comme fonction principale:</Label>
        <Block>
          <ul>
            <StyledLi>La visualisation des prévisions de l’ensemble des actions de
              maintenances à effectuer:

              <ul>
                <NestedLi>
                  Items protocolaires et hors protocolaires (out of phase)
                  (Visite,AD/CN,VB, SA, SIL)
                </NestedLi>
                <NestedLi>
                  Équipements
                  (Révision générale, vie limite, passage au banc, etc..)
                </NestedLi>
              </ul>
            </StyledLi>
          </ul>

          <ul>
            <StyledLi>La mise à disposition de l’archivage de l’ensemble des actions de
              maintenances déjà appliquées:

              <ul>
                <NestedLi>
                  Items protocolaires et hors protocolaires (out of phase)
                  (Visite,AD/CN,VB, SA, SIL)
                </NestedLi>
                <NestedLi>
                  Équipements
                  (Révision générale, vie limite, passage au banc, etc..)
                </NestedLi>
              </ul>
            </StyledLi>
          </ul>


          <ul>
            <StyledLi>Le partage et la sauvegarde de toutes vos données sur notre serveur dédié
              (cloud) :

              <ul>
                <NestedLi>
                  Accés à vos données par mot de passe personalisé.
                </NestedLi>
                <NestedLi>
                  création de compte utilisateurs illimités
                </NestedLi>
                <NestedLi>
                  taille de stockage variable fonction abonnement souscrit
                  (5G, 10G, ou plus)
                </NestedLi>
                <NestedLi>
                  création de fichier, sous fichiers et dossier entierement
                  paramétrables
                </NestedLi>
                <NestedLi>
                  notification (envoi d'un Email automatique) à un membre
                  pour l'informer des documents déposés ou modifiés
                </NestedLi>
                <NestedLi>
                  resérvation d'un document pour modification
                </NestedLi>
              </ul>
            </StyledLi>
          </ul>
        </Block>

        <Label>Un logiciel informatique constitué de 4 modules:</Label>

        <Block>
          <ul>
            <NestedLi><b>Module Engineering</b> permettant la prise en compte, l’analyse et
              le lancement des directives constructeurs/autorités sur un
              appareil donné. Informations mise à jour par ACENA qui effectue
              le suivi de navigabilité.</NestedLi>
            <NestedLi><b>Module Maintenance</b> permettant la constitution des dossiers de
              maintenance et la gestion du stock de pièces. Ce module est
              indissociable du Module Engineering. La mise à jour des données
              étant automatiquement effectuée par connexion Internet
              (via un serveur dédié). Ce module est laissé à disposition lors de
              la souscription du contrat d’abonnement.
              (voir conditions d’abonnement)</NestedLi>
            <NestedLi><b>Module Facturation</b> permettant d’établir la facture client en
              temps réel.
              (voir conditions de souscription)</NestedLi>
            <NestedLi><b>Module Exploitation</b> permettant la visualisation graphique et la
              planification des actions de maintenance.
              (voir conditions de souscription)</NestedLi>
          </ul>
        </Block>
      </Container >
    </Layout >
  )
}

export default Tools