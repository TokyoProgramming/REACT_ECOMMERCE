import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import {
  addToCart,
  getUserCart,
  updateUserCart,
  deleteCartItem,
} from '../actions/cartActions';
import Loader from '../components/Loader';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userCart = useSelector((state) => state.userCart);
  const { loading, userCartItem } = userCart;

  const userAddCart = useSelector((state) => state.userAddCart);
  const { loading: userAddCartLoading } = userAddCart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
    dispatch(getUserCart());
  }, [dispatch, productId, qty, userInfo, userAddCartLoading]);

  const updateUserCartHandler = (cartProductId, cartQty) => {
    dispatch(updateUserCart(cartProductId, cartQty));
  };

  const removeFromCartHandler = (id) => {
    dispatch(deleteCartItem(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };
  return (
    <>
      {userAddCartLoading || loading ? (
        <Loader />
      ) : (
        <Row>
          <Col md={8}>
            <h1>Shopping Cart</h1>
            {userCartItem.length === 0 ||
            userCartItem.length === 'undefined' ? (
              <Message>
                Your Cart is empty <Link to="/">Go Back</Link>{' '}
              </Message>
            ) : (
              <ListGroup variant="flush">
                {userCartItem.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>
                          {item.name}{' '}
                        </Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            updateUserCartHandler(
                              item.product,
                              Number(e.target.value)
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>{' '}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    Subtotal (
                    {userCartItem.reduce((acc, item) => acc + item.qty, 0)})
                    items{' '}
                  </h2>
                  $
                  {userCartItem
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={userCartItem.length === 0}
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CartScreen;
