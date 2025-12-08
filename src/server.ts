import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path'

dotenv.config({path: path.join(process.cwd(), ".env")});

const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STR
})

//parser
app.use(express.json());

// when use form data
// app.use(express.urlencoded());

const initDB = async()=>{
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_data DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `)
};

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Next level Developer')

});

app.post('/users', async(req: Request, res: Response)=>{
  const { name, email } = req.body;
  try{
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    console.log(result);
    res.send({message: 'user created successfully'})
  }catch(err: any){
    res.status(500).json({
    success: false,
    message: err?.message,
  })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
