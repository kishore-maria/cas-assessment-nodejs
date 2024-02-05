const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

const secretKey = "Cas-assessment";

const user = require("./userDetails");

let todoList = [];

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! This is the backend application developed for CAS assessment.");
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (userName === user.userName && password === user.password) {
    let userData = {
      userId: 1,
      userName,
    };

    generateJWT = (data) => {
      // Sign the token with the secret key and include the data
      const token = jwt.sign(data, secretKey); // You can adjust the expiration time as needed
      return token;
    };

    // Generate a JWT using the userData
    const generatedToken = generateJWT(userData);

    userData.token = generatedToken;
    const response = {
      status: "success",
      message: "Login successful",
      data: userData,
    };
    return res.status(200).send(response);
  }
  const response = {
    status: "error",
    message: "Invalid credentials",
  };
  return res.status(400).send(response);
});

app.get("/list", auth, (req, res) => {
  const response = {
    status: "success",
    message: "Todo list",
    data: todoList,
  };
  return res.status(200).send(response);
});

app.post("/add", auth, (req, res) => {
  const todo = req.body;
  const newTodo = {
    title: todo.title,
    status: todo.status,
    id: new Date().getTime(),
  };
  todoList.push(newTodo);
  const response = {
    status: "success",
    message: "Todo added successfully",
  };
  return res.status(200).send(response);
});

app.patch("/update", auth, (req, res) => {
  const todo = req.body;
  todoList = todoList.map((val) => {
    if (todo.id === val.id) {
      (val.title = todo.title), (val.status = todo.status);
    }
    return val;
  });
  const response = {
    status: "success",
    message: "Todo updated successfully",
  };
  return res.status(200).send(response);
});

app.delete("/remove", auth, (req, res) => {
  const todo = req.body;
  todoList = todoList.filter((val) => {
    if (todo.id !== val.id) {
      return val;
    }
  });
  const response = {
    status: "success",
    message: "Todo removed successfully",
  };
  return res.status(200).send(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
