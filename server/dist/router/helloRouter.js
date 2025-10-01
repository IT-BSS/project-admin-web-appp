import { Router } from 'express';
import { getHello } from '../controller/helloController.js';
const router = Router();
router.get('/', getHello);
export default router;
//# sourceMappingURL=helloRouter.js.map