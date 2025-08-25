import { MailService } from '../services/mail.service.js'

class ContactController {
  /**
   * Login user with given username and password
   * @param req Request
   * @param res Response
   */
  static sendMail = async (req, res) => {
    // Check if username and password are set
    const { subject, message, name, email } = req.body;
    if (!(subject && message && name && email)) {
      res.status(400).send();
      return;
    }

    const mailService = new MailService();

    mailService.sendMail(
      'ph.monin@acena.fr',
      `${subject} (${name})`,
      `Nouveau message de ${name} depuis la page de contact:
      ${message}
      ------
      Mail du contact: ${email}
      Numéro de téléphone: ${req.body.phone && req.body.phone.length > 0 ? req.body.phone : "Non renseigné"}
      `);

    res.send({ success: true });
  };

}
export default ContactController;
