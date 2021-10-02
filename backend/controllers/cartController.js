import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import colors from 'colors';

import { sendEmailCtr } from './emailController.js';
import { createTestAccount } from 'nodemailer';

// @desc create new cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { orderItems: cartOrderItems } = req.body;

  const [{ product, qty }] = cartOrderItems;

  const carts = await Cart.find({ user: req.user._id });

  const selectedProduct = await Product.findById(product);
  const productCountInStock = Number(selectedProduct.countInStock);

  // if (productCountInStock > 0) {
  // selectedProduct._id;
  // selectedProduct._user;
  // selectedProduct.name;
  // selectedProduct.image;
  // selectedProduct.brand;
  // selectedProduct.category;
  // selectedProduct.description;
  // selectedProduct.rating;
  // selectedProduct.numReviews;
  // selectedProduct.price;
  // selectedProduct.countInStock = productCountInStock - Number(qty);
  // selectedProduct.reviews;
  // await selectedProduct.save();

  if (carts) {
    const items = [].concat.apply(
      [],
      carts.map((cart) => cart.orderItems.product.toString())
    );

    const hasBought = items.includes(product.toString());
    if (hasBought) {
      console.log('same goods in the cart'.yellow.bold);

      carts.map((cart) => cart.orderItems.product.toString() === product);

      const existItem = carts.find(
        (el) => el.orderItems.product.toString() === product
      );

      const existItemId = existItem._id.toString();
      const existCartItem = await Cart.findById(existItemId);
      const existQty = existCartItem.orderItems.qty;
      const updateQty = Number(existQty) + Number(qty);

      const item = existCartItem.orderItems;

      if (item) {
        item.name;
        item.qty = updateQty;
        item.image;
        item.price;
        item.product;

        item._id;
      }

      await existCartItem.save();

      res.json(existCartItem);
    } else {
      const newItem = cartOrderItems[0];
      const cart = new Cart({
        user: req.user._id,
        orderItems: {
          name: newItem.name,
          qty: newItem.qty,
          image: newItem.image,
          price: newItem.price,
          countInStock: productCountInStock,
          product: newItem.product,
        },
      });

      const createCart = await cart.save();

      res.json(createCart);
    }
  }
  // }
  if (cartOrderItems && cartOrderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }
});

// @desc Get logged in user cart
// @route GET /api/cart/
// @access Private
const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id });
  const cartItem = cart.map((item) => item.orderItems);
  res.json(cartItem);
});

// @desc Delete logged in user cart item
// @route DELETE /api/cart/:id
// @access Private
const deleteCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const cart = await Cart.find({ user: req.user._id });
  const deleteItem = cart.find(
    (item) => item.orderItems.product.toString() === productId
  );

  if (deleteItem) {
    await deleteItem.remove();
    res.json({ message: 'item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc Get all carts
// @route GET /api/cart
// @access Private/Admin
const getAllCarts = asyncHandler(async (req, res) => {
  const allItems = await Cart.find({});
  res.json(allItems);
});

// @desc Update user cart
// @route PUT /api/cart
// @access Private
const updateUserCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const cart = await Cart.find({ user: req.user._id });
  const updateItem = cart.find(
    (item) => item.orderItems.product.toString() === productId
  );

  if (updateItem) {
    updateItem.orderItems.qty = qty;

    await updateItem.save();
    const updateCartItem = updateItem.orderItems;
    res.json(updateCartItem);
  } else {
    res.status(404);
    throw new Error('cant update the cart item');
  }
});

// @desc Delete logged in user cart all items
// @route DELETE /api/cart/user/:id
// @access Private
const deleteAllCartItems = asyncHandler(async (req, res) => {
  const carts = await Cart.find({ user: req.user._id });

  if (carts) {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ message: 'all items are removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export {
  addToCart,
  getMyCart,
  deleteCartItem,
  getAllCarts,
  updateUserCart,
  deleteAllCartItems,
};
