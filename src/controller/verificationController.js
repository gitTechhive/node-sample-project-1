// Import required modules and helpers
const commonHelper = require('../helper/commonHelper'); // Helper functions
const config = require('../config/config'); // Configuration settings
const logger = require('../helper/logger'); // Logging utility
const sendMail = require('../helper/emailSender'); // Email sending utility
const Stomp = require('stompjs'); // STOMP client library for messaging
const { v4: uuidv4 } = require('uuid') // NPM library to generate random uuid
const Captcha = require("captcha-generator-alphanumeric").default;
const verificationModel = require('../model/verificationModel')
const moment = require('moment');
const successMessages = require('../helper/successMessages');
const errorMessages = require('../helper/errorMessages');

const generateCaptcha = async (req, res) => {
    try {

        let uuid = uuidv4()

        let captcha = new Captcha();

        let captchaUrl = captcha.dataURL

        let hiddenCaptcha = captcha.value

        const currentTime = moment();
        const minutesToAdd = 5;

        // Add minutes to the current date and time
        const futureTime = currentTime.add(minutesToAdd, 'minutes');

        // Format the date as desired
        const expiryTime = futureTime.format('YYYY-MM-DD HH:mm:ss')

        let insertCaptchaTask = await verificationModel.insertCaptcha({ uuid, hiddenCaptcha, expiryTime })

        let data = {
            captchaUrl: captchaUrl,
            uuid: uuid
        }

        res.send({ status: 200, message: successMessages.CAPTCHA_GENERATED, data: data, error: false });

    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "Internal Server Error", data: error, error: true });
    }
}

const verifyCaptcha = async (req, res) => {
    try {
        let { uuid, captcha } = req.query

        let getCaptchaDetails = {
            tableName: 'captcha_verification',
            whereCondition: ` AND uuid = '${uuid}' AND expiryTimeStamp > NOW()`
        }

        let getCaptchaTask = await commonHelper.searchData(getCaptchaDetails)

        if (getCaptchaTask.length == 0) {
            return res.status(403).send({ status: 403, message: errorMessages.CAPTCHA_EXPIRED, data: [], error: true })
        }

        let hiddenCaptcha = getCaptchaTask[0].hiddenCaptcha

        if (hiddenCaptcha === captcha) {

            let updateCaptchaStatusTask = await verificationModel.updateStatus({ uuid })

            return res.status(200).send({ status: 200, message: successMessages.CAPTCHA_VERIFIED, data: "SUCCESS", error: false })

        } else {

            return res.status(403).send({ status: 403, message: errorMessages.CAPTCHA_VERIFICATION_FAILED, data: [], error: true })

        }

    } catch (error) {
        console.log(error);
        return res.send({ status: 500, message: "Internal Server Error", data: error, error: true });
    }
}

const regenerateCaptcha = async (req, res) => {
    try {
        let { uuid } = req.query

        let deleteCaptchaTask = await verificationModel.deleteCaptcha({ uuid })

        let captcha = new Captcha();

        let captchaUrl = captcha.dataURL

        let hiddenCaptcha = captcha.value

        const currentTime = moment();
        const minutesToAdd = 5;

        // Add minutes to the current date and time
        const futureTime = currentTime.add(minutesToAdd, 'minutes');

        // Format the date as desired
        const expiryTime = futureTime.format('YYYY-MM-DD HH:mm:ss')

        let insertCaptchaTask = await verificationModel.insertCaptcha({ uuid, hiddenCaptcha, expiryTime })

        let data = {
            captchaUrl: captchaUrl,
            uuid: uuid
        }

        res.send({ status: 200, message: successMessages.CAPTCHA_GENERATED, data: data, error: false });


    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "Internal Server Error", data: error, error: true });
    }
}

const autoDeleteCaptcha = async (req, res) => {
    try {

        // Get the current date and time
        const today = moment();

        // Subtract 7 days from the current date and time
        const sevenDaysAgo = today.subtract(7, 'days');

        // Format the date and time to your desired format
        const dateTime = sevenDaysAgo.format('YYYY-MM-DD HH:mm:ss');

        let deleteOldCaptchaTask = await verificationModel.deleteOldCaptcha({ dateTime })

        logger.infoLogger.info(successMessages.OLD_CAPTCHA_DELETED);
        return res.status(200).send({ status: 200, message: successMessages.OLD_CAPTCHA_DELETED, data: 'Success', error: false });

    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "Internal Server Error", data: error, error: true });
    }
}

module.exports = {
    generateCaptcha,
    verifyCaptcha,
    regenerateCaptcha,
    autoDeleteCaptcha
}


