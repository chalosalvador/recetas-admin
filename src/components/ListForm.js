
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

class ListForm extends Component {

  initialState = {
    Chefname: '',
    specialism: '',
    experience: '',
    job: '', 
    nationality:''

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
        const { Chefname, specialism, experience, job, nationality } = values;


        saveChefsData(Chefname, specialism, experience, job, nationality)

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
    const ChefnameError = isFieldTouched( 'Chefname' ) && getFieldError( 'Chefname' );
    const specialismError = isFieldTouched( 'specialism' ) && getFieldError( 'specialism' );
    const experienceError = isFieldTouched( 'experience' ) && getFieldError( 'experience' );
    const jobError = isFieldTouched( 'job' ) && getFieldError( 'job' );
    const nationalityError = isFieldTouched( 'nationality' ) && getFieldError( 'nationality' );


    return (



      <Form onSubmit={ this.handleSubmit } >

          <h1>{formTitle}</h1>
      
        <Form.Item validateStatus={ ChefnameError
          ? 'error'
          : '' }
                   help={ ChefnameError || '' }>
          { getFieldDecorator( 'Chefname', {
            rules: [
              {
                type: 'text',
                required: true,
                value: 'Chefname',
                message: 'Ingresa texto válido'
              }
            ]
          } )(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Nombre Completos' />
          ) }
        
        </Form.Item>
        <Form.Item validateStatus={ specialismError
          ? 'error'
          : '' }
                   help={ specialismError || '' }>
          { getFieldDecorator( 'specialism', {
            rules: [
              {
                type: 'text',
                value: 'specialism',
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
        <Form.Item validateStatus={ experienceError
          ? 'error'
          : '' }
                   help={ experienceError || '' }>
          { getFieldDecorator( 'experience', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa numero de años válidos',
                required: true,
                value: 'experience',
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='' />
          ) }


        </Form.Item>
        <Form.Item validateStatus={ jobError
          ? 'error'
          : '' }
                   help={ jobError || '' }>
          { getFieldDecorator( 'job', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido',
                required: true,
                value: 'job',
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Trabajo Actual' />
          ) }
        
        </Form.Item>
        <Form.Item validateStatus={ nationalityError
          ? 'error'
          : '' }
                   help={ nationalityError || '' }>
          { getFieldDecorator( 'nationality', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido',
                required: true,
                value: 'nationality',
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


export default compose(withRouter, Form.create({name:'list_form'}))(ListForm);
