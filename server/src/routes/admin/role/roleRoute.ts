import express, { Router } from "express"

import * as manageRolesController from '../../../controllers/admin/manageRoles.controller'

import { asyncHandler } from '../../../middleware/asyncHandler'

import upload from "../../../middleware/upload";

const router: Router = express.Router();

router.route('/roles')
    .get(upload.none(), asyncHandler(manageRolesController.getAllRoles));

router.route('/roles')
    .post(upload.none(), asyncHandler(manageRolesController.addRole));
    
router.route('/roles/:id')
    .put(upload.none(), asyncHandler(manageRolesController.editRole));

export { router as roleRoute };