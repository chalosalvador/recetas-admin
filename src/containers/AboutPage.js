import React from 'react'
import { Row, Col, Typography } from 'antd';
import foodiePlan from '../imgs/logo.png';
const { Title } = Typography;
const { Paragraph } = Typography;

export default () => (
  <React.Fragment>
  <Row>
      <Col span={8}>
      <Title level={4}>Acerca de Nosotros</Title>
      
      <Title level={5}>Equipo de Desarrollo</Title>
      <Paragraph >
        Adriana Santacruz y Wendy Villegas
      </Paragraph>
      <p></p>
      </Col>
      <Col span={8}>
      <img src={foodiePlan} alt="logo" height={500}/>
      </Col>
      <Col span={8}></Col>
    </Row>
  
  </React.Fragment>
)