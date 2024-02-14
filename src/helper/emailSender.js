const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const commonHelper = require('../helper/commonHelper')
const logger = require('../helper/logger')


const sendMail = async (to, templatePath, replacements, attachments, defaultText, subject) => {
    try {
        // Get SMTP details from your function or common helper
        let getSmtpDetail = await commonHelper.getSmtpDetail();
        const emailConfigObject = {};
        getSmtpDetail.forEach(({ type, value }) => {
            emailConfigObject[type] = value;
        });
        // console.log(emailConfigObject);
        const fromEmailAddress = emailConfigObject.FROM_EMAIL;
        const smtpHost = emailConfigObject.SMTP_HOST;
        const smtpPort = emailConfigObject.SMTP_PORT;
        const smtpUser = emailConfigObject.SMTP_USERNAME;
        const smtpPassword = emailConfigObject.SMTP_PASSWORD;

        // Create SMTP transport
        const smtpTransport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
        });

        let emailTemplateContent = ""
        let html = defaultText

        if (templatePath) {
            // Read the email template content
            emailTemplateContent = fs.readFileSync(templatePath, 'utf-8');

            // Customize the email content based on your template and replacements
            html = Object.entries(replacements).reduce((content, [placeholder, value]) => {
                const regex = new RegExp(`{${placeholder}}`, 'g');
                return content.replace(regex, value);
            }, emailTemplateContent);
        }

        // Create email data
        const updatedData = {
            to: Array.isArray(to) ? to.join(',') : to,
            html,
            from: `${fromEmailAddress}`,
            subject: `${subject}`,
            attachments,
        };

        // Send email
        const result = await smtpTransport.sendMail(updatedData);

        logger.infoLogger.info(result)
        // console.info(result);
    } catch (error) {
        logger.errorLogger.error(error)
        console.error(error);
    }
};

module.exports = {
    sendMail
}