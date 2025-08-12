import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cartProduct } from '../models/cartProduct.model.js';
import { User } from '../models/user.model.js';
import Stripe from '../utils/stripe.js';

// Simple in-memory cache to prevent duplicate verification requests
const verificationCache = new Map();

// Clean cache every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, timestamp] of verificationCache.entries()) {
        if (now - timestamp > 10 * 60 * 1000) { // 10 minutes
            verificationCache.delete(sessionId);
        }
    }
}, 10 * 60 * 1000);

const DiscountConverter = (price,discount)=>{
    // Calculate discount amount and subtract from price
    const discountAmount = (Number(price) * Number(discount)) / 100;
    return Number(price) - discountAmount;
}
export default DiscountConverter

const cashOnDelivery = asyncHandler(async (req,res)=>{
    try {
        const userId = req.user?._id
        const {listItems,totalAmount,deliveryAddress,subTotalAmount} = req.body

        const payload = listItems.map((item)=>{
            return {
                userId : userId,
                orderId : "ORD"+ new mongoose.Types.ObjectId(),
                productId: item?.productId?._id,
                productDetails:{
                    name: item?.productId?.name,
                    image: item?.productId?.image,
                },
                paymentId:"",
                paymentStatus:"cash on delivery",
                deliveryStatus:"confirmed", // COD orders are auto-confirmed
                deliveryAddress : deliveryAddress,
                subTotalAmount : subTotalAmount,
                totalAmount : totalAmount,
                invoiceReceipt:"",
                quantity: item?.quantity || 1,
                price: DiscountConverter(item?.productId?.price, item?.productId?.discount)
            }
        })

        const response = await Order.insertMany(payload)
        if(!response){
            return res.status(400).json(
                new apiResponse(400,"Order Not Created")
            )
        }

        const clearCart = await cartProduct.deleteMany({userId})
        if(!clearCart){
            return res.status(400).json(
                new apiResponse(400,"Cart Not Cleared")
            )
        }   

        const clearUserShopingCart = await User.updateOne({_id: userId},{$set: {shoppingCart:[]}})
        if(!clearUserShopingCart){
            return res.status(400).json(
                new apiResponse(400,"User Cart Not Cleared")
            )
        }

        return res.status(200).json(
            new apiResponse(200,"Order Created Successfully",response)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Internal Server Error",error)
        )
    }
})

const OnlinePaymentOrder = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json(new apiResponse(401, "Unauthorized: User not authenticated"));
        }

        const { listItems, totalAmount, deliveryAddress, subTotalAmount } = req.body;

        if (!listItems || !Array.isArray(listItems) || listItems.length === 0) {
            return res.status(400).json(new apiResponse(400, "Bad Request: listItems is required and must be a non-empty array"));
        }

        if (!deliveryAddress) {
            return res.status(400).json(new apiResponse(400, "Bad Request: deliveryAddress is required"));
        }

        // Create order records FIRST with "pending" status
        const orderPayload = listItems.map((item) => {
            return {
                userId: user._id,
                orderId: "ORD" + new mongoose.Types.ObjectId(),
                productId: item?.productId?._id,
                productDetails: {
                    name: item?.productId?.name,
                    image: item?.productId?.image,
                },
                paymentId: "", // Will be updated after payment
                paymentStatus: "pending", // Initial status
                deliveryStatus: "pending", // Initial delivery status
                deliveryAddress: deliveryAddress,
                subTotalAmount: subTotalAmount,
                totalAmount: totalAmount,
                invoiceReceipt: "",
                quantity: item?.quantity || 1,
                price: DiscountConverter(item?.productId?.price, item?.productId?.discount)
            }
        });

        // Save orders to database with pending status
        console.log('Creating pending orders in database...');
        const pendingOrders = await Order.insertMany(orderPayload);
        
        if (!pendingOrders || pendingOrders.length === 0) {
            return res.status(400).json(new apiResponse(400, "Failed to create pending orders"));
        }

        console.log('Pending orders created:', pendingOrders.length);

        // Clear cart immediately after creating orders
        console.log('Clearing cart for user:', user._id);
        const clearCart = await cartProduct.deleteMany({userId: user._id});
        const clearUserShopingCart = await User.updateOne(
            {_id: user._id}, 
            {$set: {shoppingCart: []}}
        );
        
        console.log('Cart cleared - Cart products deleted:', clearCart.deletedCount, 'User cart updated:', clearUserShopingCart.modifiedCount);

        // Prepare Stripe line items
        const line_items = listItems.map((item) => {
            const unit_amount = DiscountConverter(item?.productId?.price, item?.productId?.discount) * 100;
            if (isNaN(unit_amount)) {
                throw new Error("Invalid unit_amount calculated by DiscountConverter");
            }

            return {
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: item?.productId?.name,
                        images: item?.productId?.image,
                        metadata: {
                            productId: item?.productId?._id
                        }
                    },
                    unit_amount: unit_amount,
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item?.quantity,
            };
        });

        // Create Stripe checkout session
        const session = await Stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user?.email,
            metadata: {
                userId: String(user?._id),
                addressId: deliveryAddress,
                orderIds: pendingOrders.map(order => order._id).join(',') // Store order IDs
            },
            line_items: line_items,
            success_url: `${process.env.ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.ORIGIN}/cancel`,
        });

        return res.status(200).json({
            ...session,
            orders: pendingOrders // Return created orders
        });
    } catch (error) {
        console.error("Error in OnlinePaymentOrder:", error);
        return res.status(500).json(new apiResponse(500, "Internal Server Error", error.message));
    }
});

