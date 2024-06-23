import { Router } from "express";
import { register, login, logout, registerMentor, getProfile, changePassword, forgetPassword, resetPassword} from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();



router.post('/register', upload.single("avatar") , register);
router.post('/register/mentor', upload.single("avatar") , registerMentor);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile',isLoggedIn, getProfile);
router.post('/reset', forgetPassword);
router.post('/reset/:resetToken', resetPassword);
router.get('/changePassword', isLoggedIn, changePassword);



export default router;
