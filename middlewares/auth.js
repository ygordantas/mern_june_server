import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send("Invalid token");
    return;
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { ...userData };
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
    return;
  }
};

export default checkAuth;