const getOrderProductItems = async ({lineItems,userId,addressId,paymentId,payment_status})=>{
    const productList = []

    console.log('Getting order product items for userId:', userId);
    console.log('Line items received:', lineItems.data.length);

    for (const item of lineItems.data) {
        try {
            console.log('Processing line item:', item.id);
            const product = await Stripe.products.retrieve(item.price.product);
            console.log('Product retrieved:', product.name);
            
            const payload = {
                userId: userId,
                orderId: "ORD" + new mongoose.Types.ObjectId(),
                productId: product?.metadata?.productId,
                productDetails: {
                    name: product?.name,
                    image: product?.images,
                },
                paymentId: paymentId,
                paymentStatus: payment_status,
                deliveryAddress: addressId,
                subTotalAmount: Number(item.amount_subtotal / 100),
                totalAmount: Number(item.amount_total / 100),
            }
            
            console.log('Created payload:', JSON.stringify(payload, null, 2));
            productList.push(payload);
            
        } catch (error) {
            console.error('Error processing line item:', error);
            throw error;
        }
    }
    
    console.log('Total products prepared:', productList.length);
    return productList;
}

async function webHookOrder(req, res) {
    console.log('Webhook called!');
    console.log('Headers:', req.headers);
    console.log('Body type:', typeof req.body);
    
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
    
    if (!webhookSecret) {
        console.error('WEBHOOK_SECRET_KEY not configured');
        return res.status(500).send('Webhook secret not configured');
    }
    
    let event;

    try {
        // For raw body, req.body should be a buffer
        const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);
        event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
        console.log('Webhook verified successfully');
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Event type:', event.type);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            try {
                const paymentIntent = event.data.object;
                console.log('Payment completed for session:', paymentIntent.id);
                
                const userId = paymentIntent.metadata.userId;
                const addressId = paymentIntent.metadata.addressId;
                const orderIds = paymentIntent.metadata.orderIds;

                console.log('Processing payment completion for user:', userId);
                console.log('Order IDs to update:', orderIds);

                if (!userId) {
                    console.error('No userId in metadata');
                    return res.status(400).send('Missing userId in metadata');
                }

                if (!orderIds) {
                    console.error('No orderIds in metadata');
                    return res.status(400).send('Missing orderIds in metadata');
                }

                // Update existing orders with payment information
                const orderIdArray = orderIds.split(',');
                console.log('Updating orders:', orderIdArray);

                const updateResult = await Order.updateMany(
                    { _id: { $in: orderIdArray } },
                    {
                        $set: {
                            paymentId: paymentIntent.payment_intent,
                            paymentStatus: "paid",
                            deliveryStatus: "confirmed", // Auto-confirm when payment is successful
                            invoiceReceipt: paymentIntent.id,
                            updatedAt: new Date()
                        }
                    }
                );

                console.log('Orders updated:', updateResult.modifiedCount);

                if (updateResult.modifiedCount === 0) {
                    console.error('No orders were updated');
                    return res.status(400).send('Failed to update orders');
                }

                console.log('Payment processing completed successfully');
                // Note: Cart was already cleared when orders were created

            } catch (error) {
                console.error('Error processing checkout.session.completed:', error);
                return res.status(500).send(`Webhook processing failed: ${error.message}`);
            }
            break;

        case 'checkout.session.expired':
            try {
                const expiredSession = event.data.object;
                const orderIds = expiredSession.metadata.orderIds;
                
                if (orderIds) {
                    const orderIdArray = orderIds.split(',');
                    console.log('Marking orders as cancelled:', orderIdArray);
                    
                    // Update orders to cancelled status
                    await Order.updateMany(
                        { _id: { $in: orderIdArray } },
                        {
                            $set: {
                                paymentStatus: "cancelled",
                                updatedAt: new Date()
                            }
                        }
                    );
                }
            } catch (error) {
                console.error('Error processing checkout.session.expired:', error);
            }
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    console.log('Webhook processed successfully');
    res.status(200).send('Webhook received');
}

