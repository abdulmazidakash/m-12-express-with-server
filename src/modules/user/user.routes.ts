import express, { Request, Response } from 'express';
import { pool } from '../../config/db';
import { userControllers } from './user.controller';

const router = express.Router();

// app.use('/users', userRoutes);
// routes -> controller -> service

//create user
router.post('/', userControllers.createUser);

// get all users
router.get('/', userControllers.getUser);

// get single user
router.get('/:id', userControllers.getSingleUser);

// update user
router.put('/:id', userControllers.updateUser);

// delete user
router.delete('/:id', userControllers.deleteUser)

export const userRoutes = router;