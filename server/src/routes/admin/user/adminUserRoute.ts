import express, { Router } from "express"

import * as manageUsersController from '../../../controllers/admin/manageUsers.controller' 

const { asyncHandler } = require('../../middlewares/asyncHandler');
const { signup: signupValidator, signin: signinValidator } = require('../../validators/auth/auth');

const router: Router = express.Router();

router.route('/get_user')
    .post(asyncHandler(manageUsersController.getUser));

export { router as adminUserRouter };