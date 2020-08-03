
import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { refUser, db } from '../firebase/index';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { UserAddOutlined, DeleteFilled, PieChartOutlined, EyeOutlined, UserOutlined, ScheduleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form, Drawer, List, Divider, Col, Row, Avatar, Card, Typography } from 'antd';
import Users from '../firebase/user';
import '../styles/user.css'

import Moment from 'react-moment';
import 'moment-timezone';
import * as moment from 'moment';
import 'moment/locale/pt-br';

const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
const DescriptionPlan = ({ content, content1 }) => (
  <div className="site-description-item-profile-wrapper">
  <Card title={<ScheduleOutlined />} type="inner" bordered={true}>
  
  <p>{"Receta: "+content}</p>
  <p>{"Fecha: "+content1}</p>
  </Card>
  </div>
);
class UserListForm extends Component {

  initialState = {

    userNames: [],
    plan: [],

    key: '',
    loading: false,
    visible: false,

  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.listUsers = null;
    this.listPlanN = null;
  }
 

  onCollectionUser = (querySnapshot) => {
    const userNames = [];
    Users.onView(querySnapshot, userNames)
    this.setState({
      userNames
    });
  }
  componentDidMount() {
    this.listUsers = refUser.onSnapshot(this.onCollectionUser);
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };


  render() {

    const { visible, loading } = this.state;
    const user = this.props;

    const dataSource = this.state.userNames;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Apellido',
        dataIndex: 'lastname',
        key: 'lastname',
      },
      {
        title: 'Apodo',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: 'Fecha Nacimiento',
        dataIndex: 'dateBirth',
        key: 'dateBirth',
      },
      {
        title: "Género",
        dataIndex: 'gender',
        key: 'gender',
      },

      {
        dataIndex: 'view',
        fixed: 'right',
        width: 70,
        render: (value, user) =>
          <Button type="primary"
            icon={<EyeOutlined />}
            onClick={async () => {
              this.setState({ user });
              const planSnap = await refUser.doc(user.key).collection('plan').get()
               user.plan = [];
                planSnap.forEach(doc=>{
                  	user.plan.push(doc.data());
                })
                console.log("USER PLAN",user.plan);
              
              this.key = user.key;
              this.showDrawer();
              console.log("userSelect:", user);
            }}>
          </Button>

      }];
    const { ListTitle } = this.props;

    return (

      <React.Fragment>
         <Title level={4}>{ListTitle}</Title>

        <br />
        <Table
          
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1300 }} >

        </Table>

        {this.state.user &&
          <Drawer
            width={640}
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            {console.log("draw", this.state.user)}
            {console.log("plan", this.state.user.plan)}



            <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
              <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />

              Perfil del Usuario
          </p>
            <p className="site-description-item-profile-p">Información Personal</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Nombre Completo" content={`${this.state.user.name}${this.state.user.lastname}`} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="Apodo" content={this.state.user.nickname} />
              </Col>
              <Col span={6}>
                <DescriptionItem title="Género" content={this.state.user.gender} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="Fecha Nacimiento" 
                  content={
                    <Moment format="DD/MM/YYYY">
                  {this.state.user.dateBirth}
                  </Moment>
                  } />
              </Col>
            </Row>
            <Divider />

            <p className="site-description-item-profile-p">Información de Salud</p>
            <p className="site-description-item-profile-p">Medidas Corporales</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Altura" content={`${this.state.user.height}` + " cm"} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Peso" content={`${this.state.user.weight}` + " kg"} />
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Problemas de Salud"
                  content={this.state.user.healthInfo + "  "}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Problemas de Salud"
                  content={`${this.state.user.dailyActivities}`}
                />
              </Col>
            </Row>
            
            <Divider />

            <p className="site-description-item-profile-p">Plan Nutricional</p>
            <Row>

              <Button type="primary" onClick={
                
                 
                this.showChildrenDrawer  
                }>
                Planificación
                </Button>
                {this.state.user.plan &&
                  <Drawer
                  title="Plan Nutricional"
                  width={320}
                  closable={false}
                  onClose={this.onChildrenDrawerClose}
                  visible={this.state.childrenDrawer}
                >
                {this.state.user.plan.map(plan => (        
                  
                   <DescriptionPlan  
                   content={plan.title.name} content1={ moment.unix(plan.startTime).local().format("DD/MMM/YYYY")} />
                  ))}
                
                </Drawer>
                }

                  
                
            </Row>

          </Drawer>
        }
        

        <br /><br />



      </React.Fragment>
    );
  }
}

export default compose(withRouter)(UserListForm);

/*

   {console.log("planColl consola", this.onCollectionPlanN())}
  {console.log("planColl array", this.state.subColl)}

            <DescriptionItem title="Fecha Inicio" content={this.state.plan.map(plan => (
                      plan.title
                    ))} />


     <Card type="inner" 
                    title= {this.state.plan.forEach((plan) => (
                      plan.key,
                        console.log(plan.date.title, plan.date.starTime)
                    ))} 
                    bordered={true}>
                    </Card>
{this.state.user.plan.map(plan => (        
                    <DescriptionPlan  content={plan.date.startTime.toDate()+" "+plan.date.title} />
                            ))}
                    
 */