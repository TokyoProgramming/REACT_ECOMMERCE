import React from 'react';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_KEY =
  'pk_test_51Jh5GUEUVzsUE3jHPBElWgnbDEaOnE3M25G56Fari43KN9jc67KnyT0qqHT1SPGLwESP1GSCZyG2FZTHEpUF2Xf700ZH0AvmRV';
const stripePromise = loadStripe(STRIPE_KEY);

const StripeContainer = ({ amount, orderId }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} orderId={orderId} />
    </Elements>
  );
};

export default StripeContainer;
