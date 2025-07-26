import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cartProduct } from '../models/cartProduct.model.js';
import { User } from '../models/user.model.js';
import Stripe from '../utils/stripe.js';

const DiscountConverter = (price,discount)=>{
    return (Number(price)*Number(discount))/100 + price
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
                deliveryAddress : deliveryAddress,
                subTotalAmount : subTotalAmount,
                totalAmount : totalAmount,
                invoiceReceipt:""
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

        const clearUserShopingCart = await User.updateOne({userId},{shoppingCart:[]})
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

        const session = await Stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user?.email,
            metadata: {
                userId: String(user?._id),
                addressId: deliveryAddress
            },
            line_items: line_items,
            success_url: `${process.env.ORIGIN}/success`,
            cancel_url: `${process.env.ORIGIN}/cancel`,
        });

        return res.status(200).json(session);
    } catch (error) {
        console.error("Error in OnlinePaymentOrder:", error);
        return res.status(500).json(new apiResponse(500, "Internal Server Error", error.message));
    }
});

const getOrderProductItems = async ({lineItems,userId,addressId,paymentId,payment_status})=>{
    const productList = []

    for (const item of lineItems.data) {
        const product = await Stripe.products.retrieve(item.price.product)
        const payload =  {
                userId : userId,
                orderId : "ORD"+ new mongoose.Types.ObjectId(),
                productId: product?.metadata?.productId,
                productDetails:{
                    name: product?.name,
                    image: product?.images,
                },
                paymentId:paymentId,
                paymentStatus:payment_status,
                deliveryAddress : addressId,
                subTotalAmount : Number(item.amount_subtotal / 100),
                totalAmount : Number(item.amount_total / 100),
            }
            productList.push(payload)
    }
    return productList
}

async function webHookOrder(req,res){
    const event = req.body;
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
        const paymentIntent = event.data.object;
        const lineItems = await Stripe.checkout.sessions.listLineItems(paymentIntent.id)
        const userId = paymentIntent.metadata.userId;
        const addressId = paymentIntent.metadata.addressId;

        const orderProduct = await getOrderProductItems({
            lineItems : lineItems,
            userId : userId,
            addressId : paymentIntent.metadata.addressId,
            paymentId  : paymentIntent.payment_intent,
            payment_status : paymentIntent.payment_status,
        })

        const createdOrder = await Order.insertMany(orderProduct)
        if(!createdOrder){
            return res.status(400).json(
                new apiResponse(400,"Order Not Created")
            )
        }

        if(Boolean(createdOrder[0])){
            const clearUserShopingCart = await User.updateOne({userId},{shoppingCart:[]})
            if(!clearUserShopingCart){
                return res.status(400).json(
                    new apiResponse(400,"User Cart Not Cleared")
                )
            }
            const deleteFromCartProduct = await cartProduct.deleteMany({userId})
            if(!deleteFromCartProduct){
                return res.status(400).json(
                    new apiResponse(400,"Cart Product Not Deleted")
                )
            }
        }
        
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
}

export { cashOnDelivery , OnlinePaymentOrder , webHookOrder}