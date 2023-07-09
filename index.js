// we are using import not require because we setted "type" : "module" in the package.json file
// modules
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer"
import helmet from "helmet";
import morgan from "morgan";
// set the pathes when config dirs
import path from "path";
import { fileURLToPath } from "url";

// controllers and routes
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
// routes
import authRoutes from "./routes/auth.js"
import userRoutes from './routes/users.js'
import postRoutes from './routes/post.js'
import { verifyToken } from "./middleware/auth.js";
import { users, posts } from "./data/index.js"
import User from "./models/User.js";
import Post from "./models/Post.js";



/* CONFIGRATIONS (functions that run between diffrent requests) */ 

// madetory when using modules
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
dotenv.config()
const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))





/* FILE STORAGE */
// when someone uploads a file it will be saved in this destination "public/assets"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets" /* saving destination */);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });




/* ROUTES */ 
// when going to this route it will upload the photo (middleware) then make the register function
app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// routes that dosn't need photos
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)





/* mongoose setup */ 
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD ONE TIME */ 
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
