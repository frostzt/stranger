import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors'; // wrapper for async errors
import 'reflect-metadata'; // for store decorator metadata
import AuthController from './api/auth/auth.controller';
import UserController from './api/user/user.controller';
import ExpressApplication from './bootstrapper';

// Load the env vars based on the current NODE_ENV
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` });
} else {
  dotenv.config();
}

const PORT = process.env.PORT || 5000;

const app = new ExpressApplication(
  PORT,
  [express.json({ limit: '10kb' }), express.urlencoded({ extended: true, limit: '10kb' }), cookieParser()],
  [UserController, AuthController],
);

// Start the server
app.start();

app.io.on('connection', (socket) => {
  console.log(socket);
});

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

export default app;
