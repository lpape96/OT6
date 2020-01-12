import React, { useState } from 'react';
import { compose, withProps } from 'recompose';
import House from '@material-ui/icons/House';
import Work from '@material-ui/icons/Work';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
} from 'react-google-maps';
import { useUsersDataContext } from '../UsersDataContext/store';
// import DirectionsDemo from './DirectionsDemo';

interface IProps {
  checkBox: { house: boolean; work: boolean; poi: boolean; trace: boolean };
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
  const { usersData } = useUsersDataContext();
  const onToggleOpen = (name: string) => (event?: google.maps.MouseEvent) => {
    setIsOpen({ ...isOpen, [name]: !!event });
  };

  return (
    <GoogleMap defaultZoom={13} defaultCenter={{ lat: 45.75, lng: 4.85 }}>
      {checkBox.house && usersData && usersData.length && (
        <Marker
          position={{
            lat: parseFloat(usersData[0].latHome),
            lng: parseFloat(usersData[0].longHome),
          }}
          onClick={onToggleOpen('house')}
        >
          {isOpen.house && (
            <InfoWindow onCloseClick={onToggleOpen('house')}>
              <House />
            </InfoWindow>
          )}
        </Marker>
      )}
      {checkBox.work && usersData && usersData.length && (
        <Marker
          position={{
            lat: parseFloat(usersData[0].latWork),
            lng: parseFloat(usersData[0].longWork),
          }}
          // options={{
          //   icon: {
          //     url:
          //       'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
          //     size: { width: 5, height: 5, equals: _ => {} },
          //   },
          // }}
          onClick={onToggleOpen('work')}
        >
          {isOpen.work && (
            <InfoWindow onCloseClick={onToggleOpen('work')}>
              <Work />
            </InfoWindow>
          )}
        </Marker>
      )}
      {checkBox.trace && usersData && usersData.length && (
        <Polyline
          path={usersData[0].trace}
          options={{
            strokeColor: '#ff0000',
          }}
        />
      )}
      {checkBox.poi &&
        usersData &&
        usersData.length &&
        usersData[0].poi.map(
          (elem: { lat: string; lng: string }, index: number) => {
            return (
              <Marker
                key={index}
                position={{
                  lat: parseFloat(elem.lat),
                  lng: parseFloat(elem.lng),
                }}
                options={{
                  opacity: 0.5,
                }}
                onClick={onToggleOpen('work')}
              />
            );
          }
        )}
      {/* <InfoBoxDemo /> */}
      {/* <DirectionsDemo /> */}
    </GoogleMap>
  );
});

export default GoogleMaps;
