import { Router } from 'express';
import { getHello } from '../controller/helloController';

const router: Router = Router();

// GET /api/hello - test endpoint for checking server work
router.get('/', getHello);

export default router;