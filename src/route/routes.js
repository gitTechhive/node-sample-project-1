const controller = require('../controller/test');
const forgetPasswordController = require('../controller/forgetPassController')
const userController = require('../controller/userController')
const countryController = require('../controller/countryState')
const verificationController = require('../controller/verificationController')
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
  app.route('/signupWithGoogle').post(userController.signUpWithGoogle)
  app.route('/loginWithGoogle').post(userController.loginWithGoogle)
  app.route('/forgotPassOtpGeneratorAdmin').post(forgetPasswordController.forgotPassOtpGenerator)
  app.route('/forgotPassOtpVerificationAdmin').post(forgetPasswordController.forgotPassOtpVerification)
  app.route('/addNewPassword').post(forgetPasswordController.addNewPassword)



  app.route('/user/getProfile').get(userController.getProfile)
  app.route('/user/editProfile').post(userController.editProfile)
  app.route('/master/countriesDropdown').get(countryController.getCountryDropDown)
  app.route('/master/statesDropdown').get(countryController.getStateByCountryId)
  app.route('/master/citiesDropdown').get(countryController.getCityByStateId)
  app.route('/master/countryCodes').get(countryController.getCountryCodes)
  app.route('/user/changePassword').post(userController.changePassword)
  app.route('/captcha/generate').get(verificationController.generateCaptcha)
  app.route('/captcha/verification').post(verificationController.verifyCaptcha)
  app.route('/captcha/reGenerate').post(verificationController.regenerateCaptcha)
  app.route('/captcha/scheduller').delete(verificationController.autoDeleteCaptcha)
}