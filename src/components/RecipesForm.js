import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { Form, Select, Input, InputNumber, Button, Divider, notification, message, Upload, Image, Progress } from 'antd';
import { FieldTimeOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { ref, refI, refUnits, refRecipes, db, createAt, storage } from '../firebase/index';
import Recipes from '../firebase/recipes';
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

    uploadValue: 0,
    picture: this.props.recipe ? this.props.recipe.picture : "data:image/png;base64,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",


    recipe: '',
    NEWingredient: ''
  };
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.listChefs = null;
    this.listIngredients = null;
    this.listUnits = null;
    this.handleUpload = this.handleUpload.bind(this);
  }

  onChange(value) {
    console.log(`selected ${value}`);
  }
  
  onBlur() {
    console.log('blur');
  }
  
  onFocus() {
    console.log('focus');
  }
  
  onSearch(val) {
    console.log('search:', val);
  }


  handleUpload(event) {
    const file = event.target.files[0];
    if (file.type !== 'image/png') {
      message.error(`${file.name} no es un archivo tipo Imagen PNG. Por favor seleccione otra imagen`);
  
    }else{
    //const storageRef= app.storage().ref(`Images/${file.name}`);
    const task = storage.ref(`Images/${file.name}`).put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    },
      async () => {
        this.setState({
          uploadValue: 100,
          //picture: task.snapshot.downloadURL
          picture: await task.snapshot.ref.getDownloadURL(),

        });
      });
  }
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

      picture: this.state.picture,

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
    console.log("link", this.state.picture)


    //recipe.chef = referencia

    if (!this.props.recipe) {

      Recipes.add(currentRecipe)
      this.setState({
        uploadValue: 0,
        picture: "data:image/png;base64,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"

      });
      message.loading('Cargando...', 1.5).then(() => message.success('Registro Exitoso!'))
      this.formRef.current.resetFields();
    } else {
      Recipes.onUpdate(this.props.recipe.key, currentRecipe)
      message.loading('Cargando...', 1.5).then(() => message.success('Actualización Exitosa!'))
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
      message.error('Ingrese un nombre para agregarlo', );
    } else {
      const valor = (ingredientNames) => ingredientNames.name === this.state.NEWingredient;

      if (this.state.ingredientNames.some(valor) === true) {
        console.log(this.state.ingredientNames.some(valor), "Ya existe")
        message.error('Ese elemento ya existe. Por favor agregar uno nuevo o buscar entre las opciones', );

      } else {
        console.log("No existe ")
        Ingredients.addIngredient({ name: this.state.NEWingredient })
        // message.success('Se agrego el elemento con exito!');
        message.loading('Cargando...', 1.5).then(() => message.success('Se agrego el elemento con exito!'))
      }
    }
  };

  render() {


    const { buttonText, title, recipe = {}, } = this.props;
    console.log('receta', recipe);
    return (

      <React.Fragment>
        <div>
          {console.log("picture", recipe.picture)}


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
            picture: recipe.picture
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
            <Select 
             showSearch
             onChange={this.onChange}
             onFocus={this.onFocus}
             onBlur={this.onBlur}
             onSearch={this.onSearch}
             optionFilterProp="children"
             filterOption={(input, option) =>
               option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
             }
            placeholder="Seleccione un chef">
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
            extra="Rango (1-50)"
            rules={[{
              required: true,
              message: 'Ingresar número de porciones'
            }]}>
            <InputNumber min={1} max={50} placeholder="#"  />
          </Form.Item>
          <Form.Item

            name="time"
            label="Tiempo"
            extra="Rango (1-420)"
            rules={[
              {
                required: true,
                message: 'Ingresar minutos de coción'
              }]}>
            <InputNumber min={1} max={420} placeholder="minutes" />
          </Form.Item>

          <Form.Item
            label="Info. Nutricional"
            rules={[{
              type: 'array',
            }]}>
            <Input.Group compact >
              <Form.Item
                name={["nutritionFacts", "calories"]}
                extra="%Calorias(0-100)"  
                rules={[{
                  required: true,
                  message: "Ingrese Calorías"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={0}  max={100}  placeholder="%Calories" />
              </Form.Item>
              <Form.Item
                name={["nutritionFacts", "protein"]}
                extra="%Proteinas(0-100)"
                rules={[{
                  required: true,
                  message: "Ingrese Proteína"
                }]}
                style={{ display: 'inline-block', margin: '0 6px' }}
              >
                <InputNumber min={0} max={100} placeholder="%Proteins" />
              </Form.Item>

              <Form.Item
                name={["nutritionFacts", "fat"]}
                extra="%Grasas(0-100)"
                rules={[{
                  required: true,
                  message: "Ingrese Grasas"
                }]}
                style={{ display: 'inline-block', }}
              >
                <InputNumber min={0} max={100}  placeholder="%Fat" />
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
                      {...(index === 0  ? formItemLayout : formItemLayoutWithOutLabel)}
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
                        <Select
                          showSearch
                          onChange={this.onChange}
                          onFocus={this.onFocus}
                          onBlur={this.onBlur}
                          onSearch={this.onSearch}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }

                          placeholder='Ingrediente'
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <Divider style={{ margin: '4px 0' }} />
                              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input style={{ flex: 'auto' }} value={this.state.NEWingredient} onChange={this.onNameChange}
                                  xs={2} sm={4} md={6} lg={8} xl={10} />
                                <a
                                  xs={2} sm={4} md={6} lg={8} xl={10}
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
                        <Select 
                        placeholder="Unidad del Ingrediente"  
                        showSearch
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onSearch={this.onSearch}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        >
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
                        extra="Rango (1-800)"
                        noStyle
                      >
                        <InputNumber min={1} max={800}  placeholder="Cantidad" />
                      </Form.Item>
                      {fields.length > 1  ? (
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
                  <Form.Item {...formButton} xs={2} sm={4} md={6} lg={8} xl={10}>
                  {fields.length <= 19 ?(
                    <Button
                    block
                    onClick={() => {
                      add();
                    }}
                    style={{ width: '50%' }}
                  >
                    <PlusOutlined />Ingrediente
              </Button>
                   ): null }
                    
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
                  {fields.length <= 9 ?(

                    <Button
                      block
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '50%' }}
                      xs={2} sm={4} md={6} lg={8} xl={10}
                    >
                      <PlusOutlined />Procedimiento
                </Button>
                  ): null} 
                    
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>

          <Form.Item {...formItemLayout}
            name="picture"
            label="Imagen "
            rules={[{
              required: false,
            }]}
          >
            <Input type="file" onChange={this.handleUpload} icon={<CloudUploadOutlined />} />
            <Progress percent={this.state.uploadValue} max="100" />
            <Image width={200} height={200}
              //fallback="data:image/png;base64,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"
              alt="imagen"
              height="300"
              width="400"
              src={this.state.picture} />
          </Form.Item>

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


          <progress value={this.state.uploadValue} max="100"></progress>
          <br/>
          <input type="file" onChange={this.props.onUpload}/> 
          <br/>
          <img width="320" src={this.state.picture} alt=""/>
          


          <Upload>
            
          </Upload>


<Input type="file" onChange={this.handleUpload} icon={<CloudUploadOutlined />} /> <progress  value={this.state.uploadValue} width={100} max="100" />
          
        */
