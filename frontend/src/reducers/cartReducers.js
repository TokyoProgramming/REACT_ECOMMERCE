import {
  CART_ADD_ITEM,
  CART_CLEAR_ITEMS,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_ADD_TO_ITEM,
  CART_ADD_TO_ITEM_FAIL,
  GET_USER_CART,
  GET_USER_CART_REQUEST,
  GET_USER_CART_ERROR,
  CART_ADD_TO_ITEM_REQUEST,
  CART_ADD_TO_ITEM_SUCCESS,
  GET_USER_CART_RESET,
  CART_UPDATE_SUCCESS,
  CART_UPDATE_REQUEST,
  CART_UPDATE_FAIL,
  CART_DELETE_ITEM_REQUEST,
  CART_DELETE_ITEM_FAIL,
  CART_DELETE_ITEM_SUCCESS,
  CART_RESET_REQUEST,
  CART_RESET_FAIL,
  CART_RESET_SUCCESS,
} from '../constants/cartConstants';

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

export const userAddCartReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case CART_ADD_TO_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CART_ADD_TO_ITEM:
      return {
        ...state,
        loading: true,
      };
    case CART_ADD_TO_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CART_ADD_TO_ITEM_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const userCartReducer = (state = { userCartItem: [] }, action) => {
  const { type, payload } = action;
  const cartItem = action.payload;

  switch (type) {
    case CART_RESET_REQUEST:
    case CART_DELETE_ITEM_REQUEST:
    case CART_UPDATE_REQUEST:
    case GET_USER_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_CART:
      return {
        loading: false,
        userCartItem: cartItem,
      };

    case CART_RESET_SUCCESS:
    case GET_USER_CART_RESET:
      return {
        userCartItem: [],
      };
    case CART_UPDATE_SUCCESS:
      const existCartItems = state.userCartItem;
      const foundIndex = existCartItems.findIndex(
        (x) => x.product === cartItem.product
      );
      existCartItems[foundIndex] = cartItem;

      return {
        loading: false,
        userCartItem: existCartItems,
      };
    case CART_DELETE_ITEM_SUCCESS:
      return {
        loading: false,
        userCartItem: state.userCartItem.filter(
          (x) => x.product !== action.payload
        ),
      };

    case CART_RESET_FAIL:
    case CART_UPDATE_FAIL:
    case CART_DELETE_ITEM_FAIL:
    case GET_USER_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};
