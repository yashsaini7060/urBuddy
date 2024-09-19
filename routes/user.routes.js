import { Router } from "express";
import { register, login, logout, registerMentor, changePassword, forgetPassword, resetPassword, getProfile, updateUser} from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { isLoggedIn } from "../middlewares/auth.middleware.js"; 
 
const router = Router();



router.post('/register', upload.single("avatar") , register);
router.post('/register/mentor', upload.single("avatar") , registerMentor);
router.post('/login', login);
router.get('/logout', logout);
router.post('/reset', forgetPassword);
router.post('/reset/:resetToken', resetPassword);
router.get('/changePassword', isLoggedIn, changePassword);
router.get('/profile',isLoggedIn, getProfile);
router.put('/update/:id',isLoggedIn,  upload.single("avatar"), updateUser);


export default router;
