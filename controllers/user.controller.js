import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import crypto from "crypto";
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true
}

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
    }
  });

  if (!user) {
    return next(new AppError('User registration failed, please try again'));
  }

  console.log(req.file)
  if(req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload( req.file.path, {
        folder: 'pwbuddy',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill'
      });

      if(result){
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        //remove files
      
        fs.rm(`uploads/${req.file.filename}`)

      }


    } catch (error) {
      
      return next( new AppError(error.message || 'File not uploaded, please try again', 500))

    }
  }



  await user.save();

  user.password = undefined;

  const token = await user.genreateJWTToken;

  res.cookie('token', token, cookieOptions)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }

};


const registerMentor = async (req, res, next) => {

  try {
    console.log(req.body)
    const {fullName, email, password, phone, company, position, experience, qualifications, expertise} = req.body;
    if (!fullName || !email || !password || !phone || !company || !position || !experience || !qualifications || !expertise) {
      return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });

    if(userExists){
      return next(new AppError('Email already exists', 400))
    }

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
      },
      role: 'MENTOR',
      phone,
      company,
      position,
      experience,
      qualifications,
      expertise,
    })

    if(!user){
       return next(new AppError('User registration failed, please try again'))
    }
    console.log(req.file)

    if(req.file){
      try {
        const result = await cloudinary.v2.uploader.upload(
          req.file.path, {
            folder: 'pwbuddy',
            width: 250,
            height: 250,
            gravity: 'faces',
            crop: 'fill'
          }
        );
        if(user){
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
        }
      } catch (error) {
        return next( new AppError(error.message || 'File not uploaded, please try again', 500))
      }
    }
    
    await user.save();
    user.password = undefined;
    const token = await user.genreateJWTToken

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    })
    
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

const login = async (req, res, next) => {


  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('All fields are required', 400));
    }

    const user = await User.findOne({
      email
    }).select('+password');

    if (!(user && await user.comparePassword(password))) {
      return next(new AppError('Email or password does not match or user does not exist', 400))
    }
    const token = await user.genreateJWTToken();
    user.password = undefined;
    res.cookie('token', token, cookieOptions)


    res.status(200).json({
      success: true,
      message: 'User loggedin successfully',
      user
    })


  } catch (error) {
    return next(new AppError(error.message, 500));
  }



};

const logout = (req, res , next) => {
  try {
    res.cookie('token', null, {
      secure: true,
      maxAge: 0,
      httpOnly: true
    })
  
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}; 


export {
  register,
  registerMentor,
  login,
  logout,
}