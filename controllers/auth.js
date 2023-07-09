import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER USER */
export const register = async(req, res) => {
  try {
    // destructuring the user data coming from frontend
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // encrypt password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // add a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



/* LOGING IN */ 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password /* normal text */, user.password /* hashed password from DB */);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password. " });

    // make a token for the user with id "user._id" and with jwt secret key from the .env file
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // delete the password from the user who you will respond with to the fronend
    delete user.password;
    // respond with the token and the user related to this token (logged in)
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

