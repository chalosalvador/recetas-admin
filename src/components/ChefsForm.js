
import React, { Component } from 'react';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd';
import { withRouter } from 'react-router-dom';
import app, { firestore } from 'firebase/app';
//import { addChef } from '../firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { translateMessage } from '../helpers/translateMessage';

const hasErrors = ( fieldsError ) => {
  return Object.keys( fieldsError ).some( field => fieldsError[ field ] );
};

class ChefsForm extends Component {

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

  updateInputName=( e )=>{
    this.setState({
      Chefname: e.target.value
    });
  }
  
  updateInputSpecialism=( e )=>{
    this.setState({
      specialism: e.target.value
    });
  }
  updateInputExperience=( e )=>{
    this.setState({
      experience: e.target.value
    });
  }
  updateInputJob=( e )=>{
    this.setState({
      job: e.target.value
    });
  }
  updateInputNationality=( e )=>{
    this.setState({
      nationality: e.target.value
    });
  }

  handleSubmit = ( e ) => {
    e.preventDefault();
    
       /*
        db.settings({
            timestampsInSnapshots:true
          });
        */

        const db = app.firestore();

        //const {Chefname, specialism, experience, job, nationality}= values;
        const addChef= db.collection("chefs").add({Chefname: this.state.Chefname, specialism: this.state.specialism, experience: this.state.experience, job: this.state.job, nationality: this.state.nationality});
     
        this.setState({Chefname: "", specialism: "", experience: "", job: "", nationality:""})
        
  };



  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const {formTitle, buttonText} = this.props;
    
    const { Chefname, specialism, experience, job, nationality } = this.state;

    
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
                message: 'Ingresa texto válido'
              },
              {
                required: true,
                message: 'Ingresa nombres completos'
              }
            ]
          } )(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Nombre Completos' 
                       onChange= {this.updateInputName}
                       value={Chefname}
                       />
          )}
        </Form.Item>
        <Form.Item validateStatus={ specialismError
          ? 'error'
          : '' }
                   help={ specialismError || '' }>
          { getFieldDecorator( 'specialism', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido'
              },
              {
                required: true,
                message: 'Ingresa Epecialidad en comida'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Especialidad'
                       onChange= {this.updateInputSpecialism}
                       value={specialism}
                        />
          )}
        </Form.Item>
        <Form.Item validateStatus={ experienceError
          ? 'error'
          : '' }
                   help={ experienceError || '' }>
          { getFieldDecorator( 'experience', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa numero de años válidos'
              },
              {
                message: 'Ingresa años de experiencia laboral',
                required: true
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Numero de Años laboral' 
                       onChange= {this.updateInputExperience}
                       value={experience}
                       />
          )}
        </Form.Item>
        <Form.Item validateStatus={ jobError
          ? 'error'
          : '' }
                   help={ jobError || '' }>
          { getFieldDecorator( 'job', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido'
              },
              {
                required: true,
                message: 'Ingresa empleo actual'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Trabajo Actual' 
                       onChange= {this.updateInputJob}
                       value={job}
                       />
          )}
        </Form.Item>
        <Form.Item validateStatus={ nationalityError
          ? 'error'
          : '' }
                   help={ nationalityError || '' }>
          { getFieldDecorator( 'nationality', {
            rules: [
              {
                type: 'text',
                message: 'Ingresa texto válido'
              },
              {
                required: true,
                message: 'Ingresa nacionalidad'
              }
            ]
          } )(
            <Input prefix={ <Icon type='text' style={ { color: 'rgba(0,0,0,.25)' } } /> }
                       type='text'
                       placeholder='Nacionalidad' 
                       onChange= {this.updateInputNationality}
                       value={nationality}
                       />
          )}
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
