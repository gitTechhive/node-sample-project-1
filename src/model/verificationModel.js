const sql = require('../config/dbConfig');

const insertCaptcha = (data) => {
    return new Promise((resolve, reject) => {
        let { uuid, hiddenCaptcha, expiryTime } = data;

        let query = 'INSERT INTO captcha_verification (uuid, hiddenCaptcha, createdAt, expiryTimeStamp) VALUES (?,?,NOW(),?)';
        let values = [uuid, hiddenCaptcha, expiryTime]

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

const deleteCaptcha = (data) => {
    return new Promise((resolve, reject) => {
        let { uuid } = data;

        let query = `DELETE FROM captcha_verification WHERE uuid = ?`;
        let values = [uuid]

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

const updateStatus = (data) => {
    return new Promise((resolve, reject) => {
        let { uuid } = data;

        let query = `UPDATE captcha_verification SET isVerified = 1 WHERE uuid = ?`;
        let values = [uuid]

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

const deleteOldCaptcha = (data) => {
    return new Promise((resolve, reject) => {
        let { dateTime } = data

        let query = `DELETE FROM captcha_verification WHERE expiryTimeStamp < '${dateTime}';`;

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

module.exports = {
    insertCaptcha,
    deleteCaptcha,
    updateStatus,
    deleteOldCaptcha
}
