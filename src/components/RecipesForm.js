import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { Form, Select, Input, InputNumber, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ref, refI, refUnits, refRecipes } from '../firebase/index';
import Recipes from '../firebase/recipes';
import { FieldTimeOutlined } from '@ant-design/icons';


const { Option } = Select;
const formIngredients={
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 3,
    offset: 0
  },
}
const formIngredients1={
  
  wrapperCol: {
    span: 10,
    offset: 7
  },
}
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 10,
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 10,
    offset: 7
  },
};
const formButton = {
  wrapperCol: {
    span: 15,
    offset: 9
  },
};
const formButtonSubmite = {
  wrapperCol: {
    span: 10,
    offset: 9
  },
};
class RecipesForm extends Component {

  initialState = {
    chefNames: [],
    ingredientNames: [],
    unitNames: [],

    pictures: [],
    uploadValue: 0,


    recipe: '',
    aux: [],

  };
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.listChefs = null;
    this.listIngredients = null;
    this.listUnits = null;
  }
  formRef = React.createRef();
  onReset = () => {
    this.formRef.current.resetFields();
  };


  handleSubmit = values => {
    //console.log(values);
    if (!this.props.recipe) {
      Recipes.add(values)
      this.formRef.current.resetFields();      
    } else {
      Recipes.onUpdate(this.props.recipe.key, values)
    }
  }


  onCollectionUpdate = (querySnapshot) => {
    const chefNames = [];
    Recipes.viewChefs(querySnapshot, chefNames)
    this.setState({
      chefNames
    });
  }
  componentDidMount() {
    this.listChefs = ref.onSnapshot(this.onCollectionUpdate);
    this.listIngredients = refI.onSnapshot(this.onCollectionI);
    this.listUnits = refUnits.onSnapshot(this.onCollectionU);
  }
  onCollectionI = (querySnapshot) => {
    const ingredientNames = [];
    Recipes.viewIngredients(querySnapshot, ingredientNames)
    this.setState({
      ingredientNames
    });
  }
  onCollectionU = (querySnapshot) => {
    const unitNames = [];
    Recipes.viewIngredients(querySnapshot, unitNames)
    this.setState({
      unitNames
    });
  }


  render() {


    const { buttonText, title, recipe = {}, } = this.props;
    //console.log('receta', recipe);

    return (

      <React.Fragment>
        <div>

        </div>

        <Form  {...formItemLayout}
          ref={this.formRef}
          onFinish={this.handleSubmit}
          scrollToFirstError
          initialValues={{
            name: recipe.name,
            chef: recipe.chef,
            description: recipe.description,
            category: recipe.category,
            servings: recipe.servings,
            time: recipe.time,
            calories: recipe.calories,
            protein: recipe.protein,
            fat: recipe.fat,
            ingredients: recipe.ingredients || [null],
            ingredient: recipe.ingredient || [null],
            unit: recipe.unit || [null],
            quantity: recipe.quantity || [null],
            steps: recipe.steps || [null]

          }}
        >
          <h1>{title}</h1>
          {console.log('CHEFS:', this.state.chefNames)}
          {console.log('ingredients:', this.state.ingredientNames)}
          {console.log('units:', this.state.unitNames)}
          <Form.Item
            name="name"
            label="Titulo"
            rules={[{
              required: true,
              message: "Ingrese un Nombre a La Receta"
            }]}>
            <Input
              placeholder="Título de la Receta"
            />
          </Form.Item>

          <Form.Item
            name="chef"
            label="Chef"
            hasFeedback
            rules={[{
              required: true,
              message: "Seleccione un Chef"
            }]}
          >
            <Select placeholder="Seleccione un chef"   >
              {this.state.chefNames.map(chef => (
                <Option key={chef.key} >{[chef.name, ' ', chef.lastname]}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripcion"
            rules={[{
              required: true,
              message: "Ingrese descripcion"
            }]}>
            <Input.TextArea
              placeholder="Descripcion..." />
          </Form.Item>


          <Form.Item
            name="category"
            label="Categoria"
            rules={[{
              required: true,
              message: 'Seleccione una Categoría',
              //type: 'array',
            }]}
          >
            <Select placeholder="Elegir una categoría"  >
              <Option value="Almuerzo">Almuerzo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="servings"
            label="Porciones"
            rules={[{
              required: true,
              message: 'Ingresar número de porciones'
            }]}>
            <InputNumber min={1} placeholder="#" />
          </Form.Item>
          <Form.Item

            name="time"
            label="Tiempo"
            rules={[
              {
                required: true,
                message: 'Ingresar minutos de coción'
              }]}>
            <InputNumber min={1} placeholder="minutes" />
          </Form.Item>

          <Form.Item label="Info. Nutricional" >
            <Input.Group compact >
              <Form.Item
                name="calories"
                rules={[{
                  required: true,
                  message: "Ingrese Calorías"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={1} placeholder="%Calories" />
              </Form.Item>
              <Form.Item
                name="protein"
                rules={[{
                  required: true,
                  message: "Ingrese Proteína"
                }]}
                style={{ display: 'inline-block', margin: '0 6px' }}
              >
                <InputNumber min={1} placeholder="%Proteins" />
              </Form.Item>

              <Form.Item
                name="fat"
                rules={[{
                  required: true,
                  message: "Ingrese Grasas"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={1} placeholder="%Fat" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.List name="ingredients" >
            {(fields = [{
              ingredient: null,
              unit: null,
              quantity: null
            }], { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (

                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Ingredientes: ' : ''}
                      required={true}
                    //key={field.key}
                    >
                      <Form.Item
                        {...field}
                        hasFeedback
                        validateTrigger={['onChange', 'onBlur']}
                        style={{ display: 'inline-block', }}
                        name={[field.name, 'ingredient']}
                        fieldKey={[field.fieldKey, 'ingredient']}
                        rules={[{ required: true, message: 'Ingrese un ingrediente' }]}
                        noStyle
                      >
                        <Select placeholder='Ingrediente'  >
                          {this.state.ingredientNames.map(ingredients => (
                            <Option key={ingredients.key}>{ingredients.name}</Option>
                          ))}
                        </Select>

                      </Form.Item>
                      <Form.Item
                        {...field}
                        hasFeedback
                        validateTrigger={['onChange', 'onBlur']}
                        name={[field.name, 'unit']}
                        style={{ display: 'inline-block', }}
                        fieldKey={[field.fieldKey, 'unit']}
                        rules={[{ required: true, message: 'Ingrese la unidad del ingrediente' }]}
                        noStyle
                      >
                        <Select placeholder="Unidad del Ingrediente"  >
                          {this.state.unitNames.map(units => (
                            <Option key={units.key}>{units.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        name={[field.name, 'quantity']}
                        style={{ display: 'inline-block', }}
                        fieldKey={[field.fieldKey, 'quantity']}
                        rules={[{ required: true, message: 'Ingrese la cantidad del ingrediente' }]}
                        noStyle
                      >
                        <InputNumber min={1} placeholder="Cantidad" />
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
                      block
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

          <Form.List name="steps" >
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Procedimiento: ' : ''}
                      required={true}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Ingrese un procedimiento",
                          },
                        ]}
                        noStyle
                      >
                        <Input.TextArea placeholder="Procedimiento" style={{ width: '95%' }} />
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
                      block
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

          <Form.Item {...formButtonSubmite}>
            <Button type="primary" htmlType="submit">
              {buttonText}
            </Button>
          </Form.Item>

        </Form>
      </React.Fragment>
    );
  };
}

export default compose(withRouter)(RecipesForm);
/*

<Form.Item
            name="category"
            label="Categoria"
            rules={[{
              required: true,
              message: 'Seleccione una Categoría',
              type: 'array',
            }]}
          >
            <Select mode="multiple" placeholder="Elegir una categoría"  >
              <Option value="Desayuno">Desayuno</Option>
              <Option value="Almuerzo">Almuerzo</Option>
              <Option value="Cena">Cena</Option>
            </Select>
          </Form.Item>
*/
