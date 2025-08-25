const items = [
    {
        icon: 'fa fa-fighter-jet',
        title: 'Suivi',
        text: "Apporter une assistance dans la gestion des aéronefs et plus particulièrement dans le suivi et le maintien de la navigabilité"
    },
    {
        icon: 'fa fa-cloud',
        title: 'Développement',
        text: "Le développement, l’installation et la maintenance de ses logiciels informatiques",
    },
    {
        icon: 'fa fa-pencil',
        title: 'Procédures',
        text: "La rédaction de procédures de fonctionnement",
    },
    {
        icon: 'fa fa-file-text-o',
        title: 'Maintenance',
        text: "La rédaction et le dépôt auprès de tiers (autorités, constructeurs, etc.) des documents liés à la maintenance aéronautique"
    },
]

export default function Features() {
    return (
        <div id='features' className='text-center'>
            <div className='container'>
                <div className='col-md-10 col-md-offset-1 section-title'>
                    <h2>Objectifs</h2>
                </div>
                <div className='row' style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {items.map((d, i) => (
                        <div key={`${'f'}-${i}`} className='col-xs-6 col-md-3' style={{ float: 'none' }}>
                            {' '}
                            <i className={d.icon}></i>
                            <h3>{d.title}</h3>
                            <p>{d.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
