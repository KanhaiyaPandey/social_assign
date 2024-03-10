import { Router } from 'express';
import upload from '../middlewares/multerMiddleware.js';
import { deleteUser, follow, getSingleUser, unfollow, updatetUser } from '../controllers/userController.js';

const router = Router();

router.put('/:id', upload.single('profilePicture'), updatetUser);
router.put("/:id/unfollow", unfollow);
router.delete("/:id/delete", deleteUser);
router.put("/:id/follow", follow );
router.get("/:id", getSingleUser);

export default router;