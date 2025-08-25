import jsonwebtoken from "jsonwebtoken";

import config from "../config/config.js";

export const checkJwt = async (req, res, next) => {
  // Get the jwt token from the head
  if (req.headers.authorization && req.headers.authorization.length > 0) {

    const token = req.headers.authorization.split('Bearer ')[1];

    if (token) {
      // Try to validate the token and get data
      try {
        jsonwebtoken.verify(token, config.jwtSecret);
      } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        console.log('Invalid token')
        return;
      }
      // Call the next middleware or controller
      req.user = jsonwebtoken.decode(token).userId
      next();
    } else {
      // If token is not valid, respond with 401 (unauthorized)
      res.status(401).send();
      return;
    }
  }

};