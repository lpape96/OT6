import React from 'react';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

const InfoBoxDemo = () => {
  return (
    <InfoBox
      defaultPosition={new google.maps.LatLng({ lat: 45.73, lng: 4.83 })}
    >
      <div
        style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}
      >
        <div style={{ fontSize: `16px`, color: `#08233B` }}>
          Je suis un carré jaune
        </div>
      </div>
    </InfoBox>
  );
};

export default InfoBoxDemo;
