//user.model.js
const db = require('../../config/db.config');
const { createResetToken, updatePassword, createEmailConfirmedToken:createEmailConfirmedTokenQuery} = require('../../database/queries');
const { logger } = require('../../utils/logger');

class ResetPasswordService {
  static create(user_id, token, expires_on, cb) {
    db.query(createResetToken, [user_id, token, expires_on], (err, res) => {
      console.log('res', res);
      console.log('err', err);
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, {
        user_id: res.insertId,
        token: token,
        expires_at: expires_on
      });
    });
  }

  static updatePassword(user_id, newPassword, cb) {
    db.query(updatePassword, [newPassword, user_id], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
    });
  }

  static findTokenByToken(token, cb) {
    const query = 'SELECT user_id FROM resetPassword WHERE token = ? AND used = 0 AND expires_on > NOW()';
    db.query(query, [token], (err, rows) => {
      if (err) {
        cb(err, null);
        return;
      }
      if (rows.length === 0) {
        cb(null, null); // Token not found or expired
        return;
      }
      cb(null, rows[0]);
    });
  }

  static updateResetToken(token, user_id, cb) {
    const updateQuery = 'UPDATE resetPassword SET used = 1, token = NULL, created_on = NOW() WHERE token = ? AND user_id = ?';
    db.query(updateQuery, [token, user_id], (err) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null);
    });
  }

  static deleteExpiredTokensForUser(user_id, cb) {
    const deleteQuery = 'DELETE FROM resetPassword WHERE user_id = ? AND used = 1 AND token IS NULL';
    db.query(deleteQuery, [user_id], (err, res) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null, res);
    });
  }

  static checkEmailConfirmationToken(token, cb) {
    const query = 'SELECT token FROM email_confirmed WHERE token = ?';
    db.query(query, [token], (err, results) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (results.length === 0) {
        cb(null, null);
        return;
      }
      cb(null, results[0].token);
    });
  }

  static setEmailConfirmedStatus(user_id, cb) {
    const updateQuery = 'UPDATE users SET is_email_confirmed = 1 WHERE user_id = ?';
    db.query(updateQuery, [user_id], (err) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null);
    });
  }

  static updateEmailConfirmedToken(token, cb) {
    const updateQuery = 'UPDATE email_confirmed SET token = NULL, is_used = 1 WHERE token = ?';
    db.query(updateQuery, [token], (err) => {
      console.log(err)
      if (err) {
        cb(err);
        return;
      }
      cb(null);
    });
  }

  static createEmailConfirmedToken(user_id, token, expires_on, cb) {
    db.query(createEmailConfirmedTokenQuery, [user_id, token, expires_on], (err, res) => {
        if (err) {
            logger.error(err.message);
            cb(err, null);
            return;
        }
        cb(null, {
            user_id: res.insertId,
            token: token,
            expires_on: expires_on
        });
    });
}

  static getEmailByUsername(user_id, cb) {
    const query = 'SELECT email FROM users WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
      if (err) {
        cb(err, null);
        return;
      }

      if (results.length === 0) {
        cb(null, null);
      } else {
        cb(null, results[0].email);
      }
    });
  }

  static getEmailByUserId(user_id, cb) {
    const query = 'SELECT email FROM users WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null, results)
    })
  }

  static updateEmailByUserId(user_id, newEmail, cb) {
    const query = 'UPDATE users SET email = ? WHERE user_id = ?';
    db.query(query, [newEmail, user_id], (err, results) => {
      if (err) {
        cb(err);
        return;
      }

      cb(null, results);
    });
  }

  static async getPasswordByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT password FROM users WHERE user_id = ?', [user_id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0].password);
      });
    });
  }

  static async updatePassword(user_id, newPassword) {
    return new Promise((resolve, reject) => {
      db.query(updatePassword, [newPassword, user_id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }


}



module.exports = ResetPasswordService;