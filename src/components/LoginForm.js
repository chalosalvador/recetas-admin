import React, { Component } from 'react';
import { Button, Checkbox, Form, Input, message, Typography, Modal } from 'antd';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const { Title } = Typography;

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
    password: '',
    reset: ''
  };


  constructor(props) {
    super(props);
    this.state = this.initialState;
  }
  
 

  onResetChange = event => {
    this.setState({
      reset: event.target.value,
    });
  };

  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  
  ResetPassw = () => {
    
      console.log(this.state.reset)
      doPasswordReset(this.state.reset)
      .then(success=>{
        message.success('Listo! Revisa tu bandeja, enviamos un correo con el link para restablecer tu contraseña');
        this.setModal2Visible(false);
      })
      .catch(error => {
        if(!error){
          message.error('Verifique que el correo sea el correcto');
        }
      })
      
      
  }
  
  handleSubmit = values => {

    console.log('Received values of form: ', values);
    const { email, password } = values;

    doSignInWithEmailAndPassword(email, password)
      .then(async (authUser) => {
        /* Codigo para autentificar el admin  */
        const idTokenResult = authUser.getIdTokenResult();

        if (!!idTokenResult.claims.admin) {
          this.props.startSetLoginState(authUser.uid);
          window.location.reload();
        } else {
          // muestra error de permiso denegado
          console.log('Acceso denegado')
          message.error("Acceso Denegado!")
        }

      })
      .catch(error => {
        console.log('error', error);
      });

  };

  render() {
    const { LoginTitle } = this.props;

    return (
      <React.Fragment>
        <Title level={4}>{LoginTitle}</Title>
        <br />

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
            <Button type="link" onClick={() => this.setModal2Visible(true)}>Olvide la contraseña!</Button>

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
            <br />


          </Form.Item>
        </Form>

        <Modal
          title="Restablecer contraseña"
          centered
          visible={this.state.modal2Visible}
          footer={[
            <Button key="back" onClick={() => this.setModal2Visible(false)}>Regresar</Button>,
            <Button type="primary" htmlType="submit" onClick={this.ResetPassw}>Restablecer</Button>
          ]}
        >
        <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="ejemplo@hotmail.com"
            value={this.state.reset}
            onChange={this.onResetChange}
            required
          />
          

        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startSetLoginState: (uid) => dispatch(startSetLoginState(uid))
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(LoginForm);