// Manual order verification endpoint (fallback for webhook issues)
const verifyPaymentAndCreateOrder = asyncHandler(async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user?._id;
        
        if (!sessionId) {
            return res.status(400).json(new apiResponse(400, "Session ID required"));
        }
        
        // Check if this session was recently processed
        const cacheKey = `${sessionId}-${userId}`;
        const lastProcessed = verificationCache.get(cacheKey);
        const now = Date.now();
        
        if (lastProcessed && (now - lastProcessed) < 30000) { // 30 seconds cooldown
            console.log('Session recently processed, skipping:', sessionId);
            return res.status(200).json(new apiResponse(200, "Session recently processed"));
        }
        
        // Mark as being processed
        verificationCache.set(cacheKey, now);
        
        console.log('Verifying payment for session:', sessionId, 'by user:', userId);
        
        // Retrieve the session from Stripe
        const session = await Stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            console.log('Payment not completed, status:', session.payment_status);
            return res.status(400).json(new apiResponse(400, "Payment not completed"));
        }
        
        const orderIds = session.metadata.orderIds;
        if (!orderIds) {
            console.log('No order IDs found in session metadata');
            return res.status(400).json(new apiResponse(400, "No order IDs found in session"));
        }
        
        const orderIdArray = orderIds.split(',');
        console.log('Checking orders:', orderIdArray);
        
        // Check current status of orders
        const existingOrders = await Order.find({ _id: { $in: orderIdArray } });
        
        if (existingOrders.length === 0) {
            console.log('No orders found with given IDs');
            return res.status(404).json(new apiResponse(404, "Orders not found"));
        }
        
        // Check if all orders are already marked as paid
        const paidOrders = existingOrders.filter(order => order.paymentStatus === "paid");
        
        if (paidOrders.length === orderIdArray.length) {
            console.log('All orders already marked as paid');
            return res.status(200).json(new apiResponse(200, "Orders already processed", paidOrders));
        }
        
        // Update only pending orders to paid status
        const pendingOrderIds = existingOrders
            .filter(order => order.paymentStatus === "pending")
            .map(order => order._id);
            
        if (pendingOrderIds.length === 0) {
            console.log('No pending orders to update');
            return res.status(200).json(new apiResponse(200, "No pending orders to update", existingOrders));
        }
        
        console.log('Updating pending orders to paid:', pendingOrderIds);
        
        // Update orders with payment information
        const updateResult = await Order.updateMany(
            { _id: { $in: pendingOrderIds } },
            {
                $set: {
                    paymentId: session.payment_intent,
                    paymentStatus: "paid",
                    invoiceReceipt: session.id,
                    updatedAt: new Date()
                }
            }
        );
        
        console.log('Orders updated:', updateResult.modifiedCount);
        
        if (updateResult.modifiedCount > 0) {
            // Clear cart only if we actually updated some orders
            const clearUserResult = await User.updateOne(
                { _id: session.metadata.userId || userId }, 
                { $set: { shoppingCart: [] } }
            );
            const clearCartResult = await cartProduct.deleteMany({ userId: session.metadata.userId || userId });
            
            console.log('Cart cleared - User:', clearUserResult.modifiedCount, 'Cart products:', clearCartResult.deletedCount);
        }
        
        const finalOrders = await Order.find({ _id: { $in: orderIdArray } });
        
        return res.status(200).json(new apiResponse(200, "Payment verified successfully", {
            updated: updateResult.modifiedCount,
            orders: finalOrders
        }));
        
    } catch (error) {
        console.error('Error in verifyPaymentAndCreateOrder:', error);
        return res.status(500).json(new apiResponse(500, "Error verifying payment", error.message));
    }
});

// Get user orders
const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        
        const orders = await Order.find({ userId })
            .populate('deliveryAddress')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(new apiResponse(200, "Orders retrieved successfully", orders));
        
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        return res.status(500).json(new apiResponse(500, "Error retrieving orders", error.message));
    }
});

