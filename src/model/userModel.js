const sql = require('../config/dbConfig');

const signUpUser = (data) => {
    return new Promise((resolve, reject) => {
        let { firstName, lastName, mobileNo, login_id } = data;

        let query = 'INSERT INTO users (firstName,lastName,mobileNo,login_id,isActive,updatedAt,createdAt) VALUES (?,?,?,?,1,NOW(),NOW())';
        let values = [firstName, lastName, mobileNo, login_id]

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
        let query = 'INSERT INTO otp_verification ( requestId, requestType, requestValue, otp, createdAt, updatedAt) VALUES (?,?,?,?,NOW(),NOW())';
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



module.exports =
{
    signUpUser,
    saveOtp,
    deleteOtp,
    saveLogin
}