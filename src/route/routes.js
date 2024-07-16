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
  /**
 * @swagger
 * /users/sendOtp:
 *   post:
 *     summary: Generate OTP for registration
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobileNo:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - mobileNo
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */


  app.route('/users').post(userController.verifyOtpForRegistration)
  /**
 * @swagger
 * /users:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobileNo:
 *                 type: string
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               requestId:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - mobileNo
 *               - email
 *               - otp
 *               - requestId
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *                     token:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error, OTP not matched, or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */
  app.route('/login').post(userController.login)

  /**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               uuid:
 *                 type: string
 *               type:
 *                 type: string
 *                 description: Type of login (e.g., "google")
 *               googleId:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *                     profile_pic_url:
 *                       type: string
 *                     token:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */
  app.route('/sendOtpLoginPhoneNo').post(userController.sendOtpToPhone)
  /**
 * @swagger
 * /sendOtpLoginPhoneNo:
 *   post:
 *     summary: Send OTP to phone for login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNo:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               type:
 *                 type: string
 *             required:
 *               - phoneNo
 *               - countryCode
 *               - type
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */
  app.route('/loginPhoneNo').post(userController.loginWithPhone)
  /**
   * @swagger
   * /loginPhoneNo:
   *   post:
   *     summary: Login with phone number and OTP
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               otp:
   *                 type: string
   *               phoneNo:
   *                 type: string
   *               requestId:
   *                 type: string
   *             required:
   *               - otp
   *               - phoneNo
   *               - requestId
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     email:
   *                       type: string
   *                     mobileNo:
   *                       type: string
   *                     profile_pic_url:
   *                       type: string
   *                     token:
   *                       type: string
   *                 error:
   *                   type: boolean
   *       400:
   *         description: Validation error, OTP not matched or user not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                 error:
   *                   type: boolean
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                 message:
   *                   type: string
   *                 data:
   *                   type: string
   *                 error:
   *                   type: boolean
   */
  app.route('/users/singUpGoogle').post(userController.signUpWithGoogle)
  /**
 * @swagger
 * /users/singUpGoogle:
 *   post:
 *     summary: Sign up with Google
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               type:
 *                 type: string
 *               googleId:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - type
 *               - googleId
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     token:
 *                       type: string
 *                     googleId:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */

  app.route('/loginWithGoogle').post(userController.loginWithGoogle)
  /**
 * @swagger
 * /loginWithGoogle:
 *   post:
 *     summary: Login with Google
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *                     token:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */

  app.route('/forgotPassOtpGeneratorAdmin').post(forgetPasswordController.forgotPassOtpGenerator)
  /**
 * @swagger
 * /forgotPassOtpGeneratorAdmin:
 *   post:
 *     summary: Generate OTP for forgot password (Admin)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                 error:
 *                   type: boolean
 *       400:
 *         description: Validation error or no user found with the provided email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                 error:
 *                   type: boolean
 */

  app.route('/forgotPassOtpVerificationAdmin').post(forgetPasswordController.forgotPassOtpVerification)
  /**
 * @swagger
 * /forgotPassOtpVerificationAdmin:
 *   post:
 *     summary: Verify OTP for password reset (Admin)
 *     description: Verify OTP provided during password reset for admin users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email for password reset.
 *               otp:
 *                 type: string
 *                 description: OTP received for password reset.
 *               requestId:
 *                 type: string
 *                 description: Request ID for OTP verification.
 *             required:
 *               - email
 *               - otp
 *               - requestId
 *     responses:
 *       200:
 *         description: Successful OTP verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OTP verification successful.
 *                 data:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request due to validation or OTP mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid OTP or missing required fields.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */
  app.route('/addNewPassword').post(forgetPasswordController.addNewPassword)
  /**
 * @swagger
 * /addNewPassword:
 *   post:
 *     summary: Add a new password for a user
 *     description: Add a new password for a user based on email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email for updating password.
 *               new_password:
 *                 type: string
 *                 description: New password to be set for the user.
 *             required:
 *               - email
 *               - new_password
 *     responses:
 *       200:
 *         description: New password added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: New password added successfully.
 *                 data:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request due to validation or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid new password or missing email.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */


  app.route('/charts').get(chartController.getChartData)

  /**
   * @swagger
   * /charts:
   *   get:
   *     summary: Retrieve chart data
   *     description: Fetches various statistics and chart data.
   *     responses:
   *       200:
   *         description: Successful retrieval of chart data.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Chart data retrieved successfully.
   *                 data:
   *                   type: object
   *                   properties:
   *                     chartData:
   *                       type: array
   *                       items: {}
   *                     totalCustomer:
   *                       type: number
   *                       example: 2420
   *                     totalCustomerPer:
   *                       type: number
   *                       example: 40
   *                     activeNow:
   *                       type: number
   *                       example: 2420
   *                     activeNowPer:
   *                       type: number
   *                       example: 40
   *                     totalMember:
   *                       type: number
   *                       example: 2420
   *                     totalMemberPer:
   *                       type: number
   *                       example: 20
   *                     myBalance:
   *                       type: number
   *                       example: 50
   *                     myBalancePer:
   *                       type: number
   *                       example: 20
   *                 error:
   *                   type: boolean
   *                   example: false
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Internal server error.
   *                 data:
   *                   type: array
   *                   items: {}
   *                 error:
   *                   type: boolean
   *                   example: true
   */



  app.route('/users/getUserData').get(userController.getProfile)
  /**
 * @swagger
 * /users/getUserData:
 *   get:
 *     summary: Get user profile data
 *     description: Retrieves the profile data of the authenticated user.
 *     responses:
 *       200:
 *         description: Successful retrieval of user profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Profile details fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     
 *                 error:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: User profile not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Resource not found.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */

  app.route('/users/updateUser').post(userController.editProfile)
  /**
 * @swagger
 * /users/updateUser:
 *   post:
 *     summary: Edit user profile
 *     description: Updates the profile information of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userInfo:
 *                 type: string
 *                 description: JSON string containing user profile information.
 *                 example: '{"firstName":"John","lastName":"Doe","mobileNo":"1234567890","email":"john.doe@example.com","address":"123 Main St","country_id":1,"state_id":1,"cities_id":1,"pinCode":"12345","phonecode":"+1","profilePicUrl":null}'
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile picture file.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully.
 *                 data:
 *                   type: string
 *                   example: Success
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error or profile update failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */



  app.route('/master/countriesDropdown').get(countryController.getCountryDropDown)
  /**
 * @swagger
 * /master/countriesDropdown:
 *   get:
 *     summary: Get countries dropdown list
 *     description: Retrieves a list of countries for use in dropdown menus.
 *     tags:
 *       - Master Data
 *     responses:
 *       200:
 *         description: Successful retrieval of countries list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Countries retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 1
 *                       label:
 *                         type: string
 *                         example: United States
 *                 error:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */

  app.route('/master/statesDropdown').get(countryController.getStateByCountryId)
  /**
 * @swagger
 * /master/statesDropdown:
 *   get:
 *     summary: Get states by country ID
 *     description: Retrieves a list of states based on the provided country ID for use in dropdown menus.
 *     tags:
 *       - Master Data
 *     parameters:
 *       - in: query
 *         name: country_id
 *         required: true
 *         description: ID of the country to retrieve states for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful retrieval of states list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: States retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 1
 *                       label:
 *                         type: string
 *                         example: California
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: country_id is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */

  app.route('/master/citiesDropdown').get(countryController.getCityByStateId)
  /**
 * @swagger
 * /master/citiesDropdown:
 *   get:
 *     summary: Get cities by state ID
 *     description: Retrieves a list of cities based on the provided state ID for use in dropdown menus.
 *     tags:
 *       - Master Data
 *     parameters:
 *       - in: query
 *         name: state_id
 *         required: true
 *         description: ID of the state to retrieve cities for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful retrieval of cities list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cities retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 1
 *                       label:
 *                         type: string
 *                         example: Los Angeles
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: state_id is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */



  app.route('/master/countryCodes').get(countryController.getCountryCodes)
  /**
 * @swagger
 * /master/countryCodes:
 *   get:
 *     summary: Get country codes
 *     description: Retrieves a list of country codes formatted with the phone code and country name for use in dropdown menus.
 *     tags:
 *       - Master Data
 *     responses:
 *       200:
 *         description: Successful retrieval of country codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Data fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: (1) United States
 *                       value:
 *                         type: string
 *                         example: (1) United States
 *                 error:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */


  app.route('/changePwd').post(userController.changePassword)
  /**
 * @swagger
 * /changePwd:
 *   post:
 *     summary: Change user password
 *     description: Allows a user to change their password by providing the old and new passwords.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *                 data:
 *                   type: string
 *                   example: Success
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error or password not updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Old password is wrong.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 data:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: boolean
 *                   example: true
 */



  app.route('/captcha/generate').get(verificationController.generateCaptcha)
  /**
 * @swagger
 * /captcha/generate:
 *   get:
 *     summary: Generate a new captcha
 *     description: Generates a new captcha image and returns its URL along with a UUID for future verification.
 *     tags:
 *       - Verification
 *     responses:
 *       200:
 *         description: Captcha generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Captcha generated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     realCaptcha:
 *                       type: string
 *                       description: The URL of the generated captcha image.
 *                       example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
 *                     uuid:
 *                       type: string
 *                       description: UUID associated with the captcha for future verification.
 *                       example: 550e8400-e29b-41d4-a716-446655440000
 *                 error:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Error details here
 *                 error:
 *                   type: boolean
 *                   example: true
 */


  app.route('/captcha/verification').post(verificationController.verifyCaptcha)
  /**
 * @swagger
 * /captcha/verification:
 *   post:
 *     summary: Verify a captcha
 *     description: Verifies the provided captcha against the stored value using a UUID.
 *     tags:
 *       - Verification
 *     requestBody:
 *       description: Captcha verification details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuId:
 *                 type: string
 *                 description: UUID associated with the captcha
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               captcha:
 *                 type: string
 *                 description: The captcha value entered by the user
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Captcha verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Captcha verified successfully.
 *                 data:
 *                   type: string
 *                   example: SUCCESS
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Captcha verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Captcha verification failed.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Error details here
 *                 error:
 *                   type: boolean
 *                   example: true
 */



  app.route('/captcha/reGenerate').post(verificationController.regenerateCaptcha)
  /**
 * @swagger
 * /captcha/reGenerate:
 *   post:
 *     summary: Regenerate a captcha
 *     description: Deletes the existing captcha associated with the UUID and generates a new captcha.
 *     tags:
 *       - Verification
 *     requestBody:
 *       description: UUID for the captcha to be regenerated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuId:
 *                 type: string
 *                 description: UUID associated with the captcha
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Captcha regenerated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Captcha generated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     realCaptcha:
 *                       type: string
 *                       description: The new captcha image URL
 *                       example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCA...
 *                     uuid:
 *                       type: string
 *                       description: The UUID associated with the new captcha
 *                       example: 550e8400-e29b-41d4-a716-446655440000
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: UUID is required.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Error details here
 *                 error:
 *                   type: boolean
 *                   example: true
 */


  app.route('/captcha/scheduller').delete(verificationController.autoDeleteCaptcha)
  /**
 * @swagger
 * /captcha/scheduler:
 *   delete:
 *     summary: Automatically delete old captchas
 *     description: Deletes captchas that are older than 7 days from the database.
 *     tags:
 *       - Verification
 *     responses:
 *       200:
 *         description: Old captchas deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Old captchas deleted successfully.
 *                 data:
 *                   type: string
 *                   example: Success
 *                 error:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Error details here
 *                 error:
 *                   type: boolean
 *                   example: true
 */



}



