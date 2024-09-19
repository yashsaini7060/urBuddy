import { Router } from "express";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js";
import { createSession, getSessions, deleteSession, updateSession, bookSession } from "../controllers/session.controller.js";
const router = Router();

router.post('/createSession', isLoggedIn,  authorizedRoles("MENTOR") , createSession);
router.get('/getSession', isLoggedIn, authorizedRoles("MENTOR"), getSessions);
router.delete('/:sessionId', isLoggedIn, authorizedRoles("MENTOR"), deleteSession);
router.patch('/:sessionId', isLoggedIn, authorizedRoles("MENTOR"), updateSession);
router.patch('/:sessionId', isLoggedIn, authorizedRoles("STUDENT"), bookSession);
export default router;
