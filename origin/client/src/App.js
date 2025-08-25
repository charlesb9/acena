import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch } from 'react-redux'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { ThemeProvider } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

import { set, setLoading, setLogged } from './store/userSlice'
import Login from './pages/Login'
import Home from './pages/Home'
import Contact from './pages/Contact'
import User from './pages/User'
import Flights from './pages/Flights'
import Previsions from './pages/Previsions'
import FlightHours from './pages/FlightHours'
import Logout from './pages/Logout'
import Tools from './pages/Tools'
import Data from './pages/Data'
import Webservice from './api/webservice';
import SecuredRoute from './utils/SecuredRoute'
import theme from './theme'
import Notifier from './utils/Notifier';
import ScrollToTop from './utils/ScrollToTop'

export default function App() {
  const dispatch = useDispatch()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(setLoading(true))
      Webservice.getMyInfos().then(res => {
        dispatch(setLogged(true))
        dispatch(set(res.user))
        dispatch(setLoading(false))
      })
        .catch(e => {
          dispatch(setLoading(false))
          localStorage.removeItem('accessToken')
        })
    }
    if (localStorage.getItem('locale')) {
      i18n.changeLanguage(localStorage.getItem('locale'))
    }
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={LuxonUtils} locale={i18n.language || 'fr'}>
        <Helmet>
          <title>ACENA - Aircraft Engineering Assistance</title>
          <meta name="description" content="Acena: Aircraft Engineering Assistance, spécialiste de la gestion de la navigabilité, vous accompagne dans le suivi de votre aéronef." />
        </Helmet>
        <Router>
          <ScrollToTop />
          <Notifier />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/tools">
              <Tools />
            </Route>
            <Route path="/data">
              <Data />
            </Route>
            <SecuredRoute path="/user" component={User} />
            <SecuredRoute path="/flights/:planeId?" component={Flights} />
            <SecuredRoute path="/hours/:planeId/:hoursId?" component={FlightHours} />
            <SecuredRoute path="/previsions/:planeId?" component={Previsions} />
            <SecuredRoute path="/logout" component={Logout} />
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}