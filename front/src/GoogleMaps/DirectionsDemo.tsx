import React, { useEffect } from 'react';
import { DirectionsRenderer } from 'react-google-maps';

const DirectionsDemo = () => {
  let directions; // To verify

  useEffect(() => {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: new google.maps.LatLng(45.71, 4.81),
        destination: new google.maps.LatLng(45.77, 4.87),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (
        result: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directions = result;
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, []);

  console.log(directions);

  return <DirectionsRenderer directions={directions} />;
};

export default DirectionsDemo;
