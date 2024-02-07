const jwt = require("jsonwebtoken");
const secretKey = "Cas-assessment";

const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).send("Not authorized");
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, secretKey);
  if (data) {
    req.user = data;
    req.token = token;
    next();
    return;
  }
  res.status(401).send("Not authorized");
};

module.exports = auth;
