import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';
import { authRoutes } from './modules/auth/auth.routes';

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

// user crud operations here
app.use('/users',userRoutes);

// todos crud operations here
app.use('/todos', todoRoutes);

// user authentication routes
app.use('/auth', authRoutes);

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
