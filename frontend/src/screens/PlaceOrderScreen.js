import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { getUserCart } from '../actions/cartActions';

import Loader from '../components/Loader';

const PlaceOrderScreen = ({ history }) => {
  const [isChecked, setIsChecked] = useState('save');
  const [isToggled, setIsToggled] = useState(false);
  const [point, setPoint] = useState(0);

  const cart = useSelector((state) => state.cart);
  const userCart = useSelector((state) => state.userCart);
  const { loading, userCartItem } = userCart;

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: userInfoLoading, userInfo } = userLogin;

  const userPoint = userInfo.point;
  const dispatch = useDispatch();

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  //   Calculate prices
  cart.itemsPrice = addDecimals(
    userCartItem.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(0.15 * cart.itemsPrice);
  cart.totalPrice =
    (
      Number(cart.itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
    ).toFixed(2) - point;

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: userCartItem,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (userCartItem.length === 0) {
      dispatch(getUserCart());
    }
    if (success) {
      history.push(`/orders/${order._id}`);
    }

    if (isChecked === 'save') {
      setIsToggled(false);
      setPoint(0);
    } else {
      setIsToggled(true);
      setPoint(point);
    }
    // eslint-disable-next-line
  }, [history, success, isChecked]);

  return (
    <>
      {loading || userInfoLoading ? (
        <Loader />
      ) : (
        <>
          <CheckoutSteps step1 step2 step3 step4 />
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Address</strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                    {cart.shippingAddress.postalCode}{' '}
                    {cart.shippingAddress.country}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <strong> Method:</strong>
                  {cart.paymentMethod}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {userCartItem.length === 0 ? (
                    <Message>Your cart is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {userCartItem.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} * ${item.price} = $
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${cart.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Point</Col>
                      <Col>{userInfo.point} </Col>
                    </Row>

                    <Form>
                      <fieldset>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={10}>
                            <Form.Check
                              type="radio"
                              label="save"
                              value="save"
                              name="formHorizontalRadios"
                              id="formHorizontalRadios1"
                              defaultChecked={true}
                              onChange={(e) => setIsChecked(e.target.value)}
                            />
                            <Form.Check
                              type="radio"
                              label="use point"
                              value="use"
                              name="formHorizontalRadios"
                              id="formHorizontalRadios2"
                              onChange={(e) => setIsChecked(e.target.value)}
                            />
                          </Col>
                        </Form.Group>
                      </fieldset>
                    </Form>
                    <Form onSubmit={submitHandler}>
                      {isToggled && (
                        <Row>
                          <Form.Group controlId="name">
                            <Form.Label>Point</Form.Label>
                            <Form.Control
                              type="Number"
                              placeholder="Point"
                              value={
                                point &&
                                Math.max(0, point) &&
                                Math.min(userPoint, point)
                              }
                              onChange={(e) => setPoint(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                        </Row>
                      )}
                    </Form>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${cart.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    {error && <Message variant="danger">{error} </Message>}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn-block"
                      disabled={userCart.userCartItem === 0}
                      onClick={placeOrderHandler}
                    >
                      Order
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PlaceOrderScreen;
