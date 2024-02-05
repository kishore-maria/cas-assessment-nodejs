const jwt = require("jsonwebtoken");
const user = require("./userDetails");
const secretKey = "Cas-assessment";

const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).send("Not authorized");
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, secretKey);
  if (data.id === user.id && data.userName === user.userName) {
    req.user = user;
    req.token = token;
    next();
    return;
  }
  res.status(401).send("Not authorized");
};

module.exports = auth;
