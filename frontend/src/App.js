import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import TokenAuthScreen from './screens/TokenAuthScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import adminPanel from './screens/adminPanel';
import EmailScreen from './screens/EmailScreen';

function App() {
  return (
    <Router>
      <Header />

      <main className="py-3 ">
        <Container fluid>
          <Row>
            <Col md={2}>
              <Sidebar />
            </Col>
            <Col md={10} xs={12}>
              <Route path="/" component={HomeScreen} exact />
              <Route path="/search/:keyword" component={HomeScreen} exact />
              <Route path="/page/:pageNumber" component={HomeScreen} exact />
              <Route
                path="/search/:keyword/page/:pageNumber"
                component={HomeScreen}
                exact
              />
              <Route path="/product/:id" component={ProductScreen} />
              <Route path="/cart/:id?" component={CartScreen} />
              <Route path="/login" component={LoginScreen} />
              <Route path="/token/:id" component={TokenAuthScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/profile" component={ProfileScreen} />
              <Route path="/shipping" component={ShippingScreen} />
              <Route path="/payment" component={PaymentScreen} />
              <Route path="/placeorder" component={PlaceOrderScreen} />
              <Route path="/orders/:id" component={OrderScreen} />
              <Route path="/admin/userlist" component={UserListScreen} />
              <Route
                path="/admin/productlist"
                component={ProductListScreen}
                exact
              />
              <Route
                path="/admin/productlist/:pageNumber"
                component={ProductListScreen}
                exact
              />
              <Route path="/admin/user/:id/edit" component={UserEditScreen} />
              <Route
                path="/admin/product/:id/edit"
                component={ProductEditScreen}
              />
              <Route path="/admin/orderlist" component={OrderListScreen} />
              <Route path="/admin/adminpanel" component={adminPanel} />
              <Route path="/admin/email" component={EmailScreen} />
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
