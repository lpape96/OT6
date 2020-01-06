import React, { useState } from 'react';
import { compose, withProps } from 'recompose';
import House from '@material-ui/icons/House';
import Work from '@material-ui/icons/Work';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
  InfoWindow,
} from 'react-google-maps';
import InfoBoxDemo from './InfoBoxDemo';
import MarkerClustererDemo from './MarkerClustererDemo';
// import DirectionsDemo from './DirectionsDemo';

interface IProps {
  checkBox: { house: boolean; work: boolean };
}

const GoogleMaps = compose<any, IProps>(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '100%', flex: 1 }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(({ checkBox }: IProps) => {
  const [isOpen, setIsOpen] = useState({
    house: false,
    work: false,
  });

  const onToggleOpen = (name: string) => (event?: google.maps.MouseEvent) => {
    setIsOpen({ ...isOpen, [name]: !!event });
  };

  return (
    <GoogleMap defaultZoom={13} defaultCenter={{ lat: 45.75, lng: 4.85 }}>
      {checkBox.house && (
        <Marker
          position={{ lat: 45.76, lng: 4.86 }}
          onClick={onToggleOpen('house')}
        >
          {isOpen.house && (
            <InfoWindow onCloseClick={onToggleOpen('house')}>
              <House />
            </InfoWindow>
          )}
        </Marker>
      )}
      {checkBox.work && (
        <Marker
          position={{ lat: 45.78, lng: 4.88 }}
          onClick={onToggleOpen('work')}
        >
          {isOpen.work && (
            <InfoWindow onCloseClick={onToggleOpen('work')}>
              <Work />
            </InfoWindow>
          )}
        </Marker>
      )}
      <InfoBoxDemo />
      <MarkerClustererDemo />
      <Circle
        defaultCenter={{ lat: 45.75, lng: 4.85 }}
        radius={2000}
        visible={true}
        onDblClick={(e: google.maps.MouseEvent) => {
          e.stop();
          console.log('clicked');
        }}
      />
      {/* <DirectionsDemo /> */}
    </GoogleMap>
  );
});

export default GoogleMaps;
