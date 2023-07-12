import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../Redux/store';

interface MapComponentProps {
  selectedLocation: any; // Adjust the type according to your data structure
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation }) => {
  const userPosition = useAppSelector((state) => state.location.position);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.Marker | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (selectedLocation !== undefined) {
      clearMarkers(); // Clear previous markers before creating new ones
      clearDirections(); // Clear previous directions before creating new ones

      const mapContainer = mapContainerRef.current;
      if (!mapContainer) {
        console.error('Map container not found.');
        return;
      }

      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapContainer, { zoom: 12 });
      }
      if (userPosition && selectedLocation) {
        const { latitude, longitude } = userPosition.coords;
        const userLatLng = new google.maps.LatLng(latitude, longitude);
        const restolatLng = new google.maps.LatLng(
          selectedLocation.lat,
          selectedLocation.long
        );

        mapRef.current.setCenter(userLatLng);

        const userMarker = new google.maps.Marker({
          position: userLatLng,
          map: mapRef.current,
        });
        const restoMarker = new google.maps.Marker({
          position: restolatLng,
          map: mapRef.current,
        });

        setSelectedMarker(restoMarker);

        const directionsService = new google.maps.DirectionsService();
        const newDirectionsRenderer = new google.maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: true, // Do not display default markers
          preserveViewport: true, // Keep the map view focused on the directions
          polylineOptions: {
            strokeColor: 'red',
            strokeWeight: 5,
          },
        });

        setDirectionsRenderer(newDirectionsRenderer);

        // Request directions from Directions API
        directionsService.route(
          {
            origin: userLatLng,
            destination: restolatLng,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (
            response: google.maps.DirectionsResult | null,
            status: google.maps.DirectionsStatus
          ) => {
            if (status === google.maps.DirectionsStatus.OK && response) {
              newDirectionsRenderer.setDirections(response);
              const bounds = response.routes[0].bounds;
              mapRef.current?.fitBounds(bounds);
            }
          }
        );
      }
    }
  }, [selectedLocation]);

  const clearMarkers = () => {
    if (selectedMarker) {
      selectedMarker.setMap(null);
    }
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
  };

  return (
    <div
      id='map'
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default React.memo(MapComponent);
