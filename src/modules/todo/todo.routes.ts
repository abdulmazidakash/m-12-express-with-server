import express from 'express';
import { todoControllers } from './todo.controller';

const router = express.Router();

// create todo
router.post('/', todoControllers.createToDo);

// get all todos
router.get('/', todoControllers.getTodo);

// get single todo
router.get('/:id', todoControllers.getSingleTodo)

export const todoRoutes = router;