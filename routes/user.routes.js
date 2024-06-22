import { Router } from "express";
import { register, login, logout, registerMentor, profile} from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();



router.post('/register', upload.single("avatar") , register);
router.post('/register/mentor', upload.single("avatar") , registerMentor);

router.get('/profile', profile);


router.post('/login', login);
router.get('/logout', logout);


export default router;
