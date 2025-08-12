import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))

// Special handling for Stripe webhook (needs raw body) - MUST come before express.json()
app.use('/api/v1/order/webhook', express.raw({type: 'application/json'}));

app.use(express.json({limit: '16kb',}));
app.use(express.urlencoded({extended:true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))
  
// Routers
import userRouter from './routes/user.route.js'
import imageRouter from './routes/image.route.js'
import categoryRoute from './routes/category.route.js'
import subCategoryRoute from './routes/subCategory.route.js'
import productRoute from './routes/product.route.js'
import cartProductRoute from './routes/cartProduct.route.js'
import addressRoute from './routes/address.route.js';
import orderRouter from './routes/order.route.js';

app.use("/api/v1/users",userRouter)
app.use("/api/v1",imageRouter)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/sub-category",subCategoryRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/cart",cartProductRoute)
app.use("/api/v1/address",addressRoute)
app.use("/api/v1/order",orderRouter)

export default app;