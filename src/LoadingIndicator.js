/**
 * Created by glenne on 6/17/2017.
 */
import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const style = {
  container: {
    position: 'relative',
    margin: 50
  },
  refresh: {
    display: 'inline-block',
    position: 'relative'
  },
  loading: {
    marginTop: 10
  }
};

const LoadingIndicator = () =>
  <div style={style.container}>
    <RefreshIndicator
      size={40}
      left={10}
      top={0}
      status="loading"
      style={style.refresh}
    />
    <div style={style.loading}>Loading...</div>
  </div>;

export default LoadingIndicator;
