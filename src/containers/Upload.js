import React from 'react';
import app, { firestore } from 'firebase/app';
import { Result, Button, Link, Progress, Input, message  } from 'antd';

const formButtonSubmite = {
  wrapperCol: {
    span: 10,
    offset: 9
  },
};

class Upload extends React.Component {
  
   
  constructor(props) {
    super(props);
    this.state={
      uploadValue: 0,
      picture: null 
  };

  this.handleUpload= this.handleUpload.bind(this);
}

handleUpload(event){
  const file= event.target.files[0];
  const storageRef= app.storage().ref(`Images/${file.name}`);
  const task= storageRef.put(file);
  
  task.on('state_changed', snapshot =>{
    let percentage= ( snapshot.bytesTransferred / snapshot.totalBytes) *100;
    this.setState({
      uploadValue: percentage
    })
  }, error=>{ console.log(error.message) },
  () => {
    this.setState({
      uploadValue: 100,
      picture: task.snapshot.downloadURL
    });
  });
}

  render() {
    return (
      <React.Fragment>
        
        <div {...formButtonSubmite}>
          
          <br/>
          <Input type="file" onChange={this.handleUpload}/> <progress  value={this.state.uploadValue} max="100" />
          <br/>
          <img width="320" src={this.state.picture} alt=""/>
          

        </div>

      </React.Fragment>
    );
  }
}

export default Upload;