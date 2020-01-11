import React, { useState } from 'react';
import Header from './Header';
// import Button from '@material-ui/core/Button';
// import Maps from './Maps';
import Banner from './Banner';
import GoogleMaps from './GoogleMaps';

const STYLE_APP: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: '100%',
  height: '100%',
};

const STYLE_CONTAINER: React.CSSProperties = {
  display: 'flex',
  height: '100%',
};

export interface ResType {
  userName: string;
  latHome: string;
  longHome: string;
  latWork: string;
  longWork: string;
}

const App = () => {
  const [usersData, setUsersData] = useState<ResType[] | undefined>();
  const [checkBox, setCheckBox] = useState({
    house: false,
    work: false,
  });

  return (
    <div style={STYLE_APP}>
      <Header />
      <div style={STYLE_CONTAINER}>
        <Banner
          checkBox={checkBox}
          setCheckBox={setCheckBox}
          usersData={usersData}
          setUsersData={setUsersData}
        />
        <GoogleMaps checkBox={checkBox} usersData={usersData} />
      </div>
    </div>
  );
};

export default App;
