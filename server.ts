import http from 'http';
import mongoose from 'mongoose';
import ConnectToMongo from './models/setup_mongoose';

import app from './app';
import { AppConfig } from './config/app_config';
import './models/models_importer.models';

async function gracefulShutdown(exitCode = 0) {
  await mongoose.disconnect();
  process.exit(exitCode);
}

// Listen for process termination signals
process.on('SIGTERM', async () => gracefulShutdown());
process.on('SIGINT', async () => gracefulShutdown());
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await gracefulShutdown(1);
});
process.on('uncaughtException', async error => {
  console.error('Unhandled Exception at:', error);
  await gracefulShutdown(1);
});

app.set('trust proxy', 1);

const server = http.createServer(app);

server.listen(AppConfig.PORT, async () => {
  await ConnectToMongo();
  console.log(`App is listening at http://localhost:${AppConfig.PORT}`);
});
