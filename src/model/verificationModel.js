const sql = require('../config/dbConfig');

const insertCaptcha = (data) => {
    return new Promise((resolve, reject) => {
        let { uuId, hiddenCaptcha, expiryTime } = data;
        // console.log(data)
        let query = 'INSERT INTO captcha_verification (uuid, hidden_captcha, created_at, expiry_timestamp) VALUES (?,?,NOW(),?)';
        let values = [uuId, hiddenCaptcha, expiryTime]
        // console.log(query)
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
        let { uuId } = data;

        let query = `DELETE FROM captcha_verification WHERE uuid = ?`;
        let values = [uuId]

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
        let { uuId } = data;

        let query = `UPDATE captcha_verification SET is_verified = 1 WHERE uuid = ?`;
        let values = [uuId]

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

        let query = `DELETE FROM captcha_verification WHERE expiry_timestamp < '${dateTime}';`;

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
