const userModal = require('../model/userModel');
const logger = require('../helper/logger');
const successMessage = require('../helper/successMessages');
const errorMessage = require('../helper/errorMessages');
const commonHelper = require('../helper/commonHelper');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../helper/emailSender');
const CryptoJS = require("crypto-js");
const jwtAuthentication = require('../authConfig/jwtAuthentication')

const generatOtpForRegistration = async (req, res) => {
    try {
        logger.infoLogger.info("Entered Signup Api!!");
        let bodyData = req.body
        let { firstName, lastName, mobileNo, email } = bodyData;
        let message = '';
        if (!firstName) {
            message += errorMessage.FIRST_NAME_IS_REQUIRED
        }
        if (!lastName) {
            message += errorMessage.MOBILE_NO_IS_REQUIRED
        }
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }
        if (!mobileNo) {
            message += errorMessage.MOBILE_NO_IS_REQUIRED
        }
        if (message) {
            logger.errorLogger.error(`Validation Error ` + message);
            return res.status(400).json({ status: 400, message: message, data: [], error: true });
        }

        let checkUserExistanceDetail = {
            tableName: "login",
            whereCondition: ` AND email = '${email}'`
        }
        let emailExistance = await commonHelper.searchData(checkUserExistanceDetail);
        if (emailExistance.length > 0) {
            logger.errorLogger.error();
            return res.status(400).json({ status: 400, message: errorMessage.USER_IS_ALREAY_EXIST, data: [], error: true });
        }
        let checkMobileExistanceDetail = {
            tableName: "users",
            whereCondition: ` AND mobileNo = '${mobileNo}'`
        }
        let mobileExistance = await commonHelper.searchData(checkMobileExistanceDetail);
        // console.log(mobileExistance);
        if (mobileExistance.length > 0) {
            logger.errorLogger.error();
            return res.status(400).json({ status: 400, message: errorMessage.USER_MOBILENO_IS_ALREADY_EXIST, data: [], error: true });
        }
        let geneteOtp = commonHelper.generateOTP();
        let details = {
            requestId: uuidv4(),
            requestType: "email",
            requestValue: email,
            otp: geneteOtp
        }


        let saveOtp = await userModal.saveOtp(details);

        //Send a  email for otp
        let subject = `Registraion Otp`;
        let defaultText = `Your Otp is ${geneteOtp}`;
        sendMail.sendMail(email, null, null, null, defaultText, subject);
        let data = {
            requestId: details.requestId
        }
        if (saveOtp.affectedRows > 0) {
            logger.infoLogger.info(successMessage.OTP_SENDED_ON_YOUR_EMAIL)
            return res.status(200).json({ status: 200, message: successMessage.OTP_SENDED_ON_YOUR_EMAIL, data: data, error: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}

const verifyOtpForRegistration = async (req, res) => {
    try {
        logger.infoLogger.info("Entered Signup Api!!");
        let bodyData = req.body
        let { firstName, lastName, mobileNo, email, otp, requestId } = bodyData;
        let message = '';
        if (!firstName) {
            message += errorMessage.FIRST_NAME_IS_REQUIRED
        }
        if (!lastName) {
            message += errorMessage.MOBILE_NO_IS_REQUIRED
        }
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }
        if (!mobileNo) {
            message += errorMessage.MOBILE_NO_IS_REQUIRED
        }
        if (!otp) {
            message += errorMessage.OTP_IS_REQUIRED
        }
        if (!requestId) {
            message += errorMessage.REQUEST_ID_IS_REQUIRED
        }
        if (message) {
            logger.errorLogger.error(`Validation Error ` + message);
            return res.status(400).json({ status: 400, message: message, data: [], error: true });
        }
        let checkUserExistanceDetail = {
            tableName: "login",
            whereCondition: ` AND email = '${email}'`
        }
        let emailExistance = await commonHelper.searchData(checkUserExistanceDetail);
        if (emailExistance.length > 0) {
            logger.errorLogger.error();
            return res.status(400).json({ status: 400, message: errorMessage.USER_IS_ALREAY_EXIST, data: [], error: true });
        }
        let checkMobileExistanceDetail = {
            tableName: "users",
            whereCondition: ` AND mobileNo = '${mobileNo}'`
        }
        let mobileExistance = await commonHelper.searchData(checkMobileExistanceDetail);
        // console.log(mobileExistance);
        if (mobileExistance.length > 0) {
            logger.errorLogger.error();
            return res.status(400).json({ status: 400, message: errorMessage.USER_MOBILENO_IS_ALREADY_EXIST, data: [], error: true });
        }
        let searchOtpDetail = {
            tableName: "otp_verification",
            whereCondition: ` AND requestId = '${requestId}' AND requestValue = '${email}' And otp = '${otp}'`
        }

        let searchOtp = await commonHelper.searchData(searchOtpDetail);

        if (searchOtp.length <= 0) {
            return res.status(400).json({ status: 400, message: errorMessage.OTP_IS_NOT_MATCHED, data: [], error: true })
        }

        await userModal.deleteOtp({ requestId: requestId });

        let password = commonHelper.generatePassword();
        let subject = `Password`;
        let defaultText = `Your Password is ${password}`;
        sendMail.sendMail(email, null, null, null, defaultText, subject);

        bodyData.password = CryptoJS.MD5(password).toString();
        let saveEmailPassword = await userModal.saveLogin({ email, password: bodyData.password });

        bodyData.login_id = saveEmailPassword.insertId
        let saveUser = await userModal.signUpUser(bodyData);
        if (saveUser.affectedRows > 0) {
            let tokenData = { firstName, lastName, mobileNo, email, id: saveUser.insertId };
            let token = jwtAuthentication.signToken(tokenData);
            let data = {};
            data.id = saveUser.insertId
            data.firstName = firstName
            data.lastName = lastName
            data.email = email
            data.mobileNo = mobileNo
            data.token = token;
            logger.infoLogger.info(successMessage.OTP_SENDED_ON_YOUR_EMAIL)
            return res.status(200).json({ status: 200, message: successMessage.OTP_SENDED_ON_YOUR_EMAIL, data: data, error: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let message = ''
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }
        if (!password) {
            message += errorMessage.PASSWORD_IS_REQUIRED
        }
        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`)
            return res.status(400).json({
                status: 400,
                message: message,
                data: [],
                error: true,
            });
        }
        password = CryptoJS.MD5(password).toString();

        let details = { tableName: `login`, whereCondition: ` AND email = '${email}'` }
        let user = await commonHelper.searchData(details);
        let userExtraDetails = { tableName: `users`, whereCondition: ` AND login_id = '${user[0].id}'` }
        let userData = await commonHelper.searchData(userExtraDetails);
        if (user.length > 0) {

            if (password != user[0].password) {
                return res.status(400).send({
                    status: 400,
                    message: errorMessage.INVALID_PASSWORD,
                    data: [],
                    error: true,
                });
            }

            let id = userData[0].id
            let firstName = userData[0].firstName
            let lastName = userData[0].lastName
            let email = user[0].email
            let mobileNo = userData[0].mobileNo

            let data = {}
            let tokenData = { id, firstName, lastName, email, mobileNo };
            let token = jwtAuthentication.signToken(tokenData);
            data.id = id
            data.firstName = firstName
            data.lastName = lastName
            data.email = email
            data.mobileNo = mobileNo
            data.token = token;

            logger.infoLogger.info(successMessage.LOGIN_SUCCESSFULL);
            return res.status(200).json({
                status: 200,
                message: successMessage.LOGIN_SUCCESSFULL,
                data: data,
                error: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}

module.exports = {
    generatOtpForRegistration,
    verifyOtpForRegistration,
    login
}