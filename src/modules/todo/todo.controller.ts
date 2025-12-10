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


export const todoControllers = {
  createToDo,
  getTodo,
  getSingleTodo,
}
