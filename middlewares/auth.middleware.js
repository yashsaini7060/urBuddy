import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken';

const isLoggedIn = async (req, res, next) => {
  const {token} = req.cookies;
  if(!token){
    return next(new AppError('Unauthenticated, please login again', 401))
  }
  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;

  next();
}


const authorizedRoles =(...roles) => async (req, res, next) => {

  const currentUserRoles = req.user.role;
  if(!roles.includes(currentUserRoles)){
    return next(new AppError('You are not authorized to perform this action', 403))
  }

  next();

}


export{
  isLoggedIn,
  authorizedRoles
}