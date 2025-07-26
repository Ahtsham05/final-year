import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { cashOnDelivery, OnlinePaymentOrder, webHookOrder } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/create',auth,cashOnDelivery)
orderRouter.post('/create-payment-order',auth,OnlinePaymentOrder)
orderRouter.post('/webhook',webHookOrder)

export default orderRouter;