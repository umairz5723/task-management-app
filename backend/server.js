const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('./dbconnect.js'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json()); // Parse JSON bodies

//------------------- GET ROUTES ----------------------------------------//

app.get('/api/tasks', async (req, res) => {
  const { urgency, progress } = req.query;

  // Construct the base query
  let query = 'SELECT * FROM tasks WHERE 1=1';  // The `1=1` ensures that we can always append AND conditions

  // Dynamically append conditions if filters are provided
  if (urgency) {
    query += ` AND urgency = $1`;
  }

  if (progress) {
    query += progress === 'Completed' ? ` AND completed = true` : ` AND completed = false`;
  }

  try {
    // Execute the query with the correct parameter for urgency if it's provided
    const result = await pool.query(query, urgency ? [urgency] : []);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/searchtask', async(req,res) => {
    const { taskName } = req.query;

    if (!taskName) {
      return res.status(400).json({error: 'Task Name is required for searching'});
    }

    try {
      const query = `SELECT * FROM tasks WHERE title ILIKE $1`;
      const values = [`%${taskName}%`]; 

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No tasks found' });
      }
      res.json(result.rows);
    } catch(error){
      console.log(error);
      res.status(500).json({error: "Internal Server Error"});
    }
});

//------------------- POST ROUTES ---------------------------------------//

app.post('/api/tasks', async (req, res) => {
  const { title, description, urgency } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing either title or description" });
  }

  const newTask = {
    id: uuidv4(), // Generate a unique ID
    title,
    description,
    urgency,
    date: new Date().toISOString(), // Use current date
  };

  try {
    // Insert the new task into the database
    const query = `
      INSERT INTO tasks (id, title, description, urgency, date, completed)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [newTask.id, newTask.title, newTask.description, newTask.urgency, newTask.date, false];

    const result = await pool.query(query, values);
    console.log("Added to DB", result.rows[0]); // Log the added task
    res.status(201).json(result.rows[0]); // Send the added task back in the response
  } catch (error) {
    console.error('Error adding task', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// -------------------------- PUT ROUTES -------------------------------
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, urgency } = req.body;

  // Validate input
  if (!title || !description || !urgency) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  try {
      // Check if task exists
      const checkTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (checkTask.rows.length === 0) {
          return res.status(404).json({ error: "Task not found" });
      }

      // Update the task
      const query = `
          UPDATE tasks 
          SET title = $1, 
              description = $2, 
              urgency = $3
          WHERE id = $4
          RETURNING *`;
      
      const values = [title, description, urgency, id];
      const result = await pool.query(query, values);

      console.log("Updated task:", result.rows[0]); // Log the updated task
      res.json(result.rows[0]); // Send the updated task back in the response
  } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
