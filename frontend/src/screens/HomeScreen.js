import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import ProductCarousel from '../components/ProductCarousel';

import { listProducts } from '../actions/productActions';
import { getUserCart } from '../actions/cartActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading: productTopLoading } = productTopRated;

  const userCart = useSelector((state) => state.userCart);
  const { loading: userCartLoading } = userCart;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    dispatch(getUserCart());
    // dispatch(getUserCart());
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />

      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          {' '}
          Go back
        </Link>
      )}
      <h1>Latest Products</h1>

      {loading || productTopLoading || userCartLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error} </Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
