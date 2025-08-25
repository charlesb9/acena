export class JwtHelperService {

  static STORAGE_ACCESS_TOKEN_KEY = 'accessToken';

  static isUserConnected() {
    const rawToken = JwtHelperService.getToken();
    return null !== rawToken && undefined !== rawToken;
  }

  static getToken() {
    return localStorage.getItem(JwtHelperService.STORAGE_ACCESS_TOKEN_KEY);
  }

}
