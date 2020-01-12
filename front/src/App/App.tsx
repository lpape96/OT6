import React, { useState } from 'react';
import Header from './Header';
import Banner from './Banner';
import GoogleMaps from './GoogleMaps';
import UsersDataProvider from './UsersDataContext/store';
import PopMessages from './PopMessages';

const STYLE_APP: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: '100%',
  height: '100%',
};

const STYLE_CONTAINER: React.CSSProperties = {
  display: 'flex',
  height: '88.5%',
};

export interface ResType {
  userName: string;
  latHome: string;
  longHome: string;
  latWork: string;
  longWork: string;
  poi: [{ lat: string; lng: string }];
  trace: [{ lat: number; lng: number }];
  covoit?: [{ lat: string; lng: string }];
}

const App = () => {
  const [checkBox, setCheckBox] = useState({
    house: false,
    work: false,
    poi: false,
    trace: false,
  });

  return (
    <UsersDataProvider>
      <PopMessages>
        <div style={STYLE_APP}>
          <Header />
          <div style={STYLE_CONTAINER}>
            <Banner checkBox={checkBox} setCheckBox={setCheckBox} />
            <GoogleMaps checkBox={checkBox} />
          </div>
        </div>
      </PopMessages>
    </UsersDataProvider>
  );
};

export default App;
