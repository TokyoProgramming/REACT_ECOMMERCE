import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_ADD_TO_ITEM,
  CART_ADD_TO_ITEM_FAIL,
  GET_USER_CART,
  GET_USER_CART_REQUEST,
  GET_USER_CART_ERROR,
  CART_UPDATE_REQUEST,
  CART_UPDATE_SUCCESS,
  CART_UPDATE_FAIL,
  CART_DELETE_ITEM_REQUEST,
  CART_DELETE_ITEM_FAIL,
  CART_DELETE_ITEM_SUCCESS,
  CART_RESET_REQUEST,
  CART_RESET_SUCCESS,
  CART_RESET_FAIL,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const addToCartItem = (id, qty) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'CART_ADD_TO_ITEM_REQUEST',
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(`/api/products/${id}`);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const orderItems = [
      {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        qty,
      },
    ];

    const cartItems = {
      user: userInfo._id,
      orderItems,
    };

    await axios.post('/api/cart', cartItems, config);

    dispatch({
      type: CART_ADD_TO_ITEM,
    });

    dispatch({
      type: 'CART_ADD_TO_ITEM_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: CART_ADD_TO_ITEM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_CART_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/cart`, config);

    dispatch({
      type: GET_USER_CART,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_CART_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserCart =
  (productId, qty) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CART_UPDATE_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put('/api/cart', { productId, qty }, config);

      dispatch({
        type: CART_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CART_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      console.log(error);
    }
  };

export const deleteCartItem = (productId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_DELETE_ITEM_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/cart/${productId}`, config);

    dispatch({
      type: CART_DELETE_ITEM_SUCCESS,
      payload: productId,
    });
  } catch (error) {
    dispatch({
      type: CART_DELETE_ITEM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const resetCartItems = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_RESET_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete('/api/cart', config);

    dispatch({
      type: CART_RESET_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: CART_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
