const sql = require('../config/dbConfig');

/**
* Inserts captcha details into the captcha_verification table.
* @param {Object} data - Object containing captcha data.
* @param {string} data.uuId - The unique identifier for the captcha.
* @param {string} data.hiddenCaptcha - The hidden captcha value.
* @param {string} data.expiryTime - The expiry timestamp for the captcha.
* @returns {Promise<Object>} Promise resolving to the result of the SQL query.
*/
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
/**
 * Deletes captcha from the captcha_verification table using UUID.
 * @param {Object} data - Object containing the UUID for captcha deletion.
 * @param {string} data.uuId - The unique identifier for the captcha.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
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
/**
 * Updates the is_verified status to true for a given captcha UUID.
 * @param {Object} data - Object containing the UUID for the captcha.
 * @param {string} data.uuId - The unique identifier for the captcha.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
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
/**
 * Deletes all captchas from the captcha_verification table that have expired.
 * @param {Object} data - Object containing the current date-time for comparison.
 * @param {string} data.dateTime - The current date-time used to filter expired captchas.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
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
