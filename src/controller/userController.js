const userModal = require('../model/userModel');
const logger = require('../helper/logger');
const successMessage = require('../helper/successMessages');
const errorMessage = require('../helper/errorMessages');
const commonHelper = require('../helper/commonHelper');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../helper/emailSender');
const CryptoJS = require("crypto-js");
const jwtAuthentication = require('../authConfig/jwtAuthentication')
const config = require('../config/config')

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
        let { email, password, uuid } = req.body;
        let message = ''
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
        }
        if (!password) {
            message += errorMessage.PASSWORD_IS_REQUIRED
        }
        if (!uuid) {
            message += errorMessage.UUID_REQUIRED
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

        let captchaVerificationDetails = {
            tableName: 'captcha_verification',
            whereCondition: ` AND uuid = '${uuid}' AND isVerified = 1 AND expiryTimeStamp > NOW() `
        }

        let captchaVerificationTask = await commonHelper.searchData(captchaVerificationDetails)

        if (user.length > 0) {

            if (password != user[0].password) {
                return res.status(400).send({
                    status: 400,
                    message: errorMessage.INVALID_PASSWORD,
                    data: [],
                    error: true,
                });
            }

            if (captchaVerificationTask.length == 0) {
                return res.status(400).send({
                    status: 400,
                    message: errorMessage.CAPTCHA_VERIFICATION_FAILED,
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

const signUpWithGoogle = async (req, res) => {
    try {
        let bodyData = req.body
        let { firstName, lastName, email, type } = bodyData;
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
        if (!type) {
            message += errorMessage.TYPE_IS_REQUIRED
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
        // let checkMobileExistanceDetail = {
        //     tableName: "users",
        //     whereCondition: ` AND mobileNo = '${mobileNo}'`
        // }
        // let mobileExistance = await commonHelper.searchData(checkMobileExistanceDetail);
        // // console.log(mobileExistance);
        // if (mobileExistance.length > 0) {
        //     logger.errorLogger.error();
        //     return res.status(400).json({ status: 400, message: errorMessage.USER_MOBILENO_IS_ALREADY_EXIST, data: [], error: true });
        // }

        let saveEmailPassword = await userModal.saveLogin({ email, password: null });

        bodyData.login_id = saveEmailPassword.insertId
        let saveUser = await userModal.signUpUser(bodyData);
        if (saveUser.affectedRows > 0) {
            let tokenData = { firstName, lastName, email, id: saveUser.insertId };
            let token = jwtAuthentication.signToken(tokenData);
            let data = {};
            data.id = saveUser.insertId
            data.firstName = firstName
            data.lastName = lastName
            data.email = email
            // data.mobileNo = mobileNo
            data.token = token;
            logger.infoLogger.info(successMessage.OTP_SENDED_ON_YOUR_EMAIL)
            return res.status(200).json({ status: 200, message: successMessage.OTP_SENDED_ON_YOUR_EMAIL, data: data, error: false });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}

const getProfile = async (req, res) => {
    try {

        const token = req.headers.authorization;
        let userDetail = await commonHelper.getDetails(token);

        if (typeof userDetail === "string") {
            userDetail = JSON.parse(userDetail);
        }

        const current_user = userDetail.id;
        // Get user profile 
        let getUserProfileTask = await userModal.getProfile({ id: current_user })
        // Return 404 error if user not found
        if (getUserProfileTask.length == 0) {
            return res.status(404).json({ status: 404, message: errorMessage.RESOURCE_MISSING, data: error, error: true })
        }

        return res.status(200).json({ status: 200, message: successMessage.PROFILE_DETAILS_FETCHED, data: getUserProfileTask[0], error: false })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}


const loginWithGoogle = async (req, res) => {
    try {
        let { email } = req.body;
        let message = ''
        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED
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

        let details = { tableName: `login`, whereCondition: ` AND email = '${email}'` }
        let user = await commonHelper.searchData(details);
        let userExtraDetails = { tableName: `users`, whereCondition: ` AND login_id = '${user[0].id}'` }
        let userData = await commonHelper.searchData(userExtraDetails);
        if (user.length > 0) {

            let id = userData[0].id
            let firstName = userData[0].firstName
            let lastName = userData[0].lastName
            let email = user[0].email
            let mobileNo = userData[0].mobileNo

            let data = {}
            let tokenData = { id, firstName, lastName, email };
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

const editProfile = async (req, res) => {
    try {
        let bodyData = JSON.parse(req.body.user_info)
        const token = req.headers.authorization;
        let userDetail = await commonHelper.getDetails(token);

        if (typeof userDetail === "string") {
            userDetail = JSON.parse(userDetail);
        }

        const current_user = userDetail.id;
        bodyData.current_user = current_user;
        let { firstName, lastName, mobileNo, email, address, country, state, city, pinCode, phoneCode, profilePicUrl } = bodyData;

        let message = '';

        if (!firstName) {
            message += errorMessage.FIRST_NAME_IS_REQUIRED;
        }

        if (!lastName) {
            message += errorMessage.LAST_NAME_IS_REQUIRED;
        }

        if (!mobileNo) {
            message += errorMessage.MOBILE_NO_IS_REQUIRED;
        } else if (isNaN(mobileNo)) {
            message += errorMessage.MOBILE_ISNAN_ERROR
        } else {
            //Check in user table
            let mobileExistInUser = {
                tableName: 'users',
                whereCondition: ` AND mobileNo ='${mobileNo}' AND id NOT IN (${current_user}) AND isDeleted = 0 `
            }

            let getUserData = await commonHelper.searchData(mobileExistInUser)
            if (getUserData.length > 0) {
                message += errorMessage.MOBILE_NO_ALREADY_EXIST
            }
        }

        if (!email) {
            message += errorMessage.EMAIL_IS_REQUIRED;
        } else {

            //Check in user table
            let emailExistInUser = {
                tableName: 'users u LEFT JOIN login l ON u.login_id = l.id ',
                whereCondition: ` AND l.email ='${email}' AND u.id NOT IN (${current_user}) AND isDeleted = 0 `
            }

            let getUserData = await commonHelper.searchData(emailExistInUser)
            if (getUserData.length > 0) {
                message += errorMessage.EMAIL_ALREADY_EXIST
            }
        }

        if (!phoneCode) {
            message += errorMessage.PHONE_CODE_REQUIRED;
        }

        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`);
            return res.status(400).send({
                status: 400,
                message: message,
                data: [],
                error: true
            });
        }

        let updateDataTask = await userModal.updateProfile(bodyData);

        let getLoginIdDetail = {
            tableName: 'login',
            whereCondition: ` AND id = ${current_user} `
        }

        let getLoginIdTask = await commonHelper.searchData(getLoginIdDetail)

        let login_id = getLoginIdTask[0].login_id

        let updateLoginTask = await userModal.updateProfile({ email, login_id })

        if (profilePicUrl === null) {
            await userModal.removeProfilePic({ current_user });
        }
        if (req.files && req.files.profilePic) {

            const profile_pic = req.files.profilePic;
            let original_name = profile_pic.name;
            let extension = original_name.split('.')[1];
            let name = commonHelper.generateFormattedName();
            let formatted_name = name + '.' + extension;
            let url = `${req.protocol}://${req.headers["host"]}/images/${formatted_name}`;
            let filePath = `${config.imagePath}${formatted_name}`;
            profile_pic.mv(filePath, function (err) {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("Profile pic");
                }
            });

            const docData = {
                original_name,
                formatted_name,
                url,
                current_user,
                profile_pic
            };
            remove_pic = await userModal.removeProfilePic({ current_user });
            update_pic = await userModal.updateProfilePic(docData);
        }

        if (updateDataTask.affectedRows > 0) {
            logger.infoLogger.info(successMessage.PROFILE_IS_UPDATED);
            res.status(200).send({
                status: 200,
                message: successMessage.PROFILE_IS_UPDATED,
                data: 'Success',
                error: false
            })
        } else {
            logger.errorLogger.error(successMessage.PROFILE_IS_NOT_UPDATED);
            res.status(400).send({
                status: 400,
                message: successMessage.PROFILE_IS_NOT_UPDATED,
                data: [],
                error: true
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: errorMessage.INTERNAL_SERVER_ERROR, data: error, error: true })
    }
}

const changePassword = async (req, res) => {
    try {
        let bodyData = req.body;
        const token = req.headers.authorization;
        let userDetail = await commonHelper.getDetails(token);
        let { oldPassword, newPassword } = bodyData
        if (typeof userDetail === "string") {
            userDetail = JSON.parse(userDetail);
        }
        const current_user = userDetail.id;
        bodyData.current_user = current_user;
        let message = '';

        if (!oldPassword) {
            message += errorMessage.OLD_PASSWORD_IS_REQUIRED
        }
        if (!newPassword) {
            message += errorMessage.NEW_PASSWORD_IS_REQUIRED
        }

        if (message != '') {
            logger.errorLogger.error(`Validation error: ${message}`);
            return res.status(400).send({
                status: 400,
                message: message,
                data: [],
                error: true
            });
        }

        let detail = {
            tableName: ` users u LEFT JOIN login l ON u.login_id = l.id `,
            whereCondition: ` AND u.id = ${current_user} AND u.isDeleted = 0`
        }

        let get_data = await commonHelper.searchData(detail);

        bodyData.login_id = get_data[0].login_id

        if (get_data[0].password != CryptoJS.MD5(oldPassword).toString()) {
            logger.errorLogger.error(errorMessage.OLD_PASSWORD_IS_WRONG);
            return res.status(400).send({
                status: 400,
                message: errorMessage.OLD_PASSWORD_IS_WRONG,
                data: [],
                error: true
            })
        }

        bodyData.newPassword = CryptoJS.MD5(newPassword).toString();

        let update_password = await userModal.changePassword(bodyData);

        if (update_password.affectedRows > 0) {
            logger.infoLogger.info(successMessage.PASSWORD_UPDATED_SUCCESSFULLY);
            return res.status(200).send({
                status: 200,
                message: successMessage.PASSWORD_UPDATED_SUCCESSFULLY,
                data: 'Success',
                error: false
            })
        } else {
            logger.errorLogger.error(errorMessage.PASSWORD_NOT_UPDATED);
            return res.status(400).send({
                status: 400,
                message: errorMessage.PASSWORD_NOT_UPDATED,
                data: [],
                error: true
            })
        }
    } catch (error) {
        console.log(error);
        logger.errorLogger.error(errorMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).send({
            status: 500,
            message: errorMessage.INTERNAL_SERVER_ERROR,
            data: [],
            error: true
        });
    }
}


module.exports = {
    generatOtpForRegistration,
    verifyOtpForRegistration,
    login,
    signUpWithGoogle,
    loginWithGoogle,
    getProfile,
    editProfile,
    changePassword
}