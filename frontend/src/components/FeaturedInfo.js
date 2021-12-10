import React from 'react';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { Row, Col, Card } from 'react-bootstrap';

export const FeaturedInfo = () => {
  return (
    <>
      <Row xs={3} md={3} lg={3}>
        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title> Revenue </Card.Title>
              <Card.Text>
                30.4
                <ArrowUpward className="featuredIcon" />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title> Revenue </Card.Title>
              <Card.Text>
                -11.4
                <ArrowDownward className="featuredIcon negative" />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title> Revenue </Card.Title>
              <Card.Text>
                -11.4
                <ArrowDownward className="featuredIcon negative" />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
