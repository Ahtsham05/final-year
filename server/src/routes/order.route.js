import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { cashOnDelivery, OnlinePaymentOrder, webHookOrder, verifyPaymentAndCreateOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderStats, getCustomerOrders } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/create',auth,cashOnDelivery)
orderRouter.post('/create-payment-order',auth,OnlinePaymentOrder)
orderRouter.post('/webhook',webHookOrder)
orderRouter.post('/verify-payment',auth,verifyPaymentAndCreateOrder)
orderRouter.get('/user-orders',auth,getUserOrders)

// Customer order tracking routes
orderRouter.post('/customer-orders',auth,getCustomerOrders)

// Admin order management routes
orderRouter.post('/all-orders',auth,getAllOrders)
orderRouter.put('/update-status',auth,updateOrderStatus)
orderRouter.get('/stats',auth,getOrderStats)

// Test route to verify webhook endpoint
orderRouter.get('/webhook-test', (req, res) => {
    res.json({ message: 'Webhook endpoint is accessible', timestamp: new Date().toISOString() });
});

export default orderRouter;