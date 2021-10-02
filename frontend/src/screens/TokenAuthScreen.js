import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { verifyToken, generateToken } from '../actions/userActions';

const TokenAuthScreen = ({ location, history }) => {
  const [token, setToken] = useState('');

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const dispatch = useDispatch();

  const userVerifyToken = useSelector((state) => state.userVerifyToken);
  const { loading: tokenLoading, success, error: tokenError } = userVerifyToken;

  const userSendToken = useSelector((state) => state.userSendToken);
  const {
    loading: sendTokenLoading,
    sendTokenUser,
    error: sendTokenError,
  } = userSendToken;

  useEffect(() => {
    if (!tokenLoading && success) {
      history.push('/');
    }
  }, [
    history,
    tokenLoading,
    redirect,
    dispatch,
    success,
    sendTokenLoading,
    sendTokenUser,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyToken(sendTokenUser, token));
  };

  const sendTokenAgainHandler = () => {
    const userEmail = sendTokenUser.email;
    dispatch(generateToken(userEmail));
  };

  return (
    <>
      {tokenError && <Message variant="danger">{tokenError} </Message>}
      {sendTokenError && <Message variant="danger">{sendTokenError} </Message>}

      {tokenLoading || sendTokenLoading ? (
        <Loader />
      ) : !sendTokenUser ? (
        history.push('/login')
      ) : (
        <FormContainer>
          <h1>Authenticate Token</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Token</Form.Label>
              <Form.Control
                type="token"
                required
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              ></Form.Control>
            </Form.Group>{' '}
            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: '10px' }}
            >
              Verify Token
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              <Button variant="info" onClick={sendTokenAgainHandler}>
                get Token Again ?{' '}
              </Button>
            </Col>
          </Row>
        </FormContainer>
      )}
    </>
  );
};

export default TokenAuthScreen;
