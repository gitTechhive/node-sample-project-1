const sql = require('../config/dbConfig');

const signUpUser = (data) => {
    return new Promise((resolve, reject) => {
        let { firstName, lastName, mobileNo, login_id, type } = data;

        let query = 'INSERT INTO users (firstName,lastName,mobileNo,login_id,isActive,updatedAt,createdAt,type) VALUES (?,?,?,?,1,NOW(),NOW(),?)';
        let values = [firstName, lastName, mobileNo, login_id, type]

        sql.query(query, values, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

const saveLogin = (data) => {
    return new Promise((resolve, reject) => {
        let { email, password } = data;

        let query = 'INSERT INTO login (email,password,isActive,updatedAt,createdAt) VALUES (?,?,1,NOW(),NOW())';
        let values = [email, password]

        sql.query(query, values, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

const saveOtp = (data) => {
    return new Promise((resolve, reject) => {
        let { requestId, requestType, requestValue, otp } = data;

        let query = 'INSERT INTO otp_verification ( requestId, requestType, requestValue, otp, createdAt, updatedAt,otpExpiredOn) VALUES (?,?,?,?,NOW(),NOW(),DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
        let values = [requestId, requestType, requestValue, otp]

        sql.query(query, values, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                // console.log("res", res);
                resolve(res)
            }
        })
    })
}

const deleteOtp = (data) => {
    return new Promise((resolve, reject) => {
        let { requestId } = data;

        let query = `DELETE from otp_verification where requestId = '${requestId}'`;

        sql.query(query, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

const updatePassword = (data) => {
    return new Promise((resolve, reject) => {
        let { new_password, email } = data
        let query = `UPDATE login SET password='${new_password}' WHERE email = '${email}';`
        // console.log(query);
        sql.query(query, (err, res) => {
            if (err) { return reject(err); }
            else {
                resolve(res);
            }
        })
    })
}

module.exports =
{
    signUpUser,
    saveOtp,
    deleteOtp,
    saveLogin,
    updatePassword
}