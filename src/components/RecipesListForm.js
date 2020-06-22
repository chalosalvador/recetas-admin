
import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { refRecipes, ref } from '../firebase/index';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { UserAddOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form, Modal } from 'antd';

import Recipes from '../firebase/recipes';
import { ADDRECIPIES } from '../constants/routes';
import RecipesForm from '../components/RecipesForm';


class RecipesListForm extends Component {

  initialState = {
    listR: [],
    key: '',
    loading: false,
    visible: false,

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
    this.setState({ visible: false, recipe: null });
  };

  onCollectionUpdate = (querySnapshot) => {
    const listR = [];
    Recipes.onView(querySnapshot, listR)
    this.setState({
      listR
    });
  }

  componentDidMount() {
    this.unsubscribe = refRecipes.onSnapshot(this.onCollectionUpdate);
  }

  viewChef() {
    //refRecipes.where('id', '==', id).get();
    const chefAct = [];
    const allChefs = ref.doc("D1vQxGLRk6Gy1mhs0fik").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          // if(doc.id == 'D1vQxGLRk6Gy1mhs0fik'){
          //  chefAct.push(doc.data())

          // console.log(chefAct.name);
          //}



          //console.log(doc.id, '=>', doc.data());
          console.log(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }


  render() {

    const { visible, loading } = this.state;
    const recipe = this.props;

    const dataSource = this.state.listR;
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
        title: 'Chef',
        dataIndex: 'chef',
        key: 'chef',
      },
      {
        title: 'Descripcion',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Categoria',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Porciones',
        dataIndex: 'servings',
        key: 'servings',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: 'Calorias',
        dataIndex: 'calories',
        key: 'calories',
      },
      {
        title: 'Proteinas',
        dataIndex: 'protein',
        key: 'protein',
      },
      {
        title: 'Grasas',
        dataIndex: 'fat',
        key: 'fat',
      },
      {
        title: 'Procedimiento',
        dataIndex: 'steps',
        key: 'steps',
      },

      {
        title: '',
        dataIndex: 'delete',
        render: (text, listR) =>

          <Popconfirm title="Estas seguro de eliminar?" onConfirm={(e) => Recipes.onDelete(listR.key, e)}>
            <Button danger><DeleteFilled /></Button>
          </Popconfirm>
      },
      {
        title: '',
        dataIndex: 'edit',
        render: (value, recipe) =>
          <Button type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              this.setState({ recipe });
              //console.log('recipe ROW', recipe);
              this.showModal();
            }}>
          </Button>

      }];

    const { ListTitle } = this.props;


    return (

      <React.Fragment>
        <h1>{ListTitle}</h1>
        <br />

        <Link to={ADDRECIPIES}><Button type="primary" icon={<UserAddOutlined />}>Agregar
        </Button></Link>

        <br /><br />
        <Table

          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1300 }} >

        </Table>


        {this.state.recipe &&
          <Modal
            visible={visible}
            title="Editar Registro de Recetas"
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancelar
            </Button>,
            ]}
          >
            <RecipesForm recipe={this.state.recipe} buttonText="Editar" />

          </Modal>
        }
      </React.Fragment>
    );
  }
}

export default compose(withRouter)(RecipesListForm);

