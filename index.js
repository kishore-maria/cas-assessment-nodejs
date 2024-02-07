const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const cors = require('cors')

const secretKey = "Cas-assessment";

let userList = [];

let todoList = [];

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello! This is the backend application developed for CAS assessment.");
});

app.post("/signup", (req, res) => {
  const { userName, password } = req.body;
  let user = null;
  userList.forEach(val => {
    if (val.userName === userName) {
      user = val;
    }
  });

  if (user) {
    const response = {
      status: "success",
      message: "User already exist"
    };
    return res.status(400).send(response);
  }
  const data = {
      userId: userList.length + 1,
      userName: userName,
      password: password
  };
  userList.push(data);
  const response = {
    status: "success",
    message: "Signup successful"
  };
  return res.status(200).send(response);
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  let user = null;
  userList.forEach(val => {
    if (val.userName === userName && val.password === password) {
      user = val;
    }
  });
  if (user) {
    let userData = {
      userId: user.userId,
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

  // const list = todoList.filter(val => {
  //   if (val.userId === req.user.userId) {
  //     return val;
  //   }
  // });
  let list;
  for (let i = 0; i < todoList.length; i++) {
    const element = todoList[i];
    if (element.userId === req.user.userId) {
      list = element;
      break;
    }
  }
  const response = {
    status: "success",
    message: "Todo list",
    data: list,
  };
  return res.status(200).send(response);
});

app.post("/add", auth, (req, res) => {
  const todo = req.body;
  let isExist = false;
  for (let i = 0; i < todoList.length; i++) {
    const element = todoList[i];
    if (element.userId === req.user.userId) {
      element.list = todo;
      isExist = true;
      break;
    }
  }

  if (!isExist) {
    todoList.push(
      {
        userId: req.user.userId,
        list: todo
      }
    );
  }
  // const todo = req.body;
  // for (let i = 0; i < todoList.length; i++) {
  //   const element = todoList[i];
  //   if (element.userId === req.user.userId) {
  //     element.list = todo;
  //     break;
  //   }
  // }
  // let isExist = false;
  // for (let i = 0; i < todoList.length; i++) {
  //   const element = todoList[i];
  //   if (element.userId === req.user.userId) {
  //     element.list = todo;
  //     isExist = true;
  //     break;
  //   }
  // }

  // if (!isExist) {
  //   todoList.push(
  //     {
  //       userId: req.user.userId,
  //       list: todo
  //     }
  //   );
  // }
  const newTodo = {
    title: todo.title,
    status: todo.status,
    id: todoList.length + 1,
    userId: req.user.userId
  };
  // todoList.push(newTodo);
  const response = {
    status: "success",
    message: "Todo added successfully",
  };
  return res.status(200).send(response);
});

app.post("/update", auth, (req, res) => {
  const todo = req.body;
  // todoList = todoList.map((val) => {
  //   if (todo.id === val.id) {
  //     (val.title = todo.title), (val.status = todo.status);
  //   }
  //   return val;
  // });
  for (let i = 0; i < todoList.length; i++) {
    const element = todoList[i];
    if (element.userId === req.user.userId) {
      element.list = todo;
      break;
    }
  }
  const response = {
    status: "success",
    message: "Todo updated successfully",
  };
  return res.status(200).send(response);
});

app.post("/remove", auth, (req, res) => {
  const todo = req.body;
  // const id = req.body.id;
  // todoList = todoList.filter((val) => {
  //   if (id !== val.id) {
  //     return val;
  //   }
  // });
  for (let i = 0; i < todoList.length; i++) {
    const element = todoList[i];
    if (element.userId === req.user.userId) {
      element.list = todo;
      break;
    }
  }
  const response = {
    status: "success",
    message: "Todo removed successfully",
  };
  return res.status(200).send(response);
});

// app.delete("/clearList", auth, (req, res) => {
//   const userId = req.user.userId;
//   todoList = todoList.filter((val) => {
//     if (userId !== val.userId) {
//       return val;
//     }
//   });
//   const response = {
//     status: "success",
//     message: "List cleared",
//   };
//   return res.status(200).send(response);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
