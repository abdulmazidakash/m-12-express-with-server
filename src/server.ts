import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';


const app = express();


//parser
app.use(express.json());

// when use form data
// app.use(express.urlencoded());


// initialize database tables
initDB();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World! Next level Developer')

});

// user crud
app.use('/users',userRoutes);

// todos crud operations will be here
app.use('/todos', todoRoutes);

// Update todo
app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});


// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'route not found',
    path: req.path,
  })
});


app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
});
