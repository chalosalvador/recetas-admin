import React from 'react';
import { Result, Button, Link } from 'antd';
import { HOME } from '../constants/routes';

class NotFoundPage extends React.Component {

  render() {
    return (
      <React.Fragment>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />
      </React.Fragment>
    );
  }
}

export default NotFoundPage;