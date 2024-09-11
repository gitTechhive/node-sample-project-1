const userModal = require('../model/userModel');
const logger = require('../helper/logger');
const successMessage = require('../helper/successMessages');
const errorMessage = require('../helper/errorMessages');
const commonHelper = require('../helper/commonHelper');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../helper/emailSender');
const CryptoJS = require("crypto-js");
const jwtAuthentication = require('../authConfig/jwtAuthentication')
/**
 * Generates and sends an OTP to the user's email for password reset.
 * @param {Object} req - The request object containing the email in the body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends an OTP to the user's email or an error message.
 */
const forgotPassOtpGenerator = async (req, res) => {
    try {
        let message = ""
        let bodyData = req.body
        // console.log(bodyData);
        let { email } = bodyData

        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        } else {
            let validEmail = commonHelper.verifyEmail(email)
            if (!validEmail) {
                message += errorMessage.ENTER_VALID_EMAIL
            }
        }

        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`)
            res.status(400).send({ status: 400, message: message, data: [], error: true })
        } else {

            let getEmail = {
                tableName: "login",
                whereCondition: ` AND email = '${email}'`
            }

            let getUser = await commonHelper.searchData(getEmail)
            if (getUser.length == 0) {
                return res.status(400).send({ status: 400, message: errorMessage.NO_USER_FOUND, data: [], error: true })
            }

            let OTP = commonHelper.generateOTP()
            // let OTP = 123456

            let details = {
                requestId: uuidv4(),
                requestType: "email",
                requestValue: email,
                otp: OTP
            }


            let saveOtp = await userModal.saveOtp(details);

            //Send a  email for otp
            let subject = `Forget Password Otp`;
            let defaultText = `Your Otp is ${OTP}`;
            sendMail.sendMail(email, null, null, null, defaultText, subject);
            let data = {
                requestId: details.requestId
            }
            if (saveOtp.affectedRows > 0) {
                logger.infoLogger.info(successMessage.OTP_SENDED_ON_YOUR_EMAIL)
                return res.status(200).json({ status: 200, message: successMessage.OTP_SENDED_ON_YOUR_EMAIL, data: data, error: false });
            }
        }
    } catch (err) {
        console.log(err);
        logger.errorLogger.error(`Internal server error : ${err}`)
        res.status(500).send({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: [], error: true })
    }
}
/**
 * Verifies the OTP provided by the user for password reset.
 * @param {Object} req - The request object containing email, otp, and requestId.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Verifies the OTP and responds with success or error.
 */
const forgotPassOtpVerification = async (req, res) => {
    try {

        logger.infoLogger.info(successMessage.ENTERED_FORGOT_PASSWORD_OTP_VERIFICATION)

        let bodyData = req.body
        let { email, otp, requestId } = bodyData
        let message = ""

        if (!otp) {
            message += errorMessage.OTP_IS_REQUIRED
        } else if (isNaN(otp)) {
            message += errorMessage.VALID_OTP_REQUIRED
        } else if (otp.length > 6) {
            message += errorMessage.VALID_OTP_REQUIRED
        }

        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }
        if (!requestId) {
            message += errorMessage.REQUEST_ID_IS_REQUIRED
        }

        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`)
            res.status(400).send({ status: 400, message: message, data: [], error: true })
        } else {
            let details = {
                tableName: "otp_verification",
                whereCondition: ` AND request_id = '${requestId}' AND request_value = '${email}' And otp = '${otp}'`
            }
            let user = await commonHelper.searchData(details)
            if (user.length <= 0) {
                return res.status(400).json({ status: 400, message: errorMessage.OTP_IS_NOT_MATCHED, data: [], error: true })
            } else {
                let details = {
                    tableName: "otp_verification",
                    whereCondition: ` AND NOW() > otp_expired_on AND requestId = '${requestId}'`
                }
                let user = await commonHelper.searchData(details)
                if (user.length > 0) {
                    return res.status(400).json({ status: 400, message: errorMessage.OTP_IS_EXPIRED, data: [], error: true })

                }
                else {

                    logger.infoLogger.info(successMessage.OTP_VERIFICATION_SUCCESSFULL)
                    res.status(200).json({ status: 200, message: successMessage.OTP_VERIFICATION_SUCCESSFULL, data: "SUCCESS", error: false })
                }
            }
        }
    } catch (err) {
        console.log(err)
        logger.errorLogger.error(`${errorMessage.INTERNAL_SERVER_ERROR}:${err}`)
        res.status(500).send({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: [], error: false })
    }
}
/**
 * Adds a new password for the user after OTP verification.
 * @param {Object} req - The request object containing the new password and email.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Updates the user's password or returns an error.
 */
const addNewPassword = async (req, res) => {
    try {

        logger.infoLogger.info(successMessage.ENTERED_ADD_NEW_PASSWORD)
        let bodyData = req.body
        let message = ""
        let { new_password, email } = bodyData

        if (!new_password) {
            message += errorMessage.NEW_PASSWORD_REQUIRED
        }
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }

        if (message) {
            logger.errorLogger.error(`Validation check message: ${message}`)
            res.status(400).send({ status: 400, message: message, data: [], error: true })
        } else {


            let user_id = 0
            let searchUser = {
                tableName: "login",
                whereCondition: ` AND email = '${email}' AND isActive = 1`
            }
            let userData = await commonHelper.searchData(searchUser)
            if (userData.length > 0) {
                user_id = userData[0].user_id
            }
            let password = CryptoJS.MD5(new_password).toString();

            let changePassword = await userModal.updatePassword({ email: email, new_password: password })
            if (changePassword.affectedRows > 0) {
                logger.infoLogger.info(successMessage.NEW_PASSWORD_ADDED_SUCCESSFULLY)
                res.status(200).send({ status: 200, message: successMessage.NEW_PASSWORD_ADDED_SUCCESSFULLY, data: "SUCCESS", error: false })
            } else {
                logger.errorLogger.error(errorMessage.SOMETHING_WENT_WRONG)
                return res.status(400).send({ status: 400, message: errorMessage.SOMETHING_WENT_WRONG, data: [], error: true })
            }
        }
    } catch (error) {
        console.log(error)
        logger.errorLogger.error(`Internal server error : ${error}`)
        res.status(500).send({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: [], error: true })
    }
}

module.exports = {

    forgotPassOtpGenerator,
    forgotPassOtpVerification,
    addNewPassword
}