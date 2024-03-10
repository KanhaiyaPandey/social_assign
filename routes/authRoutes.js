import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
// import { validateLoginInput, validateRegisterInput } from '../middlewares/validationMiddleware.js';
const router = Router();

router.post('/register',register);
router.post('/login', login);

export default router;