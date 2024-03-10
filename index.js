import "express-async-errors";

import express from "express"
const app = express();
import morgan from "morgan";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import cloudinary from 'cloudinary';
import {StatusCodes} from "http-status-codes";

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// cookie parser
import cookieParser from "cookie-parser";

// routes
import authRouter from './routes/authRoutes.js';
import postsRoutes from "./routes/postsRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"

// middlewares
import errorHandler from "./middlewares/errorHandler.js";
import authenticateUser from "./middlewares/authenticateUser.js";

// consfigs
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './public')));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(errorHandler);
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/users", authenticateUser, usersRoutes );
app.use("/api/posts", authenticateUser, postsRoutes);

// not found error
// not found error
app.use('*', (req, res) => {
  res.status(404).json({msg: "not found"});
});

// unexpected err
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong"
  res.status(statusCode).json({msg});
})


const port = process.env.PORT || 3000;

try {
    await mongoose.connect(process.env.MONGO_DB);
    app.listen(port, () => {
      console.log(`server running on PORT ${port}....`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  };
