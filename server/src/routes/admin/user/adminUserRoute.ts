import express, { Router } from "express"

import * as manageUsersController from '../../../controllers/admin/manageUsers.controller' 

import { asyncHandler } from '../../../middleware/asyncHandler'

import upload from "../../../middleware/upload";

const router: Router = express.Router();

router.route('/get_user')
    .get(upload.none(), asyncHandler(manageUsersController.getUser));

router.route('/get_all_users')
    .get(upload.none(), asyncHandler(manageUsersController.getAllUsers));

router.route('/add_user')
    .post(upload.none(), asyncHandler(manageUsersController.addUser));
    
router.route('/edit_user')
    .post(upload.none(), asyncHandler(manageUsersController.editUser));

router.route('/ban_user')
    .post(upload.none(), asyncHandler(manageUsersController.banUser));
    
export { router as adminUserRouter };