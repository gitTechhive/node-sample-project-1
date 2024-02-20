const sql = require('../config/dbConfig');
const secretKEY = require('../authConfig/publicKey')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const config = require('../config/config')

const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.+([a-zA-Z]+)*$/;
const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
const usernameValidation = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;

const verifyEmail = (email) => {
    return (emailValidation.test(email))
}

const verifyPassword = (password) => {
    return (passwordValidation.test(password))
}

const verifyUsername = (username) => {
    return (usernameValidation.test(username))
}

const verifyPastDates = (birthdate) => {
    var dateOfBirth = new Date(birthdate);

    if (isNaN(dateOfBirth)) {
        return false; // Invalid birthdate format
    }

    var currentDate = new Date();

    if (dateOfBirth > currentDate) {
        return false; // Birthdate is in the future
    }

    return true;
}

const searchData = ({ tableName, whereCondition = '', columnName = '*', otherCondition = '' }) => {
    return new Promise((resolve, reject) => {
        const whereConditions = whereCondition ? `WHERE 1=1 ${whereCondition}` : '';
        const query = `SELECT ${columnName} FROM ${tableName} ${whereConditions} ${otherCondition}`;
        const values = [];
        // console.log(query);
        sql.query(query, values, (err, result) => {
            if (err) {
                console.log("error", err)
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}

//This Function is used For Check the user Existance
const checkOwnerExistence = (data) => {
    return new Promise((resolve, reject) => {
        let { email, mobileNo, user_name } = data

        let whereCondition = " WHERE 1=1 "
        let values = []

        if (email) {
            whereCondition += " AND email =?"
            values.push(email)
        }

        if (mobileNo) {
            whereCondition += " AND mobile_no=?"
            values.push(mobileNo)
        }

        if (user_name) {
            whereCondition += " AND user_name =?"
            values.push(user_name)
        }

        // if (actionType == "edit") {
        //     whereCondition += " AND user_id != ?"
        //     values.push(ownerId)
        // }

        let query = `SELECT * FROM user ${whereCondition}`

        sql.query(query, values, (err, result) => {
            if (err) {
                console.log("error", err)
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}

//This Function is used For Genetaring the otp
const generateOTP = () => {
    let digits = '0123456789';
    let otp = '';

    for (var i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

const generatePassword = () => {
    let char = '123456789@#$%qwertyuioplkjhgfdsazxcvbnm';
    let password = '';

    for (var i = 0; i < 8; i++) {
        password += char[Math.floor(Math.random() * char.length)];
    }
    return password;
}

const publicKEY = secretKEY.publicKey
//This Function used for get Details of user from the the token
const getDetails = (bearerToken) => {

    let verifyOptions = {
        expiresIn: "12h",
        algorithm: ["RS256"]
    };

    let token = bearerToken.split(' ')[1];
    let userDetail = jwt.decode(token, publicKEY, verifyOptions);
    return JSON.stringify(userDetail);

}
//This Function used for the formatted name for the file 
function generateFormattedName() {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const randomString = Math.random().toString(36).substr(2, 6);
    
    const formattedName = `${year}${month}${day}_${hours}${minutes}${seconds}_${randomString}`;

    return formattedName;
}

const unlinkProfilePic = (profile_picture_name) => {
    return (fs.unlink(`${config.imagePath}${profile_picture_name}`, (err) => {
        if (err) {
            console.error(err);
        }
    })
    )
}

//this function is used for get details of smtp for sending the email
const getSmtpDetail = () => {
    return new Promise((resolve, reject) => {

        let query = `SELECT type,value FROM config `
        sql.query(query, (err, result) => {
            if (err) {
                console.log("error", err)
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}
module.exports = {
    verifyEmail,
    verifyPassword,
    verifyUsername,
    verifyPastDates,
    searchData,
    checkOwnerExistence,
    generateOTP,
    getDetails,
    generateFormattedName,
    unlinkProfilePic,
    getSmtpDetail,
    generatePassword
}