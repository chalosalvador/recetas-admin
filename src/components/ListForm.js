
import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { ref } from '../firebase/index';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { UserAddOutlined, DeleteFilled, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form, Modal, Typography } from 'antd';
import { ADDCHEFS } from '../constants/routes';
import Chefs from '../firebase/chefs';
import ChefsForm from '../components/ChefsForm';

const { Title } = Typography;

class ListForm extends Component {

  initialState = {
    boards: [],
    key: '',
    loading: false,
    visible: false,


    name: '',
    lastname: '',
    speciality: '',
    experience: '',
    job: '',
    nationality: '',

  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.unsubscribe = null;

  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
 
  handleCancel = () => {
    this.setState({ visible: false , chef:null});
  };

  onCollectionUpdate = (querySnapshot) => {
    const boards = [];
    Chefs.view(querySnapshot, boards)
    this.setState({
      boards
    });
  }

  componentDidMount() {
    this.unsubscribe = ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {

    const { visible, loading } = this.state;
    const chef = this.props;

    const dataSource = this.state.boards;
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
        title: 'Especialidad',
        dataIndex: 'speciality',
        key: 'speciality',
      },
      {
        title: 'Años Experiencia',
        dataIndex: 'experience',
        key: 'experience',
      },
      {
        title: 'Trabajo Actual',
        dataIndex: 'job',
        key: 'job',
      },
      {
        title: 'Nacionalidad',
        dataIndex: 'nationality',
        key: 'nationality',
      },
      {
        title: '',
        dataIndex: 'delete',
        width: 70,
        fixed: 'right',
        render: (text, boards) =>
          <Popconfirm   title="Estas seguro de eliminar?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={(e) => Chefs.onDelete(boards.key, e)}>
          <Button danger><DeleteFilled/></Button>
          </Popconfirm>
      },
      {
        title: '',
        dataIndex: 'edit',
        width: 70,
        fixed: 'right',
        render: (value, chef) =>
          <Button type="primary" 
          icon={ <EditOutlined />}
          onClick={() => {
            this.setState({ chef });
            //console.log('chef ROW', chef);
            this.showModal();
          }}>
      </Button>

      }];

    const { ListTitle } = this.props;


    return (

      <React.Fragment>
        <Title level={4}>{ListTitle}</Title>
        <br />

        <Link to={ADDCHEFS}><Button type="primary" icon={<UserAddOutlined />}>Agregar
        </Button></Link>

        <br /><br />
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1300 }} >
          >

        </Table>

{
  this.state.chef && 
  <Modal
  visible={visible}
  title="Editar Registro de Chefs"
  onCancel={this.handleCancel}
  footer={[
    <Button key="back" onClick={this.handleCancel}>
      Cancelar
    </Button>,
  ]}
>

  <ChefsForm chef={this.state.chef} buttonText={"Editar"}/>

</Modal>
}
       
      </React.Fragment>
    );
  }
}

export default compose(withRouter)(ListForm);

