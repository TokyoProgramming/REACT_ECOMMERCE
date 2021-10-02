import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';
import { getUserCart } from '../actions/cartActions';
import { generateToken } from '../actions/userActions';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = location.search ? location.search.split('=')[1] : '/';
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  const userSendToken = useSelector((state) => state.userSendToken);
  const {
    loading: sentTokenLoading,
    sendTokenUser,
    error: sentTokenError,
  } = userSendToken;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserCart());

      history.push(redirect);
    } else if (error) {
      const userEmail = error.split(' ')[0];

      if (email === userEmail) {
        dispatch(generateToken(email));
      }
    }
    // eslint-disable-next-line
  }, [history, userInfo, redirect, dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <>
      {loading || sentTokenLoading ? (
        <Loader />
      ) : !sendTokenUser ? (
        <FormContainer>
          <h1>Sign In</h1>

          {error && <Message variant="danger">{error} </Message>}
          {sentTokenError && (
            <Message variant="danger">{sentTokenError} </Message>
          )}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              New Customer ?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
              >
                Register
              </Link>
            </Col>
          </Row>
        </FormContainer>
      ) : (
        history.push(`token/${sendTokenUser._id}/verify`)
      )}
    </>
  );
};

export default LoginScreen;
