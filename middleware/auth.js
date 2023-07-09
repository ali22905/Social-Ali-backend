import jwt from "jsonwebtoken";


// this is a middleware function. you use it in the protected routes (user must be logged in) as middleware
// ex: app.post('/profile', verifyToken, profile)  // like that you made this '/profile' route protected
export const verifyToken = async (req, res, next) => {
  try {
    // the frontend will set this and we are grabbing it from here
    let token = req.header("Authorization");

    // if there is no token
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // if it starts with bearer (required) we will delete the bearer word from the string and get the vanila token
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};