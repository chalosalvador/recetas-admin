import React, { Component } from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { saveChefsData } from '../firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';

const hasErrors = ( fieldsError ) => {
  return Object.keys( fieldsError ).some( field => fieldsError[ field ] );
};

class ChefsForm extends Component {

  initialState = {
    nombre: '',
    autor: '',
    ingredientes: '',
    procedimiento: '',
    tiempo:''

  };

  constructor( props ) {
    super( props );
    this.state = this.initialState;
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFields( ( err, values ) => {
      if( !err ) {
        console.log( 'Received values of form: ', values );
        const { nombres, especialidad, experiencia, trabajoActual, nacionalidad } = values;


        saveChefsData(nombres, especialidad, experiencia, trabajoActual, nacionalidad)

          .catch( error => {
            console.log( 'error', error );
            message.error( translateMessage( error.code ) );
          });
      };
    } );
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const {formTitle, buttonText} = this.props;

    // Only show error after a field is touched.
    const nombresError = isFieldTouched( 'nombres' ) && getFieldError( 'nombres' );
    const especialidadError = isFieldTouched( 'especialidad' ) && getFieldError( 'especialidad' );
    const experienciaError = isFieldTouched( 'experiencia' ) && getFieldError( 'experiencia' );
    const trabajoActualError = isFieldTouched( 'trabajoActual' ) && getFieldError( 'trabajoActual' );
    const nacionalidadError = isFieldTouched( 'nacionalidad' ) && getFieldError( 'nacionalidad' );


    return (



      <Form onSubmit={ this.handleSubmit } >

          <h1>{formTitle}</h1>
      
        <Form.Item validateStatus={ nombresError
          ? 'error'
          : '' }
                   help={ nombresError || '' }>
          { getFieldDecorator( 'nombres', {
            rules: [
              {
                type: 'text',
                required: true,
                value: 'nombres',
                message: 'Ingresa texto válido'
              }
            ]
          } )(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Nombre Completos' />
          ) }
        
        </Form.Item>
        <Form.Item validateStatus={ especialidadError
          ? 'error'
          : '' }
                   help={ especialidadError || '' }>
          { getFieldDecorator( 'especialidad', {
            rules: [
              {
                type: 'text',
                value: 'especialidad',
                required: true,
                message: 'Ingresa texto válido'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Especialidad' />
          ) }
        
        </Form.Item>
        <Form.Item validateStatus={ experienciaError
          ? 'error'
          : '' }
                   help={ experienciaError || '' }>
          { getFieldDecorator( 'experiencia', {
            rules: [
              {
                type: 'number',
                message: 'Ingresa numero de años válidos',
                required: true,
                value: 'experiencia',
              }
            ]
          } )(
            <Input prefix={ <Icon type='number' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='number'
                       placeholder='' />
          ) }


        </Form.Item>
        <Form.Item validateStatus={ trabajoActualError
          ? 'error'
          : '' }
                   help={ trabajoActualError || '' }>
          { getFieldDecorator( 'trabajoActual', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido',
                required: true,
                value: 'trabajoActual',
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Trabajo Actual' />
          ) }
        
        </Form.Item>
        <Form.Item validateStatus={ nacionalidadError
          ? 'error'
          : '' }
                   help={ nacionalidadError || '' }>
          { getFieldDecorator( 'nacionalidad', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido',
                required: true,
                value: 'nacionalidad',
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Nacionalidad' />
          ) }
        
        </Form.Item>
        <Form.Item>
          
          <Button type='primary'
                  htmlType='submit'
                  className='chefs-form-button'
                  disabled={ hasErrors( getFieldsError() ) }
                  onClick={this.handleSubmit}> {buttonText} </Button>
        </Form.Item>
      </Form>
    );
  }
}


export default compose(withRouter, Form.create({name:'chef_form'}))(ChefsForm);
