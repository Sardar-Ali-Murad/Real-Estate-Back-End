import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import morgan from 'morgan';
import cors from "cors"

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fileUpload from "express-fileupload"
import Stripe from 'stripe';





import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
// hello
// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';
import Property from "./routes/PropertyRoute.js"
import Orders from "./routes/OrderRoute.js"
import NewsLetter from "./routes/NewsLetterRoute.js"
import StripeRoute from "./routes/stripeRoute.js"
import googleLogin from "./routes/GoogleRoute.js"


// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
// app.use(express.static(path.resolve(__dirname, './front/.next')));

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000',"https://akbuilderpk.onrender.com"]
}))


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/property', Property);
app.use('/api/v1/NewsLetter', NewsLetter);
app.use('/api/v1/Orders', authenticateUser,Orders);
app.use("/api/v1",StripeRoute)
app.use("/api/v1",googleLogin)



// only when ready to deploy
// app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, './client/.next', 'index.html'));
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
