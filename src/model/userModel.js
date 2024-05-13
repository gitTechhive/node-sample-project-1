const sql = require('../config/dbConfig');

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