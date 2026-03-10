const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "expenses_db"
});

db.connect((err) => {
  if (err) console.error(err);
  else console.log("Connected to MySQL database");
});


/* USER REGISTER */

app.post("/register", (req, res) => {

  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) res.send(err);
      else res.send("User registered");
    }
  );

});


/* USER LOGIN */

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {

      if (err) res.send(err);

      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }

    }
  );

});


/* EXPENSE APIs */

app.get("/expenses", (req, res) => {
  db.query("SELECT * FROM expenses", (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});


app.post("/expenses", (req, res) => {

  const { title, amount, category, date } = req.body;

  db.query(
    "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)",
    [title, amount, category, date],
    (err, result) => {
      if (err) res.send(err);
      else res.send("Expense added");
    }
  );

});


app.put("/expenses/:id", (req, res) => {

  const id = req.params.id;
  const { title, amount, category, date } = req.body;

  db.query(
    "UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=?",
    [title, amount, category, date, id],
    (err, result) => {
      if (err) res.send(err);
      else res.send("Expense updated");
    }
  );

});


app.delete("/expenses/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM expenses WHERE id=?",
    [id],
    (err, result) => {
      if (err) res.send(err);
      else res.send("Expense deleted");
    }
  );

});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});