import express, { Router } from "express"

import * as getAllOrganizations from '../../../controllers/admin/manageOrganizations.controller'

import { asyncHandler } from '../../../middleware/asyncHandler'

import upload from "../../../middleware/upload";

const router: Router = express.Router();

router.route('/organizations')
    .get(upload.none(), asyncHandler(getAllOrganizations.getAllOrganizations));


export { router as organizationRoute };