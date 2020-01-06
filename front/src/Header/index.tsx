import React from 'react';
import { PRIMARY_COLOR } from '../theme';
// import Button from '@material-ui/core/Button';

const Header = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR,
      }}
    >
      <h1>Mobilitix</h1>
    </header>
  );
};

export default Header;
