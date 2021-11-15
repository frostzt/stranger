import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';

import ExpressApplication from './bootstrapper';

// Controllers
import UserController from './api/user/user.controller';
// import logger from './lib/logger';

// Load the env vars based on the current NODE_ENV
dotenv.config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` });

const PORT = process.env.PORT || 5000;

const app = new ExpressApplication(
  PORT,
  [express.json({ limit: '10kb' }), express.urlencoded({ extended: true, limit: '10kb' })],
  [UserController],
);

// Start the server
app.start();

// Shutdown on unhandled Rejection
// process.on('unhandledRejection', (err: Error) => {
//   logger.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// Handle SIGTERM
// process.on('SIGTERM', () => {
//   logger.warn('SIGTERM RECIEVED!');
//   server.close(() => {
//     logger.warn('Process terminated');
//   });
// });
