import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { AppConfig } from '../config/app_config';

async function ConnectToMongo() {
  try {
    const mongoDB = AppConfig.MONGO_URI ? AppConfig.MONGO_URI : '';
    const newMongooseConnection = await mongoose.connect(mongoDB);
    const db = newMongooseConnection.connection;
    console.log('Connected to mongo');
    db.on('error', (err: any) => {
      console.error.bind(console, 'MongoDB connection error:');
      console.log(err);
    });
  } catch (err) {
    console.log('Error while connecting to mongo: ', AppConfig.MONGO_URI);
    console.log('Error while connecting to mongo: ', err);
    throw err;
  }
}

export default ConnectToMongo;
