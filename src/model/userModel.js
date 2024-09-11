const sql = require('../config/dbConfig');
/**
 * Inserts a new user into the users table.
 * @param {Object} data - Object containing user details.
 * @param {string} data.firstName - User's first name.
 * @param {string} data.lastName - User's last name.
 * @param {string} data.mobileNo - User's mobile number.
 * @param {string} data.login_id - The login ID associated with the user.
 * @param {string} data.type - The type of user.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const signUpUser = (data) => {
    return new Promise((resolve, reject) => {
        let { firstName, lastName, mobileNo, login_id, type } = data;

        let query = 'INSERT INTO users (firstName,lastName,mobileNo,login_id,isActive,updated_at,created_at,type) VALUES (?,?,?,?,1,NOW(),NOW(),?)';
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
/**
 * Saves login information into the login table.
 * @param {Object} data - Object containing login details.
 * @param {string} data.email - User's email.
 * @param {string} data.password - User's password.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const saveLogin = (data) => {
    return new Promise((resolve, reject) => {
        let { email, password } = data;

        let query = 'INSERT INTO login (email,password,is_active,updated_at,created_at) VALUES (?,?,1,NOW(),NOW())';
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
/**
 * Saves login information for a user signing up with Google.
 * @param {Object} data - Object containing login details.
 * @param {string} data.email - User's email.
 * @param {string} data.googleId - The Google ID associated with the user.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const saveLoginWithGoogle = (data) => {
    return new Promise((resolve, reject) => {
        let { email, password, googleId } = data;

        let query = 'INSERT INTO login (email,google_id,is_active,updated_at,created_at) VALUES (?,?,1,NOW(),NOW())';
        let values = [email, googleId]

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
 * Saves an OTP into the otp_verification table.
 * @param {Object} data - Object containing OTP details.
 * @param {string} data.requestId - The request ID for OTP.
 * @param {string} data.requestType - The type of request.
 * @param {string} data.requestValue - The value associated with the request.
 * @param {string} data.otp - The OTP code.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const saveOtp = (data) => {
    return new Promise((resolve, reject) => {
        let { requestId, requestType, requestValue, otp } = data;

        let query = 'INSERT INTO otp_verification ( request_id, request_type, request_value, otp, created_at, updated_at,otp_expired_on) VALUES (?,?,?,?,NOW(),NOW(),DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
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
/**
 * Deletes an OTP from the otp_verification table using request ID.
 * @param {Object} data - Object containing the request ID.
 * @param {string} data.requestId - The request ID for deleting the OTP.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const deleteOtp = (data) => {
    return new Promise((resolve, reject) => {
        let { requestId } = data;

        let query = `DELETE from otp_verification where request_id = '${requestId}'`;

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
/**
 * Updates the password in the login table for a specific email.
 * @param {Object} data - Object containing email and new password.
 * @param {string} data.new_password - The new password.
 * @param {string} data.email - The email associated with the login.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
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
/**
 * Retrieves the profile of a user based on the user ID.
 * @param {Object} data - Object containing the user ID.
 * @param {number} data.id - The user ID.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const getProfile = (data) => {
    return new Promise((resolve, reject) => {
        let { id } = data

        let query = `SELECT u.firstName, u.lastName, u.address, u.pincode as pinCode, u.mobileNo, u.bio, l.email,u.phoneCode as phonecode,u.country as country_id,u.state as state_id,u.city as cities_id,
        ud.original_name, ud.url AS profilePicUrl, c.name AS country, s.name AS state, ci.name AS cities FROM users u 
        LEFT JOIN user_docs ud ON u.id = ud.user_id
        LEFT JOIN login l ON l.id = u.login_id
        LEFT JOIN countries c ON u.country = c.id
        LEFT JOIN states s ON u.state = s.id
        LEFT JOIN cities ci ON u.city = ci.id WHERE u.id = ${id}`

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
/**
 * Updates the user profile or email based on the presence of login_id.
 * @param {Object} data - Object containing profile details.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const updateProfile = (data) => {
    return new Promise((resolve, reject) => {
        let query = ``
        let values = []

        let { firstName, lastName, mobileNo, address, country_id, state_id, cities_id, pinCode, current_user, phonecode, email, login_id, bio } = data;

        if (!login_id) {
            query = `UPDATE users SET firstname = ?, lastName = ?, mobileNo = ?, updated_at = NOW(), address = ?, country = ?,
        state =?, city =?, pincode = ?, last_modified_by = ?, phoneCode = ?,bio = ? WHERE id = ?`;
            values.push(firstName, lastName, mobileNo, address, country_id, state_id, cities_id, pinCode, current_user, phonecode, bio, current_user)
        }
        else {
            query = `UPDATE login SET email = ? WHERE id = ?`
            values.push(email, login_id)
        }

        sql.query(query, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
/**
 * Removes the profile picture of the current user by deleting the entry in user_docs table.
 * @param {Object} data - Object containing the current user ID.
 * @param {number} data.current_user - The ID of the current user.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const removeProfilePic = (data) => {
    return new Promise((resolve, reject) => {
        let { current_user } = data

        let query = `DELETE FROM user_docs WHERE user_id = ${current_user}`

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
/**
 * Updates the profile picture for the current user in the user_docs table.
 * @param {Object} data - Object containing profile picture details.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const updateProfilePic = (data) => {
    return new Promise((resolve, reject) => {
        let { original_name,
            formatted_name,
            url,
            current_user,
            profile_pic } = data

        let values = []

        let query = `INSERT INTO user_docs(user_id, original_name, formatted_name, url, created_at, last_modified_by, created_by) VALUES (?,?,?,?,NOW(),?,?)`

        values.push(current_user, original_name, formatted_name, url, current_user, current_user)

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
 * Changes the user's password in the login table.
 * @param {Object} data - Object containing the user ID, new password, and login ID.
 * @param {number} data.current_user - The ID of the current user.
 * @param {string} data.newPassword - The new password.
 * @param {number} data.login_id - The login ID associated with the user.
 * @returns {Promise<Object>} Promise resolving to the result of the SQL query.
 */
const changePassword = (data) => {
    return new Promise((resolve, reject) => {
        let { current_user, newPassword, login_id } = data;
        var query = `UPDATE login SET password = '${newPassword}' WHERE id = ${login_id}`;
        sql.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

module.exports =
{
    signUpUser,
    saveOtp,
    deleteOtp,
    saveLogin,
    updatePassword,
    getProfile,
    updateProfile,
    removeProfilePic,
    updateProfilePic,
    changePassword,
    saveLoginWithGoogle
}