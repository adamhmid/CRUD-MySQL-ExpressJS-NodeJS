const path = require("path");
const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();

//set views file
app.set("views", path.join(__dirname, "views"));

//set view engine
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud-men",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySql Connected...");
});

app.get("/", (req, res) => {
  let sql = "SELECT * FROM users";
  let query = db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("user_index", {
      title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
      users: rows,
    });
  });
});

app.get("/add", (req, res) => {
  res.render("user_add", {
    title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
  });
});

app.post("/save", (req, res) => {
  let data = {
    name: req.body.name,
    email: req.body.email,
    phone_no: req.body.phone_no,
  };
  let sql = "INSERT INTO users SET ?";
  let query = db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `Select * from users where id = ${userId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("user_edit", {
      title: "CRUD Operation using NodeJS / ExpressJS / MySQL",
      user: result[0],
    });
  });
});

app.post("/update", (req, res) => {
  const userId = req.body.id;
  let sql =
    "update users SET name='" +
    req.body.name +
    "',  email='" +
    req.body.email +
    "',  phone_no='" +
    req.body.phone_no +
    "' where id =" +
    userId;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/delete/:userId", (req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from users where id = ${userId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Server Listening
app.listen(3000, () => {
  console.log("Server is running at port http://localhost:3000");
});
