import React, { Component } from 'react';
import { Button, Row, Col, Checkbox, Form, Input, message, Typography, Modal, notification  } from 'antd';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase';
import { withRouter } from 'react-router-dom';
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
    password: ''
  };
  

  constructor( props ) {
    super( props );
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
      message.success('Listo! Te enviamos un correo con el link para restablecer tu contraseña en unos segundos');
      this.openNotificationWithIcon('info');
      this.setModal2Visible(false);
    })
    .catch(error => {
      if(!error){
        message.error('Verifique que el correo sea el correcto');
      }
    })
    
}
openNotificationWithIcon = type => {
  notification[type]({
    message: 'Recuerda!',
    description:
      'Si no encuentras el correo de reestablecer contraseña entre los principales, revisa en tu bandeja de Correos No Deseados o Spam y configuralos para que en próximas ocasiones te aparezca entre los principales ',
    duration: 20,
   });
};
openNotification = () => {
  const args = {
    message: 'Recuerda!',
    description:
      'Si no encuentras el correo de reestablecer contraseña entre los principales, revisa en tu bandeja de Correos No Deseados o Spam y oonfiguralos para que en proximas ocasiones te aparezca entre los principales ',
    duration: 20,
  };
  notification.open(args);
};

  handleSubmit = values => {
   
        console.log( 'Received values of form: ', values );
        const { email, password } = values;

        doSignInWithEmailAndPassword( email, password )
          .then( async (authUser) => {
            /* Codigo para autentificar el admin  
            const idTokenResult = authUser.getIdTokenResult();

            if(!!idTokenResult.claims.admin) {
            this.props.startSetLoginState( authUser.uid );
            window.location.reload();  
          } */
          this.props.startSetLoginState( authUser.uid );
          window.location.reload();  

          /*else {
            // muestra error de permiso denegado
            console.log( 'Acceso denegado')
            message.error("Acceso Denegado!")
          }*/
            
          } )
          .catch( error => {
            console.log( 'error', error );
            message.error( translateMessage( error.code ) );
           
          } );
     
  };

  render() {
    const { LoginTitle } = this.props;

  
    return (
      <React.Fragment>



        <Row>
      
      <Col span={12} offset={6}>

      <Title >{LoginTitle}</Title>
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
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Recordarme</Checkbox>
        </Form.Item>

       
      </Form.Item>

      <Form.Item >
        <Button 
        type="primary" 
        htmlType="submit" 
        className="login-form-button">
          Ingresar
        </Button>
      </Form.Item>
    </Form>
    <Button wrapperCol={{ ...layout.wrapperCol, offset: 6 }} type="link" onClick={() => this.setModal2Visible(true)}>Olvide la contraseña!</Button>


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
    



  
      </Col>
      
      
    </Row>




      

    </React.Fragment>
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