import React from 'react';
import { Result, Button } from 'antd';
import { SmileOutlined, SyncOutlined, } from '@ant-design/icons';

const Loading = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>
      <Result
        icon={<SyncOutlined />}
        title="Loading.... Please wait.."
      />

    </div>;
  }
  // Handle the error state
  else if (error) {
    return  <div>
        <Result
          status="500"
          title="Sorry, there was a problem loading the page."
        />
        {console.log("error", error)}
        

    </div>;
  } else {
    return null;
  }
};

export default Loading;