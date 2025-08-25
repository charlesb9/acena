import { MailService } from "../services/mail.service.js";
import SharePointService from "../services/sharepoint.service.js";

class PlaneController {

  /**
 * Login user with given username and password
 * @param req Request
 * @param res Response
 */
  static getHdv = async (req, res) => {
    const planeId = req.params.id;
    if (!planeId) {
      res.status(400).send('Should provide an ID for plane to fetch')
      return;
    }

    const planeHdv = await SharePointService.getPlaneData(planeId)
    res.json({ id: planeId, hdv: planeHdv });
  };

  /**
 * Login user with given username and password
 * @param req Request
 * @param res Response
 */
  static postHdv = async (req, res) => {
    const planeId = req.params.id;
    if (!planeId) {
      res.status(400).send('Should provide an ID for plane to fetch')
      return;
    }
    const userId = req.user;

    const success = await SharePointService.postHdv(planeId, { ...req.body, rep_id: userId, AC_ID: planeId })
    if (success) {
      const mailService = new MailService()
      mailService.sendMail(
        'nav@acena.fr',
        `Notification vol ${req.body.immat || planeId}`,
        `Obs: ${(req.body.message && req.body.message.length > 0) ? req.body.message : ''}`
      )
    }

    res.json({ success });
  };

  /**
 * Login user with given username and password
 * @param req Request
 * @param res Response
 */
  static updateHdv = async (req, res) => {
    const planeId = req.params.planeId;
    const hoursId = req.params.hoursId;
    if (!planeId || !hoursId) {
      res.status(400).send('Should provide an ID for plane and hours')
      return;
    }
    const userId = req.user;

    await SharePointService.updateHdv(hoursId, { ...req.body, rep_id: userId, AC_ID: planeId })

    res.json({ success: true });
  };

  /**
 * Login user with given username and password
 * @param req Request
 * @param res Response
 */
  static deleteHdv = async (req, res) => {
    const hoursId = req.params.hoursId;
    if (!hoursId) {
      res.status(400).send('Should provide an ID for hours')
      return;
    }
    const userId = req.user;

    await SharePointService.deleteHdv(hoursId)

    res.json({ success: true });
  };


  /**
 * Login user with given username and password
 * @param req Request
 * @param res Response
 */
  static getPrevisions = async (req, res) => {
    const planeId = req.params.id;
    if (!planeId) {
      res.status(400).send('Should provide an ID for plane to fetch')
      return;
    }

    const planePrevisions = await SharePointService.getPlanePrevisions(planeId)
    res.json({ id: planeId, previsions: planePrevisions });
  };

  static updateSchedule = async (req, res) => {
    const prevId = req.params.id;
    if (!prevId) {
      res.status(400).send('Should provide an ID for plane to fetch')
      return;
    }
    const updated = await SharePointService.updateScheduledDate(prevId, req.body.newDate)
    res.json({ success: true, updated })
  }

  static hasExpiredForecaste = async (req, res) => {
    const planeId = req.params.planeId;
    if (!planeId) {
      res.status(400).send('Should provide an ID for plane to fetch')
      return;
    }
    const result = await SharePointService.hasExpiredForecaste(planeId);
    res.json({ success: true, result })
  }

}
export default PlaneController;