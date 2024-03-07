const controller = require('../controller/test');
const userController = require('../controller/userController');
const forgetPasswordController = require('../controller/forgetPassController')
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



}