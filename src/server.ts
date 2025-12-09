import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';


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

// update single user
app.put('/users/:id', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`, [name, email, req?.params?.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'user updated successfully',
        data: result.rows[0],
      })
    };

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    })
  }
});


// delete single user
app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req?.params?.id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      })
    } else {
      res.status(200).json({
        success: true,
        message: 'user deleted successfully',
        data: result.rows,
      })
    }

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message,
    })
  }
});

// todos crud operations will be here
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);

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
});


// get all todos
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

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
});

// Get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

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
