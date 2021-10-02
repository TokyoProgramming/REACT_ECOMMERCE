import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { sendEmailCtr } from './emailController.js';

// @desc create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const orders = await Order.find({ user: req.user._id });
  const notPaidOrders = orders.filter((item) => item.isPaid === false);

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderItems = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const user_id = order.user;
  const user = await User.findById(user_id);
  const userName = user.name;
  const userEmail = user.email;

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
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    user.point = currentPoint;
    await user.save();

    await sendEmailCtr(
      userEmail,
      'Order Confirmed',
      `Dear ${userName} we got your order , please wait until it is delivered`
    );
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/my orders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc Update order to delivered
// @route GET /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  const user_id = order.user;
  const user = await User.findById(user_id);
  const userName = user.name;
  const userEmail = user.email;

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    await sendEmailCtr(
      userEmail,
      'Now it is on the way',
      `Dear ${userName} we just shipped your goods , please wait until it is delivered`
    );

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('order not found');
  }
});

export {
  addOrderItems,
  getOrderItems,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
