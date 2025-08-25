import SharePointService from "../services/sharepoint.service.js";

class UserController {
  /**
   * Login user with given username and password
   * @param req Request
   * @param res Response
   */
  static update = async (req, res) => {
    // const userId = req.user;
    const id = req.params.id;
    if (!id) {
      res.status(400).send('Must supply user id');
      return;
    }

    const userData = await SharePointService.updateUserData(id, req.body);
    res.json({ success: true });
  };

}
export default UserController;