import express, { Router } from "express"

import * as manageOrganizationsController from '../../../controllers/admin/manageOrganizations.controller'

import { asyncHandler } from '../../../middleware/asyncHandler'

import upload from "../../../middleware/upload";

const router: Router = express.Router();

router.route('/organizations')
    .get(upload.none(), asyncHandler(manageOrganizationsController.getAllOrganizations));

router.route('/organizations/users')
    .put(upload.none(), asyncHandler(manageOrganizationsController.addUserToOrganization));

router.route('/organizations/users/:id')
    .delete(upload.none(), asyncHandler(manageOrganizationsController.removeUserFromOrganization));

export { router as organizationRoute };