const controller = require('../controller/test');
const userController = require('../controller/userController')
const countryController = require('../controller/countryState')
module.exports = function (app) {
  app.route('/test').post(controller.uploadImage)
  /**
* @swagger
* /test:
*   post:
*     summary: Upload an image
*     tags:
*       - Image
*     description: Use this endpoint to upload an image.
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               images:
*                 type: string
*                 format: binary
*             required:
*               - images
*     responses:
*       '200':
*         description: Image uploaded successfully.
*       '500':
*         description: Internal Server Error
*/

  app.route('/generateOtpForRegistration').post(userController.generatOtpForRegistration)
  app.route('/verifyOtpForRegistration').post(userController.verifyOtpForRegistration)
  app.route('/login').post(userController.login)
  app.route('/user/getProfile').get(userController.getProfile)
  app.route('/user/editProfile').post(userController.editProfile)
  app.route('/master/countriesDropdown').get(countryController.getCountryDropDown)
  app.route('/master/statesDropdown').get(countryController.getStateByCountryId)
  app.route('/master/citiesDropdown').get(countryController.getCityByStateId)
  app.route('/master/countryCodes').get(countryController.getCountryCodes)
  app.route('/user/changePassword').post(userController.changePassword)
}