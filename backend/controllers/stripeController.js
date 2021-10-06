import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET;

const stripe = new Stripe(stripeSecret);
import asyncHandler from 'express-async-handler';

// @desc post Payment
// @route POST /api/stripe/charge
// @access Public
const chargeStripe = asyncHandler(async (req, res) => {
  console.log('stripe-routes.js 9 | route reached', req.body);
  let { amount, id } = req.body;
  const order = await Order.findById(req.params.id);
  const user_id = order.user;
  const user = await User.findById(user_id);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const price = Number(order.totalPrice);
  const shipping = Number(order.shippingPrice);
  const tax = Number(order.taxPrice);

  const actualTotalPrice = addDecimals(
    order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const itemPrice = price - shipping - tax;
  const usedPoint = actualTotalPrice - itemPrice;
  console.log(usedPoint);

  const getPoint = Math.floor(actualTotalPrice / 100);

  const currentPoint = user.point + getPoint - usedPoint;
  if (order) {
    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'JPY',
        description: 'Your Company Description',
        payment_method: id,
        confirm: true,
      });
      order.isPaid = true;
      order.paidAt = Date.now();
      // order.paymentResult = {
      //   id: req.body.id,
      //   status: req.body.status,
      //   update_time: req.body.update_time,
      //   email_address: req.body.payer.email_address,
      // };

      const updatedOrder = await order.save();
      user.point = currentPoint;
      await user.save();

      res.json(updatedOrder);

      res.json({
        message: 'Payment Successful',
        success: true,
      });
    } catch (error) {
      res.json({
        message: 'Payment Failed',
        success: false,
      });
    }
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

export { chargeStripe };
