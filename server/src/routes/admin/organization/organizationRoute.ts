import express, { Router } from "express"

import * as manageOrganizationsController from '../../../controllers/admin/manageOrganizations.controller'

import { asyncHandler } from '../../../middleware/asyncHandler'

import upload from "../../../middleware/upload";

const router: Router = express.Router();

router.route('/organizations')
    .get(upload.none(), asyncHandler(manageOrganizationsController.getAllOrganizations));

router.route('/organizations/users')
    .put(upload.none(), asyncHandler(manageOrganizationsController.addUserToOrganization));
    
export { router as organizationRoute };