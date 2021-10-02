import asyncHandler from 'express-async-handler';
import twofactor from 'node-2fa';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import { sendEmailCtr } from './emailController.js';

// @desc Auth user & get token
// @route GET / api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user.isVerify === true) {
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerify: user.isVerify,
        point: user.point,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } else if (user.isVerify === false) {
    if (user && (await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Complete 2FA Auth');
    }
  }
});

// @desc Auth user & get token
// @route POST / api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists && userExists.isVerify === true) {
    res.status(400);
    throw new Error('User already exists');
  }
  if (userExists && userExists.isVerify === false) {
    //   const secret = await TwoFactorGenerateSend(user.email, req);
    //   user.secret = secret;
    //   await user.save();
    //   res.json({ message: 'token sent' });
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      point: user.point,
      token: generateToken(user._id),
    });

    res.json(user);
  } else {
    res.status(400);
    throw new Error('Invalid User information');
  }
});

// @desc Get user profile
// @route GET / api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const userName = user.name;
    const userEmail = user.email;
    await sendEmailCtr(
      userEmail,
      'User Updated',
      `Dear ${userName} your user information has been updated`
    );

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      point: updatedUser.point,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private / Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private / Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private / Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user
// @route PUT / api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      point: updatedUser.point,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Auth create two factor token for user
// @route POST /api/users/generate
// @access Public
const twoFactorGenerateToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    const newSecret = twofactor.generateSecret({
      name: 'shop',
      account: email,
    });
    const newToken = twofactor.generateToken(newSecret.secret);
    const secret = newSecret.secret;

    checkUser.secret = secret;
    await checkUser.save();

    const token = newToken.token;
    const id = checkUser._id;
    const fullUrl =
      req.protocol + '://' + req.get('host') + `/api/users/${id}/verify`;
    await sendEmailCtr(
      email,
      'Authorize Token',
      `Dear ${email} \n\n this is user Token ${token} \n\n 
      ${fullUrl}`
    );
    res.json(checkUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Auth create two factor token for user
// @route POST /api/users/:id/verify
// @access Public
const twoFactorVerifyToken = asyncHandler(async (req, res) => {
  const { token, email } = req.body;
  const checkUser = await User.findOne({ email });

  if (checkUser) {
    const user = await User.findById(req.params.id);
    const userSecret = user.secret;
    const verify = twofactor.verifyToken(userSecret, token, 15);

    try {
      if (verify) {
        user.isVerify = true;
        await user.save();
        res.status(200);
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
          verify: user.isVerify,
        });
      } else {
        res.status(500);
        res.json({ message: 'invalid Token' });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: 'verify token is not correct, please try it again' });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  twoFactorGenerateToken,
  twoFactorVerifyToken,
};
