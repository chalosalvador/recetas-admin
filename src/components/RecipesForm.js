import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { Form, Select, Input, InputNumber, Button, Divider, notification, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ref, refI, refUnits, refRecipes, db, createAt } from '../firebase/index';
import Recipes from '../firebase/recipes';
import ingredientS from '../firebase/ingredients';
import { FieldTimeOutlined } from '@ant-design/icons';
import Ingredients from '../firebase/ingredients';
import Title from 'antd/lib/typography/Title';


const { Option } = Select;
const formIngredients = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 3,
    offset: 0
  },
}
const formIngredients1 = {

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
    NEWingredient: ''

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
    console.log(values);
    const referenciaChef = ref.doc(values.chef)
    const currentRecipe = {
      ...values,
      createAt,
      chef: referenciaChef,
      ingredients: values.ingredients.map((ingredientData, index) => {
        //console.log("ref ingrediente",ingredientData.ingredient);
        //console.log("ref ingrediente",refI.doc(ingredientData.ingredient));
       return {
          ...ingredientData,
          ingredient: refI.doc(ingredientData.ingredient),
          unit: refUnits.doc(ingredientData.unit),
        }
      })
    }
//    values.createAt= createAt;
    

    
    //recipe.chef = referencia

    if (!this.props.recipe) {

      Recipes.add(currentRecipe)
      message.loading( 'Cargando...', 1.5).then(()=> message.success('Registro Exitoso!'))
      this.formRef.current.resetFields();
    } else {
      Recipes.onUpdate(this.props.recipe.key, currentRecipe)
      message.loading( 'Cargando...', 1.5).then(()=> message.success('Actualización Exitosa!'))
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
  onNameChange = event => {
    this.setState({
      NEWingredient: event.target.value,
    });
  };
  addIng = () => {
    if (this.state.NEWingredient == "") {
      console.log("VACIO")
      message.error('Ingrese un nombre para agregarlo',);
    } else {
      const valor = (ingredientNames) => ingredientNames.name === this.state.NEWingredient;

      if (this.state.ingredientNames.some(valor) === true) {
        console.log(this.state.ingredientNames.some(valor), "Ya existe")    
        message.error('Ese elemento ya existe. Por favor agregar uno nuevo o buscar entre las opciones',);
          
      }else {
        console.log("No existe ")
        Ingredients.addIngredient({ name: this.state.NEWingredient })
       // message.success('Se agrego el elemento con exito!');
        message.loading( 'Cargando...', 1.5).then(()=> message.success('Se agrego el elemento con exito!'))
      }
    }
  };

  render() {


    const { buttonText, title, recipe = {}, } = this.props;
    console.log('receta', recipe);
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
            nutritionFacts: recipe.nutritionFacts,
            ingredients: recipe.ingredients || [null],
            ingredient: recipe.ingredient || [null],
            unit: recipe.unit || [null],
            quantity: recipe.quantity || [null],
            steps: recipe.steps || [null],
            createAt: "",
          }}
        >
          <Title level={4}>{title}</Title>

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
            <Select placeholder="Seleccione un chef">
              {this.state.chefNames.map(chef => (
                <Option key={chef.key} >{`${chef.name} ${chef.lastname}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripcion/Nota"
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

          <Form.Item
            label="Info. Nutricional"
            rules={[{
              type: 'array',
            }]}>
            <Input.Group compact >
              <Form.Item
                name={["nutritionFacts", "calories"]}
                extra="%Calorias"
                rules={[{
                  required: true,
                  message: "Ingrese Calorías"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={0} placeholder="%Calories" />
              </Form.Item>
              <Form.Item
                name={["nutritionFacts", "protein"]}
                extra="%Proteinas"
                rules={[{
                  required: true,
                  message: "Ingrese Proteína"
                }]}
                style={{ display: 'inline-block', margin: '0 6px' }}
              >
                <InputNumber min={0} placeholder="%Proteins" />
              </Form.Item>

              <Form.Item
                name={["nutritionFacts", "fat"]}
                extra="%Grasas"
                rules={[{
                  required: true,
                  message: "Ingrese Grasas"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={0} placeholder="%Fat" />
              </Form.Item>
            </Input.Group  >
          </Form.Item>

          <Form.List name="ingredients" >
            {(fields
              , { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (

                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Ingredientes: ' : ''}
                      required={true}
                    key={field.key}
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
                        <Select placeholder='Ingrediente'
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <Divider style={{ margin: '4px 0' }} />
                              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input style={{ flex: 'auto' }} value={this.state.NEWingredient} onChange={this.onNameChange} />
                                <a
                                  style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                  onClick={this.addIng}
                                >
                                  <PlusOutlined /> Agregar Ingrediente
                              </a>
                              </div>
                            </div>
                          )}
                        >
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
          <Form.Item
          name="createAt">
          <Input
            placeholder='createAt'
            disabled
            hidden
          />
        </Form.Item>

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

        /////////////////////////////////////


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
        */
