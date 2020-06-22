import React, { Component } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { doSignInWithEmailAndPassword } from '../firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { UserOutlined, LockOutlined } from '@ant-design/icons';




const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class LoginForm extends Component {

  initialState = {
    email: '',
    password: ''
  };
  

  constructor( props ) {
    super( props );
    this.state = this.initialState;
  }


  handleSubmit = values => {
   
        console.log( 'Received values of form: ', values );
        const { email, password } = values;

        doSignInWithEmailAndPassword( email, password )
          .then( async (authUser) => {
            /* Codigo para autentificar el admin  */
            const idTokenResult = authUser.getIdTokenResult();

            if(!!idTokenResult.claims.admin) {
            this.props.startSetLoginState( authUser.uid );
            window.location.reload();  
          } else {
            // muestra error de permiso denegado
            console.log( 'Acceso denegado')
          }
            
          } )
          .catch( error => {
            console.log( 'error', error );
            message.error( translateMessage( error.code ) );
          } );
     
  };

  render() {
  
    return (
      <Form
      {...layout}
      name="normal_login"
      initialValues={{ remember: true }}
      onFinish={this.handleSubmit}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'Ingresa un correo electrónico válido',
          },
          {
            required: true,
            message: 'Ingresa el correo electrónico',
          },
        ]}
      >
        <Input 
        prefix={<UserOutlined className="site-form-item-icon" />} 
        type="email"
        placeholder="Correo" 
        autoComplete="email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Ingresa la clave' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Recordarme</Checkbox>
        </Form.Item>

       
      </Form.Item>

      <Form.Item>
        <Button 
        type="primary" 
        htmlType="submit" 
        className="login-form-button">
          Ingresar
        </Button>
      </Form.Item>
    </Form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetLoginState: ( uid ) => dispatch( startSetLoginState( uid ) )
});

export default compose(
  withRouter,
  connect( null, mapDispatchToProps )
)( LoginForm );