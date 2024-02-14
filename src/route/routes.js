const controller = require('../controller/test');
const userController = require('../controller/userController')
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

}