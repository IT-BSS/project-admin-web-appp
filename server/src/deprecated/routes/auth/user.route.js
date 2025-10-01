//user.route.js
const router = require('express').Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { verifyToken } = require('../../middlewares/auth/VerifyToken');
const { getUsers, getActiveSessions, changePassword, changeEmail } = require('../../controllers/auth/user.controller')
const { resetPasswordRequest, resetPassword } = require('../../controllers/auth/reset.pass.controller')
const { emailConfirmation, resendConfirmationEmail } = require('../../controllers/auth/EmailConfirmationController')

router.route('/UserInfo')
  .get(asyncHandler(verifyToken), asyncHandler(getUsers));

router.route('/active-sessions')
  .get(asyncHandler(verifyToken), asyncHandler(getActiveSessions));

router.route('/reset-password-request')
  .post(asyncHandler(resetPasswordRequest))

router.route('/reset-password')
  .post(asyncHandler(resetPassword))

router.route('/changeEmail')
  .post(asyncHandler(verifyToken), asyncHandler(changeEmail));

router.route('/changePassword')
  .post(asyncHandler(verifyToken), asyncHandler(changePassword));

// router.route('/changeEmail')
//   .post(asyncHandler(changeEmail)

module.exports = router;