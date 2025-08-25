import axios from 'axios';
import { store } from '../store/store'
import { addNotification, setLogged } from '../store/userSlice'

import { JwtHelperService } from './Jwt';

const HttpClient = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api',
});

if (JwtHelperService.isUserConnected()) {
  HttpClient.defaults.headers.common['Authorization'] = `Bearer ${JwtHelperService.getToken()}`;
}

// INTERCEPTORS

/** Request interceptor */
HttpClient.interceptors.request.use(request => {

  if (JwtHelperService.isUserConnected()) {
    request.headers['Authorization'] = `Bearer ${JwtHelperService.getToken()}`;
  }

  return request;
}, error => {
  return Promise.reject(error)
});

HttpClient.interceptors.response.use(response => response, error => {
  if (error?.request?.status === 401) {
    store.dispatch(setLogged(false))
    store.dispatch(addNotification({ message: 'Votre session a expirée. Veuillez vous reconnecter.', variant: 'error', duration: 8000 }))
  }
  if (error?.request?.status === 500) {
    store.dispatch(addNotification({ message: 'Une erreur réseau est survenue. Merci de contacter l\'administrateur.', variant: 'error', duration: 8000 }))
  }
  return Promise.reject(error)
});

export default HttpClient;