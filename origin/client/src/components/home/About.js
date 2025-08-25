import Card from './Card'

export default function About(props) {
  return (
    <div id='about'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12'>
            <div>
              <h2>A propos</h2>
              <p>
                La société <b>Aircraft Engineering Assistance (ACENA)</b> a été développée afin de prendre en compte les exigences imposées par la  réglementation de l'aviation générale européenne.
                <br />
                Cette évolution tend à rejoindre la réglementation du transport public et nécessite désormais un temps considérable pour "administrer" les différents appareils.
                <br />
                Acena offre ainsi <b>différents services</b> permettant d'apporter une assistance au maintien et au suivi de la navigabilité des stations de maintenance et des aéronefs administrés.
                <br />
                La prise en charge des démarches administratives (création et évolution):
                MOM,
                MGN,
                programmes d'entretien,
                etc..
                <br />
                Réalisation du relationnel avec les autorités et les constructeurs.
              </p>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 col-md-5'>
            {' '}
            <img src='img/about2.jpg' className='img-responsive' alt='' style={{ borderRadius: 8, marginTop: 50 }} />{' '}
          </div>
          <div className='col-xs-12 col-md-7'>
            <div>
              <h3>Pourquoi faire appel à ACENA	</h3>
              <div className='col-lg-12 col-sm-12 col-xs-12'>
                <ul className='about-text'>
                  <li>ACENA prend en charge l’ensemble des données diffusées par les différents acteurs du monde aéronautique:</li>
                  - MOM
                  <br />
                  - MGN
                  <br />
                  - programmes d'entretien
                  <br />
                  - etc..
                  <br />
                  <li>Analyse ces informations et les distribue aux organismes concernés selon les procédures définies entre les différentes parties.</li>
                  <li>Effectue les taches administratives liées au suivi de navigabilité, permettant ainsi à l’organisme sous-traiteur d’accroître le développement et la qualité de service dans son domaine d’activité:</li>
                  <li>Effectue un suivi précis des appareils et des taches de maintenance permettant  l’augmentation de la fiabilité</li>
                  <li>La mise à disposition des informations liées à l’exploitation:</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 col-md-7'>
            <p>
              <h3>Acena, c'est aussi...</h3>
              Un site dynamique permettant, par l'intermédiaire d'un code d'accès personnel, d'effectuer diverses opérations telles que:
              <br />
              - la visualisation des opérations d'entretien à effectuer
              <br />
              - la saisie des heures de vol effectuées
              <br />
              - la réservation d'un appareil
              <br />
              - etc..
              <br />
              <br />
              Un ensemble de logiciels prenant en compte les besoins des stations de maintenance (MRO):
              <br />
              - Gestion du manuel de maintenance
              <br />
              - Gestion des items protocolaires
              <br />
              - Gestion des items "out of phase" (consignes de navigabilité, Service Bulletin, etc..)
              <br />
              - Gestion des équipements
              <br />
              - Création des dossiers de visites (bon de lancement et d'exécution)
              <br />
              - Gestion des actions de maintenance à effectuer
              <br />
              - etc..
            </p>
          </div>
          <div className='col-xs-12 col-md-5' style={{ marginTop: 50 }}>
            <Card />
          </div>
        </div>
      </div>
    </div >
  )
}