import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const Charts = () => {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  const data02 = [
    { name: 'A1', value: 100 },
    { name: 'A2', value: 300 },
    { name: 'B1', value: 100 },
    { name: 'B2', value: 80 },
    { name: 'B3', value: 40 },
    { name: 'B4', value: 30 },
    { name: 'B5', value: 50 },
    { name: 'C1', value: 100 },
    { name: 'C2', value: 200 },
    { name: 'D1', value: 150 },
    { name: 'D2', value: 50 },
  ];
  const data03 = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];
  const data04 = [
    { x: 200, y: 260, z: 240 },
    { x: 240, y: 290, z: 220 },
    { x: 190, y: 290, z: 250 },
    { x: 198, y: 250, z: 210 },
    { x: 180, y: 280, z: 260 },
    { x: 210, y: 220, z: 230 },
  ];
  return (
    <>
      <Row xs={1} md={2} lg={2} xl={2}>
        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded card-style">
            <Card.Body>
              <Card.Title>chart1</Card.Title>
              <Card.Text>
                <ResponsiveContainer width="90%" height={250}>
                  <ComposedChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uv" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded card-style">
            <Card.Body>
              <Card.Title>chart2</Card.Title>
              <Card.Text>
                <ResponsiveContainer width="90%" height={250}>
                  <PieChart>
                    <Pie
                      data={data01}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                    />
                    <Pie
                      data={data02}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#82ca9d"
                      label
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded card-style">
            <Card.Body>
              <Card.Title>chart3</Card.Title>
              <Card.Text>
                <ResponsiveContainer width="90%" height={250}>
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                    <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                    <ZAxis
                      type="number"
                      dataKey="z"
                      range={[60, 400]}
                      name="score"
                      unit="km"
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter
                      name="A school"
                      data={data03}
                      fill="#8884d8"
                      shape="star"
                    />
                    <Scatter
                      name="B school"
                      data={data04}
                      fill="#82ca9d"
                      shape="triangle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow p-3 mb-5 bg-white rounded card-style">
            <Card.Body>
              <Card.Title>chart4</Card.Title>
              <Card.Text>
                <ResponsiveContainer width="90%" height={250}>
                  <ComposedChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uv" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Charts;
