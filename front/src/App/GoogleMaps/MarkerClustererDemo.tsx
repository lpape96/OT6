import React from 'react';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { Marker } from 'react-google-maps';

const MarkerClustererDemo = () => {
  const onMarkerClustererClick = (markerClusterer: any) => {
    const clickedMarkers = markerClusterer.getMarkers();
    console.log(`Current clicked markers length: ${clickedMarkers.length}`);
    console.log(clickedMarkers);
  };

  return (
    <MarkerClusterer
      onClick={onMarkerClustererClick}
      averageCenter={true}
      enableRetinaIcons={true}
      gridSize={60}
    >
      <Marker position={{ lat: 45.74001, lng: 4.84 }} />
      <Marker position={{ lat: 45.74002, lng: 4.84 }} />
      <Marker position={{ lat: 45.74003, lng: 4.84 }} />
      <Marker position={{ lat: 45.74004, lng: 4.84 }} />
      <Marker position={{ lat: 45.74005, lng: 4.84 }} />
      <Marker position={{ lat: 45.74006, lng: 4.84 }} />
    </MarkerClusterer>
  );
};

export default MarkerClustererDemo;
