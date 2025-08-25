import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'
import { AccountCircle } from '@material-ui/icons'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import logo from '../assets/logo_dark_blue_crop.png'
import fr from '../assets/icons/fr.svg'
import en from '../assets/icons/en.svg'
import useCheckMobile from '../utils/useCheckMobile';

const Flags = styled.div`
  display: flex;
  margin-top: 17px;
  width: 75px;
  justify-content: space-around;
  margin-left: 36px;
  @media (max-width: 780px) {
    float: right;
    margin-right: 16px;
  }
`

const Flag = styled.div`
  width: ${props => props.active ? '30px' : '24px'};
  height: ${props => props.active ? '20px' : '17px'};
  background: url(${props => props.fr ? fr : en});
  border: ${props => props.active ? '1px solid #fafafa' : 'none'};
  background-color: red;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  margin-top: ${props => props.active ? '0px' : '2px'};
  filter: ${props => props.active ? 'drop-shadow(0px 2px 10px #D3D3D3)' : 'grayscale(0.5)'};
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0,0,0,0.2);
  margin-top: 5px;
  margin-bottom: 5px;
  @media (max-width: 780px) {
    width: 90%;
  }
`

const FloatingMenu = styled.div`
border: 1px solid #80808061;
position: absolute;
width: 100%;
 height: 150px;
 background: white;
 padding: 10px;
 border-radius: 10px;
 opacity: 0.9;
 text-align: center; 
`

const Container = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
@media (max-width: 975px) {
  width: 100%;
  display: block;
}
`

const NavHeader = styled.div`
@media (max-width: 975px) {
  width: 90vw;
}
`

export default function Header(props) {
  const user = useSelector((state) => state.user.value)
  const [scrolled, setScrolled] = useState(false)
  const { t, i18n } = useTranslation()
  const [menu, setMenu] = useState(false)
  const isMobile = useCheckMobile()

  useEffect(() => {
    document.addEventListener('scroll', trackScroll)

    return () => {
      document.removeEventListener('scroll', trackScroll)
    }
  }, [])

  const trackScroll = () => {
    if (!isMobile) {
      setScrolled(window.scrollY >= 100)
    }
  }

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("locale", lang)
    window.location.reload()
  }

  function showMenu() {
    setMenu(true)
  }

  function hideMenu() {
    setMenu(false)
  }

  function displayInitials(firstName, lastName) {
    let initials = ''
    if (firstName && firstName.length > 0) {
      initials = initials + firstName[0]
    }
    if (lastName && lastName.length > 0) {
      initials = initials + lastName[0]
    }
    if (initials.length === 0) {
      initials = 'A'
    }
    return initials
  }

  return (
    <nav id='menu' className={`navbar navbar-default navbar-fixed-top ${scrolled && 'small-navbar'}`}>
      <Container className='container'>
        <NavHeader className='navbar-header'>
          <button
            type='button'
            className='navbar-toggle collapsed'
            data-toggle='collapse'
            data-target='#bs-example-navbar-collapse-1'
          >
            <span className='sr-only'>Toggle navigation</span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
          </button>
          {isMobile && (
            <Flags>
              <Flag fr active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')} />
              <Flag active={i18n.language === 'en'} onClick={() => changeLanguage('en')} />
            </Flags>
          )}
          <a className='navbar-brand' href="/">
            <img src={logo} height="60px" alt="Acena Logo" />
          </a>{' '}
        </NavHeader>

        <div
          className='collapse navbar-collapse'
          id='bs-example-navbar-collapse-1'
        >
          <ul className='nav navbar-nav navbar-right'>
            <li>
              <a href='/'>
                {t('home')}
              </a>
            </li>
            <li>
              <a href='/contact'>
                {t('contact')}
              </a>
            </li>
            {(user) ? (
              <li style={{ position: 'relative' }} onMouseEnter={showMenu} onMouseLeave={hideMenu}>
                <a href='/user' style={{ display: 'flex', alignItems: 'center', marginTop: 6 }} className="menu-no-line">
                  <Avatar style={{ width: 30, height: 30, marginRight: 8, fontSize: 14, background: '#103358' }}>{displayInitials(user?.firstName, user?.lastName)}</Avatar>
                  {t('my_space')}
                </a>
                {isMobile && (
                  <ul style={{ marginLeft: 32 }}>
                    <li>
                      <a href="/user" style={{ color: '#555' }}>{t('home')}</a>
                    </li>
                    <li>
                      <Divider />
                      <a href="/flights" style={{ color: '#555' }}>{t('flight_hours')}</a>
                    </li>
                    <li>
                      <Divider />
                      <a href="/previsions" style={{ color: '#555' }}>{t('previsions')}</a>
                    </li>
                    <li>
                      <Divider />
                      <a href="/logout" style={{ color: 'red' }}>{t('logout')}</a>
                    </li>
                  </ul>
                )}
                {!isMobile && menu && (
                  <FloatingMenu className="flex-column">
                    <a href="/user" style={{ color: '#555' }}>{t('home')}</a>
                    <Divider />
                    <a href="/flights" style={{ color: '#555' }}>{t('flight_hours')}</a>
                    <Divider />
                    <a href="/previsions" style={{ color: '#555' }}>{t('previsions')}</a>
                    <Divider />
                    <a href="/logout" style={{ color: 'red' }}>{t('logout')}</a>
                  </FloatingMenu>
                )}
              </li>
            ) : (
              <li>
                <a href='/login' style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
                  <AccountCircle style={{ width: 25, height: 25, marginRight: 8, color: '#103358' }} />
                  {t('auth')}
                </a>
              </li>
            )}
            {!isMobile && (
              <li>
                <Flags>
                  <Tooltip placement="bottom" title={t('french')}>
                    <Flag fr active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')} />
                  </Tooltip>
                  <Tooltip placement="bottom" title={t('english')}>
                    <Flag active={i18n.language === 'en'} onClick={() => changeLanguage('en')} />
                  </Tooltip>
                </Flags>
              </li>
            )}
          </ul>
        </div>
      </Container >
    </nav >
  )
}
