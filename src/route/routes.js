const controller = require('../controller/test');
const forgetPasswordController = require('../controller/forgetPassController')
const userController = require('../controller/userController')
const countryController = require('../controller/countryState')
const verificationController = require('../controller/verificationController')
const chartController = require('../controller/chartController')
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

  app.route('/users/sendOtp').post(userController.generatOtpForRegistration)
  app.route('/users').post(userController.verifyOtpForRegistration)
  app.route('/login').post(userController.login)
  app.route('/sendOtpLoginPhoneNo').post(userController.sendOtpToPhone)
  app.route('/loginPhoneNo').post(userController.loginWithPhone)

  app.route('/users/singUpGoogle').post(userController.signUpWithGoogle)
  app.route('/loginWithGoogle').post(userController.loginWithGoogle)
  app.route('/forgotPassOtpGeneratorAdmin').post(forgetPasswordController.forgotPassOtpGenerator)
  app.route('/forgotPassOtpVerificationAdmin').post(forgetPasswordController.forgotPassOtpVerification)
  app.route('/addNewPassword').post(forgetPasswordController.addNewPassword)
  app.route('/charts').get(chartController.getChartData)


  app.route('/users/getUserData').get(userController.getProfile)
  app.route('/users/updateUser').post(userController.editProfile)
  app.route('/master/countriesDropdown').get(countryController.getCountryDropDown)
  app.route('/master/statesDropdown').get(countryController.getStateByCountryId)
  app.route('/master/citiesDropdown').get(countryController.getCityByStateId)
  app.route('/master/countryCodes').get(countryController.getCountryCodes)
  app.route('/changePwd').post(userController.changePassword)
  app.route('/captcha/generate').get(verificationController.generateCaptcha)
  app.route('/captcha/verification').post(verificationController.verifyCaptcha)
  app.route('/captcha/reGenerate').post(verificationController.regenerateCaptcha)
  app.route('/captcha/scheduller').delete(verificationController.autoDeleteCaptcha)
}



