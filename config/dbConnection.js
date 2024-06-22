import mongoose from 'mongoose';

mongoose.set('strictQuery', false); //IT will ignore if and query goes wrong it wont crash the server

const connectionToDb = async() => {
  try {
    const {connection} = await mongoose.connect(process.env.MONGO_URI || `mongodb://127.0.0.1:27017/pwbuddy`);

    if(connection){
      console.log(`Connection to MongoDB: ${connection.host} 🚀🚀🚀`)
    }

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectionToDb;
