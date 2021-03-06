import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc Fetch all products
// @route GET / api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.count({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product
// @route GET /api/product/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Public / Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create a product
// @route Create /api/products
// @access Public / Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: 'images/sample.jgp',
    brand: 'Sample Brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update a product
// @route Put /api/products/:id
// @access Public / Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    req.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create new review
// @route Post /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  const orders = await Order.find({ user: req.user._id });

  const ordersItems = [].concat.apply(
    [],
    orders.map((order) =>
      order.orderItems.map((item) => item.product.toString())
    )
  );

  if (product) {
    const hasBought = ordersItems.includes(product._id.toString());

    if (!hasBought) {
      res.status(400);
      throw new Error('You can only review products you bought');
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    req.status(404);
    throw new Error('Product not found');
  }
});

// @desc Get top rated products
// @route Create /api/products/top
// @access Public
const getTopProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

// @desc update countInStock
// @route update /api/products/countinstock
// @access Public
const updateCountInStock = asyncHandler(async (req, res) => {
  const orders = req.body;

  const orderedItems = [].concat.apply(
    [],
    orders.map((item) => item.product.toString())
  );
  const products = await Product.find({
    _id: orderedItems,
  });

  if (products) {
    const size = products.length;
    for (let i = 0; i < size; i++) {
      const element = products[i];
      const id = element._id.toString();
      const targetOrder = orders.find((item) => item.product === id);
      const orderedQty = targetOrder.qty;

      element.countInStock = Number(element.countInStock) - Number(orderedQty);
      await element.save();
    }
  }
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProduct,
  updateCountInStock,
};
