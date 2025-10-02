import express, { Router } from "express"

import * as manageUsersController from '../../../controllers/admin/manageUsers.controller' 

import { asyncHandler } from '../../../middleware/asyncHandler'

const router: Router = express.Router();

router.route('/get_user')
    .get(asyncHandler(manageUsersController.getUser));

router.route('/get_all_users')
    .get(asyncHandler(manageUsersController.getAllUsers));

router.route('/edit_user')
    .post(asyncHandler(manageUsersController.editUser));

router.route('/ban_user')
    .post(asyncHandler(manageUsersController.banUser));
    
export { router as adminUserRouter };