// Get all orders with filtering and pagination
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            paymentStatus, 
            deliveryStatus,
            search,
            startDate,
            endDate 
        } = req.body;

        // Build filter object
        const filter = {};
        
        if (status) filter.deliveryStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
        
        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        
        // Search filter
        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'productDetails.name': { $regex: search, $options: 'i' } },
                { trackingNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        // Get orders with populated data
        const orders = await Order.find(filter)
            .populate('userId', 'name email phone')
            .populate('deliveryAddress')
            .populate('productId', 'name image price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        // Get statistics
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: "$deliveryStatus",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        return res.status(200).json(new apiResponse(200, "Orders retrieved successfully", {
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalOrders,
                limit: parseInt(limit)
            },
            stats
        }));

    } catch (error) {
        console.error('Error in getAllOrders:', error);
        return res.status(500).json(new apiResponse(500, "Error retrieving orders", error.message));
    }
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { orderId, deliveryStatus, trackingNumber, deliveryNotes } = req.body;

        if (!orderId || !deliveryStatus) {
            return res.status(400).json(new apiResponse(400, "Order ID and delivery status are required"));
        }

        // Validate delivery status
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(deliveryStatus)) {
            return res.status(400).json(new apiResponse(400, "Invalid delivery status"));
        }

        const updateData = {
            deliveryStatus,
            updatedAt: new Date()
        };

        // Set delivery date if status is delivered
        if (deliveryStatus === "delivered") {
            updateData.deliveryDate = new Date();
        }

        // Add optional fields
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (deliveryNotes) updateData.deliveryNotes = deliveryNotes;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('userId', 'name email phone')
         .populate('deliveryAddress')
         .populate('productId', 'name image price');

        if (!updatedOrder) {
            return res.status(404).json(new apiResponse(404, "Order not found"));
        }

        return res.status(200).json(new apiResponse(200, "Order status updated successfully", updatedOrder));

    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        return res.status(500).json(new apiResponse(500, "Error updating order status", error.message));
    }
});

// Get order statistics
const getOrderStats = asyncHandler(async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ["$deliveryStatus", "pending"] }, 1, 0] }
                    },
                    confirmedOrders: {
                        $sum: { $cond: [{ $eq: ["$deliveryStatus", "confirmed"] }, 1, 0] }
                    },
                    shippedOrders: {
                        $sum: { $cond: [{ $eq: ["$deliveryStatus", "shipped"] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ["$deliveryStatus", "cancelled"] }, 1, 0] }
                    }
                }
            }
        ]);

        const monthlyStats = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 }
        ]);

        return res.status(200).json(new apiResponse(200, "Order statistics retrieved successfully", {
            overview: stats[0] || {},
            monthlyStats
        }));

    } catch (error) {
        console.error('Error in getOrderStats:', error);
        return res.status(500).json(new apiResponse(500, "Error retrieving order statistics", error.message));
    }
});

const getCustomerOrders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { search, deliveryStatus } = req.body;

        if (!userId) {
            return res.status(401).json(new apiResponse(401, "User not authenticated"));
        }

        // Build filter query
        const filterQuery = { userId };

        // Add delivery status filter if provided
        if (deliveryStatus && deliveryStatus.trim()) {
            filterQuery.deliveryStatus = deliveryStatus.trim();
        }

        // Build search query for order ID or product name
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            filterQuery.$or = [
                { orderId: searchRegex },
                { 'productDetails.name': searchRegex }
            ];
        }

        // Fetch orders with populated user and address information
        const orders = await Order.find(filterQuery)
            .populate({
                path: 'userId',
                select: 'name email'
            })
            .populate({
                path: 'deliveryAddress',
                select: 'address_line city state pincode country mobile'
            })
            .sort({ createdAt: -1 }); // Most recent first

        // Format orders for customer view
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderId: order.orderId,
            productDetails: order.productDetails,
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            deliveryDate: order.deliveryDate,
            deliveryNotes: order.deliveryNotes,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            address: order.deliveryAddress
        }));

        return res.status(200).json(new apiResponse(200, "Customer orders retrieved successfully", {
            orders: formattedOrders,
            total: formattedOrders.length
        }));

    } catch (error) {
        console.error('Error in getCustomerOrders:', error);
        return res.status(500).json(new apiResponse(500, "Error retrieving customer orders", error.message));
    }
});

export { cashOnDelivery , OnlinePaymentOrder , webHookOrder, verifyPaymentAndCreateOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderStats, getCustomerOrders}