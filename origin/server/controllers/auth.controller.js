// import UserService from './../user/user.service';
// import SecurityHelper from './../../helper/SecurityHelper';

import SharePointService from "../services/sharepoint.service.js";
import { generateJwt } from "../utils/security.js";

class AuthController {
  /**
   * Login user with given username and password
   * @param req Request
   * @param res Response
   */
  static login = async (req, res) => {
    // Check if username and password are set
    const { login, password } = req.body;
    if (!(login && password)) {
      res.status(400).send('You must provide a login and a password');
      return;
    }

    // Get user from sharepoint list
    const users = await SharePointService.getRepertoire();
    const user = users.find(u => u.designation ? u.designation.toLowerCase() === login.toLowerCase() : false)

    console.log(user)

    if (!user) {
      res.status(400).send({ success: false, message: 'User not found', type: 'wrong_password', users: users.map(u => u.designation) });
      return;
    }

    if (user.password_web !== password) {
      res.status(400).send({ success: false, message: 'Wrong password', type: 'wrong_password' });
      return;
    }

    const token = generateJwt(user.id, user.designation);
    const formattedUser = {
      Id: user.id,
      login: user.designation,
    }

    res.json({ token, user: formattedUser });
  };

  /**
   * Login user with given username and password
   * @param req Request
   * @param res Response
   */
  static me = async (req, res) => {
    // Check if username and password are set
    const userId = req.user;
    if (!userId) {
      res.status(400).send('Invalid token');
      return;
    }

    //Get user from sharepoint list
    const user = await SharePointService.getMe(userId);

    if (!user) {
      res.status(400).send('User not found in sharepoint');
      return;
    }
    const userData = await SharePointService.getUserData(userId);

    const token = generateJwt(user.id, user.designation);
    const formattedUser = {
      Id: user.id,
      login: user.designation,
      firstName: user.first_name,
      lastName: user.last_name,
      address: user.adresse1,
      address_b: user.adresse2,
      mobile: user.fax,
      phone: user.telephone1,
      email: user.Email,
      password: user.password_web,
      planes: userData
    }

    res.json({ token, user: formattedUser });
  };

  static resetPassword = async (req, res) => {
    const { email } = req.body

    const mailService = new MailService();

    mailService.sendMail(
      email,
      `Ré-initialisation de votre mot de passe`,
      `Votre nouveau mot de passe: `
    );

    res.json({ success: true });
  };

}

export default AuthController;