import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
    }}
  >
    <CircularProgress />
  </div>
);

export default LoadingSpinner;
