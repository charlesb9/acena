import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import routes from './routes/index.js';

class App {

  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    const options = {
      allowedHeaders: ["Authorization", "Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "*",
      preflightContinue: false
    };

    this.app.use(cors(options));
    this.app.options("*", cors(options));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use('/api', routes);
  }
}

export default new App().app;