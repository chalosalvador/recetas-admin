import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { Form, Select, TimePicker, Input, InputNumber, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {  refI, refUnits } from '../firebase/index';
import Recipes from '../firebase/recipes';

const format = 'mm:ss';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 10,
    offset: 4
  },
};
const formButton = {
  wrapperCol: {
    span: 15,
    offset: 5
  },
};
const formButtonSubmite = {
  wrapperCol: {
    span: 10,
    offset: 9
  },
};




class RecipesForm2 extends Component {

  initialState = {
  
    Names: [],
    units:[],

    title: '',
    chefName: '',
    description: '',
    time: '',
    category: [],
    servings: '',
    ingredient: [{
      ingredient: '',
      quantity: ''
    }],
    steps: [],
    factNutrition: [{
      calories: '',
      proteins: '',
      fat: ''
    }],

  };
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.listIngredients = null;
    this.listUnits=null;
  }
  formRef = React.createRef();
  onReset = () => {
    this.formRef.current.resetFields();
  };


  handleSubmit = values => {
    console.log(values);

    //const ingredientesData = { title: this.state.title, description: this.state.description, time: this.state.time, category: this.state.category };

    //Recipes.add(ingredientesData)


    // this.formRef.current.resetFields();
  };
 

  onCollectionUpdate=(querySnapshot)=>{
    const Names= [];
    Recipes.viewIngredients(querySnapshot,Names)
    this.setState({
      Names
    });
  }
  componentDidMount() {
    this.listIngredients = refI.onSnapshot(this.onCollectionUpdate);
  }
collectionUnits=(querySnapshot)=>{
  const units=[];
  Recipes.viewUnits(querySnapshot, units)
  this.setState({
    units
  });
}

componentUnit=()=>{
  this.listUnits= refUnits.onSnapshot(this.collectionUnits);
}


  render() {


    const { title, chef } = this.props;
    return (

      <React.Fragment>
        <div>
          <h1>{title}</h1>
        </div>
       
        {console.log('ingredients:', this.state.Names)}

        <Form  {...formItemLayout}
          onFinish={this.handleSubmit}>
          <Form.Item>
          <Select placeholder='Ingredient'>
                            {this.state.Names.map(ingredients => (
                              <Option key={ingredients.key}  >{ingredients.name}</Option>
                            ))}
                          </Select>
          </Form.Item>

          

          <Form.List name="ingredientes" label="Ingredientes">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Ingredientes' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Ingrese un ingrediente o elimine el campo!',
                          },
                        ]}
                        noStyle
                      >
                        <Input.Group compact >

                          <Select placeholder='Ingredient'>
                            {this.state.Names.map(ingredients => (
                              <Option key={ingredients.key}  >{ingredients.name}</Option>
                            ))}
                          </Select>
                          <Select placeholder='Unidad'>
                          {this.state.units.map(units => (
                              <Option key={units.key}  >{units.name}</Option>
                            ))}
                          </Select>
                          <InputNumber min={1} placeholder="#" />
                        </Input.Group>
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 200px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item {...formButton}>
                    <Button

                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '40%' }}
                    >
                      <PlusOutlined /> Agregar Ingrediente
                </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>




          <Form.List name="steps">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Procedimiento: ' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Ingrese un procedimiento o elimine el campo!",
                          },
                        ]}
                        noStyle
                      >
                        <Input placeholder="Procedimiento" style={{ width: '95%' }} />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 5px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item {...formButton}>
                    <Button

                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '40%' }}
                    >
                      <PlusOutlined /> Agregar Procedimiento
                </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>








          <Form.Item label="Información Nutricional" >
            <Form.Item
              name="calories"
              rules={[{
                required: true,
                message: "Ingrese calorías"
              }]}
              style={{ display: 'inline-block', margin: '0 10px' }}
            >
              <InputNumber placeholder="%Calories" />
            </Form.Item>
            <Form.Item
              name="protein"
              rules={[{
                required: true,
                message: "Ingrese Proteína"
              }]}
              style={{ display: 'inline-block', margin: '0 10px' }}
            >
              <InputNumber placeholder="%Proteins" />
            </Form.Item>

            <Form.Item
              name="fat"
              rules={[{
                required: true,
                message: "Ingrese Grasas"
              }]}
              style={{ display: 'inline-block', margin: '0 10px' }}
            >
              <InputNumber placeholder="%Fat" />
            </Form.Item>
          </Form.Item>









          <Form.Item {...formButtonSubmite}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>





        </Form>
      </React.Fragment>
    );
  };

}

export default compose(withRouter)(RecipesForm2);
