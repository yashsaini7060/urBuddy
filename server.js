import app from './app.js'
import connectionToDb from './config/dbConnection.js';
import cloudinary from 'cloudinary'

const PORT = process.env.PORT || 5000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})



app.listen(PORT, async () => {
  await connectionToDb();
  console.log(`Server is running on http://localhost:${PORT} 🚀🚀🚀`);
});