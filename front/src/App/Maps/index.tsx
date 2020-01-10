import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import { Map, GoogleApiWrapper, GoogleAPI } from 'google-maps-react';

// const mapStyles: React.CSSProperties = {
//   width: '100%',
//   height: '100%',
// };

interface IProps {
  google: GoogleAPI;
}

const Maps = ({ google }: IProps) => {
  // const classes = useStyles();
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <Map
        google={google}
        zoom={14}
        // style={mapStyles}
        initialCenter={{
          lat: -1.2884,
          lng: 36.8233,
        }}
      />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'YOUR_GOOGLE_API_KEY_GOES_HERE',
})(Maps);
