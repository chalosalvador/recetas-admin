import React, { Component } from 'react';
import { Button, Form, Input, message, InputNumber } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { ref } from '../firebase/index';

import Chefs from '../firebase/chefs';


const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 10 },
};


class ChefsForm extends Component {

  initialState = {
    name: '',
    lastname: '',
    speciality: '',
    experience: '',
    job: '',
    nationality: '',
    chef: ''

  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  formRef = React.createRef();
  onReset = () => {
    this.formRef.current.resetFields();
  };
  

  handleSubmit = values => {

    if (!this.props.chef) {
      Chefs.add(values)
      this.formRef.current.resetFields();
    } else {
      Chefs.onUpdate(this.props.chef.key,values)
    }
  };


  render() {
    const { formTitle, buttonText, chef = {} } = this.props;
    console.log('chef', chef);


    return (

      <Form {...layout}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.handleSubmit}
        scrollToFirstError
        initialValues={{
          name: chef.name,
          lastname: chef.lastname,
          speciality: chef.speciality,
          experience: chef.experience,
          job: chef.job,
          nationality: chef.nationality
        }}
      >
        <h1>{formTitle}</h1>


        <Form.Item
          name="name"
          label="Nombre"
          rules={[{
              required: true,
              message: 'Ingresar nombre'
            }]}>

          <Input prefix={<UserOutlined />}
            placeholder='Nombre '
          />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Apellido"
          rules={[ {
              required: true,
              message: 'Ingresar apellido'
            }]}>
          <Input prefix={<UserOutlined />}
            placeholder='Apellido'
          />

        </Form.Item >
        <Form.Item name="speciality" label="Especialidad" 
        rules={[{ 
          required: true, 
          message: 'Ingresar especialidad' }]}>
          <Input
            placeholder='Especialidad'
          />

        </Form.Item>
        <Form.Item
          name="experience"
          label="Años experiencia"
          rules={[{
              required: true,
              message: 'Ingresar años de experiencia'
            }
          ]}>

          <InputNumber min={1} max={40} 
            placeholder="#"
          />

        </Form.Item>
        <Form.Item
          name="job"
          label="Trabajo Actual"
          rules={[{
              required: true,
              message: 'Ingresar trabajo actual'
            }]}>

          <Input
            placeholder='Trabajo Actual'
          />

        </Form.Item>
        <Form.Item
          name="nationality"
          label="Nacionalidad"
          rules={[{
              required: true,
              message: 'Ingresar nacionalidad'
            }]}>
          <Input
            placeholder='Nacionalidad'
          />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary'
            htmlType='submit'
          >
            {buttonText}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


export default compose(withRouter)(ChefsForm);
