
import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { ref } from '../firebase/index';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { UserAddOutlined, DeleteFilled, EditOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form, Modal, Typography, Space } from 'antd';
import { ADDCHEFS } from '../constants/routes';
import Chefs from '../firebase/chefs';
import ChefsForm from '../components/ChefsForm';
import Highlighter from "react-highlight-words";

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

    searchText: '',
    searchedColumn: ''

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

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Borrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });



  render() {

    const { visible, loading } = this.state;
    const chef = this.props;

    const dataSource = this.state.boards;
    const columns = [
      
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),        
      },
      {
        title: 'Apellido',
        dataIndex: 'lastname',
        key: 'lastname',
        ...this.getColumnSearchProps('lastname'),   
      },
      {
        title: 'Especialidad',
        dataIndex: 'speciality',
        key: 'speciality',
        ...this.getColumnSearchProps('speciality'),   
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
        ...this.getColumnSearchProps('name'),   
      },
      {
        title: 'Nacionalidad',
        dataIndex: 'nationality',
        key: 'nationality',
        ...this.getColumnSearchProps('nationality'),   
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
          scroll={{ x: 1300 }} 
          
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

/*
filters:[
          {
           
            value: 'name',
            text: 'Andrea'
          }
        ],
        onFilter:(value, record)=> record.name.indexOf(value)===0,
        sorter: (a,b)=> a.name - b.name.length,
        sortDirections: ['descend'],
         */