import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send("Invalid token");
    return;
  }

  try {
    const userData = jwt.verify(token, "MY_SUPER_SECRET");
  } catch (error) {}
};
