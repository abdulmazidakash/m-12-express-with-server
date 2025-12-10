import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createToDo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.createToDo({user_id, title});

    res.status(201).json({
      success: true,
      message: 'todo created successfully',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
    })
  }
};

const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getToDo();

    res.status(200).json({
      success: true,
      message: 'todos fetched successfully',
      data: result.rows,
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    })
  }
};

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getSingleTodo(req.params.id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateToDo(title, completed, req.params.id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

const deleteToDo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.deleteToDo(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};


export const todoControllers = {
  createToDo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteToDo
};

