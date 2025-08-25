import { ROLES } from './constants.js'
import config from "../config/config.js";
import jsonwebtoken from 'jsonwebtoken';

function generateJwt(id, login, role = ROLES.USER) {
  // Sign JWT, valid for 2 hours
  const token = jsonwebtoken.sign(
    { userId: id, username: login, role: role },
    config.jwtSecret,
    { expiresIn: "3h" }
  );
  return { token };
}

export { generateJwt }