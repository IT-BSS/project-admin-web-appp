//auth.route.js
const router = require('express').Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const checkEmail = require('../../middlewares/checkEmail');
const { signup: signupValidator, signin: signinValidator } = require('../../validators/auth/auth');
const authController = require('../../controllers/auth/auth.controller');


router.route('/signup')
    .post(signupValidator, asyncHandler(checkEmail), asyncHandler(authController.signup));

router.route('/signin')
    .post(signinValidator, asyncHandler(authController.signin));

module.exports = router;