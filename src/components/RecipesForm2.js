import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { startSetLoginState } from '../actions/authActions';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { refI, refUnits } from '../firebase/index';
import Recipes from '../firebase/recipes';



const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};


class RecipesForm2 extends Component {

  initialState = {
    pictures: [],

  };
  constructor(props) {
    super(props);
    this.state = this.initialState;


  }


  handleSubmit = values => {
    console.log(values);

    //const ingredientesData = { title: this.state.title, description: this.state.description, time: this.state.time, category: this.state.category };

    //Recipes.add(ingredientesData)


    // this.formRef.current.resetFields();
  };



  render() {


    const { title } = this.props;
    return (

      <React.Fragment>
        <div>
          <h1>{title}</h1>
        </div>
        <Upload {...props}>
          <Button>
            <UploadOutlined /> Click to Upload
          </Button>
        </Upload>

      </React.Fragment>
    );
  };

}

export default compose(withRouter)(RecipesForm2);
