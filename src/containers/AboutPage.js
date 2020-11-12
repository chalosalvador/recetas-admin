import React from 'react'
import { Row, Col, Typography } from 'antd';
import foodiePlan from '../imgs/logo.png';
const { Title } = Typography;
const { Paragraph } = Typography;

export default () => (
  <React.Fragment>
    <Row>
      <Col span={8}>
        
      <img src={foodiePlan} alt="logo" height={200} />
        
      </Col>
      <Col span={8}>
      <Title aling="center" level={4}>Acerca de Nosotros</Title>
      <Paragraph >
          Sistema web Admin FoodiePlan permite el acceso solo a usuarios admin.

          En donde el usuario puede realizar las siguientes funciones:
        <ul>
            <li>Gestion de Chefs</li>
            <li>Gestion de Recetas</li>
            <li>Visualizacion de Usuarios Clientes de Aplicacion Movil</li>

          </ul>
        <Paragraph >
           Desarrollado por Adriana Santacruz y Wendy Villegas
      </Paragraph>

        </Paragraph>
  
      </Col>
      <Col span={8}>
     
      </Col>
      
    </Row>

  </React.Fragment>
)