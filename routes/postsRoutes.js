import { Router } from 'express';
import { 
       getAllPosts,createPost, updatePost,
       deletePost,likePost,getSinglePost
   } from '../controllers/postController.js';

import upload from '../middlewares/multerMiddleware.js';



const router = Router();

router.route('/timeline/all').get(getAllPosts);
router.post('/create-post',  upload.single('img'), createPost);
router.put("/:id/update", updatePost);
router.delete("/:id/delete", deletePost);
router.put("/:id/like", likePost );
router.get("/:id", getSinglePost);

export default router;

