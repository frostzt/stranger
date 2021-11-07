import express from 'express';
import 'reflect-metadata';

import ExpressApplication from './bootstrapper';

// Controllers
import UserController from './api/user/user.controller';

const PORT = process.env.PORT || 5000;

const app = new ExpressApplication(
  PORT,
  [express.json({ limit: '10kb' }), express.urlencoded({ extended: true, limit: '10kb' })],
  [UserController],
);

// Start the server
app.start();
