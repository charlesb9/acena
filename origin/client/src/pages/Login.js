import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useDispatch } from 'react-redux'
import { addNotification } from '../store/userSlice';

import { set, setLogged } from '../store/userSlice'
import HttpClient from '../utils/HttpClient';
import Webservice from '../api/webservice';
import { IconButton, Tooltip } from '@material-ui/core';
import login from '../assets/login.jpg'
import acena from '../assets/logo_dark_blue_crop_small.png'
import useCheckMobile from '../utils/useCheckMobile';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(' + login + ')',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'right',
  },
  paper: {
    margin: theme.spacing(16, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(2, 4),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  youtubeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    flexDirection: 'column'
  }
}));

export default function App() {
  const classes = useStyles();
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  let history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const isMobile = useCheckMobile()

  const authenticate = async (e) => {
    e.preventDefault();
    const authSucceed = await Webservice.login(login, password);
    if (!authSucceed) {
      return
    }
    const token = authSucceed.token
    localStorage.setItem('accessToken', token.token);
    dispatch(setLogged(true))
    HttpClient.defaults.headers.common['Authorization'] = `Bearer ${token.token}`;
    Webservice.getMyInfos().then(res => {
      dispatch(set(res.user))
    })
    history.push('/user')
    dispatch(addNotification({ message: 'Connexion établie', variant: 'success' }))
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ position: 'relative' }}>
        <IconButton
          color="primary"
          onClick={() =>
            history.goBack()
          }
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <div className={classes.paper}>
          <img src={acena} alt="Logo d'ACENA" width="250" />
          <Typography component="h1" variant="h5">
            {t('login_title')}
          </Typography>
          <form className={classes.form} onSubmit={authenticate}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('login')}
              name="email"
              autoComplete="login"
              autoFocus
              value={login}
              onChange={e => setLogin(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password"
              label={t('password')}
              id="password"
              autoComplete="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <Tooltip placement="bottom" title={t(showPassword ? 'hide_password' : 'show_password')}>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>

              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t('stay_logged')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t('login_cta')}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/contact" variant="body2">
                  {t('password_forgotten')}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/contact" variant="body2">
                  {t('sign_up')}
                </Link>
              </Grid>
            </Grid>
            <div className={classes.youtubeContainer}>
              <Typography component="h3" variant="h6" style={{ marginBottom: 8 }}>
                {t('login_youtube')}
              </Typography>
              <iframe width={isMobile ? '100%' : '90%'} height="315" src="https://www.youtube-nocookie.com/embed/UMQHNcOxIzw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;fullscreen" allowfullscreen></iframe>
            </div>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}