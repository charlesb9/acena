import { scrollTo } from "../../utils/scrollTo"
import { useTranslation } from "react-i18next"

export default function Hero() {
  const { t } = useTranslation()
  return (
    <header id='header' style={{ marginTop: -25 }}>
      <div className='intro'>
        <div className='overlay'>
          <div className='container'>
            <div className='row' style={{ height: 'calc(100vh - 100px)' }}>
              <div className='col-md-8 col-md-offset-2 intro-text' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: 100 }}>
                  <h1>
                    ACENA
                  </h1>
                  <p>{t('hero_caption')}</p>
                </div>
                <a
                  className='btn btn-custom btn-lg page-scroll'
                  onClick={() => scrollTo({ id: 'features' })}
                  style={{ marginTop: 50 }}
                >
                  {t('know_more')}
                </a>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
