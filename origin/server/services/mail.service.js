import nodemailer from 'nodemailer';

export class MailService {
  _transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'acena.notif',
        pass: 'yrqhuplxsbonhzxf'
      }
    });
  }

  sendMail(to, subject, content) {
    const options = {
      to,
      subject,
      text: content
    }

    this._transporter.sendMail(
      options, (error, info) => {
        if (error) {
          return console.log(`error: ${error}`);
        }
        console.log(`Message Sent ${info.response}`);
      });
  }
}
