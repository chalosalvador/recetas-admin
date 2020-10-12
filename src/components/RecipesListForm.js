
import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { ref, refI, refUnits, refRecipes, db } from '../firebase/index';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { UserAddOutlined, DeleteFilled, PieChartOutlined, EditOutlined, UserOutlined, FieldTimeOutlined,SearchOutlined,  QuestionCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form, Modal, Typography, Space } from 'antd';
import Recipes from '../firebase/recipes';
import { ADDRECIPIES } from '../constants/routes';
import RecipesForm from '../components/RecipesForm';

import Highlighter from "react-highlight-words";

const { Title } = Typography;

class RecipesListForm extends Component {

  initialState = {
    listR: [],
    //listChefs: [],
    ingredientNames: {},
    unitNames: {},
    chefNames: {},

    key: '',
    loading: false,
    visible: false,

    searchText: '',
    searchedColumn: '',

  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.unsubscribe = null;
    this.listChefs = null;
    this.listIngredients = null;
    this.listUnits = null;
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
    // Recipes.onView(querySnapshot, listR);
    /* querySnapshot.forEach((doc) => {
        
          const{chef, description, servings, time, name, nutritionFacts,calories,protein,fat, category, ingredients, steps }= doc.data();
          listR.push({
              key: doc.id,
              doc,
              name,
              chef: this.state.chefNames[chef.id].name,
              description, 
              category,
              servings, 
              time,
              nutritionFacts,
              ingredients,
              steps
          });
      }); 
      console.log(listR[0].chef.id);*/
    this.setState({
      listR
    });
  }
  onCollectionI=(querySnapshot)=>{
    const ingredientNames = {};
    querySnapshot.forEach((doc) => {
      const { name } = doc.data();
      ingredientNames[doc.id] = {
        key: doc.id,
        name
      };
    });
    this.setState({
      ingredientNames
    });
  
  }
  onCollectionU=(querySnapshot)=>{
    const unitNames = {};
    querySnapshot.forEach((doc) => {
      const{name}= doc.data();
      unitNames[doc.id]={
          key: doc.id,
          name
      };
  });
  this.setState({
    unitNames
  });
  }

  onCollectionChefs = (querySnapshot) => {
    const chefNames = {};
    //Recipes.viewChefs(querySnapshot, chefNames)
    querySnapshot.forEach((doc) => {
      const { name, lastname } = doc.data();
      chefNames[doc.id] = {
        key: doc.id,
        name,
        lastname
      };
    });
  
    //this.setState({
    // chefNames
    // });


    refRecipes.onSnapshot((querySnapshot) => {
      const listR = [];
      
      querySnapshot.forEach((doc) => {

        const { chef, description, servings, time, name, nutritionFacts, calories, protein, fat, category, ingredients, steps, picture } = doc.data();
       /* const ingredientsData = [];
        ingredients.forEach((ingredientRef)=>{
          ingredientsData.push({
            //ingredient: ingredientRef.ingredient
            ingredient: this.state.ingredientNames[ingredientRef.ingredient.id],
            unit: this.state.unitNames[ingredientRef.unit.id],
            quantity: ingredientRef.quantity,
          })
        }
        )*/
        
        const ingredientsData = [];
        ingredients.forEach((ingredientRef)=>{
          ingredientsData.push({
            ingredient: ingredientRef.ingredient.id,
            unit: ingredientRef.unit.id,
            quantity: ingredientRef.quantity,
          })
        })

        listR.push({
          key: doc.id,
          doc,
          name,
          chef: chef.id,
          description,
          category,
          servings,
          time,
          nutritionFacts,
         ingredients: ingredientsData,
          steps,
          picture
        });
      });
      
      //console.log(chefName)
       //console.log("ingredientes",this.state.ingredientNames)
       //console.log("unidades",this.state.unitNames)
       
       //console.log("ingredientes de la receta", listR[0].ingredients)
      this.setState({
        listR
      });
    });
  }
 
  componentDidMount() {
    this.listChefs = ref.onSnapshot(this.onCollectionChefs);
    this.listIngredients = refI.onSnapshot(this.onCollectionI);
    this.listUnits = refUnits.onSnapshot(this.onCollectionU);
  }


  render() {

    const { visible, loading } = this.state;
    const recipe = this.props;

    const dataSource = this.state.listR;
    const columns = [
      
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),  
        width: 120, 
      },
      {
        title: 'Descripcion/Nota',
        dataIndex: 'description',
        key: 'description',
        width: 200,
      },
      {
        title: 'Categoria',
        dataIndex: 'category',
        key: 'category',
        width: 100,  
      },
      {
        title: "Porciones",
        dataIndex: 'servings',
        key: 'servings',
        ...this.getColumnSearchProps('servings'), 
        width: 100,
      },
      {
        title: "Tiempo (min)",
        dataIndex: 'time',
        key: 'time',
        ...this.getColumnSearchProps('time'), 
        width: 100,
      },
      

      {
        title: '',
        width: 70,
        dataIndex: 'delete',
        fixed: 'right',
        render: (text, listR) =>

      <Popconfirm title="Estas seguro de eliminar?"  icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={(e) => Recipes.onDelete(listR.key, e)}>
            <Button danger><DeleteFilled /></Button>
          </Popconfirm>
      },
      {
        title: '',
        width: 70,
        dataIndex: 'edit',
        fixed: 'right',
        render: (value, recipe) =>
          <Button type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              this.setState({ recipe });
              console.log('recipe ROW', recipe);
              this.showModal();
            }}>
          </Button>

      }];

    const { ListTitle } = this.props;


    return (

      <React.Fragment>
        <Title level={4}>{ListTitle}</Title>
        <br />

        <Link to={ADDRECIPIES}><Button type="primary" icon={<FileAddOutlined />}>Agregar
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

