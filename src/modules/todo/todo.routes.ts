import express from 'express';
import { todoControllers } from './todo.controller';

const router = express.Router();

// create todo
router.post('/', todoControllers.createToDo);

// get all todos
router.get('/', todoControllers.getTodo);

// get single todo
router.get('/:id', todoControllers.getSingleTodo)

// update todo
router.put('/:Id', todoControllers.updateTodo);

// delete todo
router.delete('/:id', todoControllers.deleteToDo);

export const todoRoutes = router;