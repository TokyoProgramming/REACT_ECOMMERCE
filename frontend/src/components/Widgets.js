import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';

const Widgets = () => {
  return (
    <>
      <Row>
        <Col>
          <ListGroup as="ul">
            <ListGroup.Item as="li" active>
              Cras justo odio
            </ListGroup.Item>
            <ListGroup.Item as="li">Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item as="li" disabled>
              Morbi leo risus
            </ListGroup.Item>
            <ListGroup.Item as="li">Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col>
          <ListGroup as="ul">
            <ListGroup.Item as="li" active>
              Cras justo odio
            </ListGroup.Item>
            <ListGroup.Item as="li">Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item as="li" disabled>
              Morbi leo risus
            </ListGroup.Item>
            <ListGroup.Item as="li">Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
            <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default Widgets;
