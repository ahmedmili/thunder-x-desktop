import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface MapProps {
  apiKey: string | undefined;
  width?: number;
  height?: number;
}

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

declare global {
  interface Window {
    initMap: () => void;
  }
}

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  min-width: 400px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  #map {
    height: 100%;
    width: 100%;
    margin: 0 auto;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    input {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      width: 100%;
      max-width: 500px;
      font-size: 16px;

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #2db2b1;
        border-color: #0077ff;
      }
    }

    button {
      padding: 10px;
      border-radius: 5px;
      border: none;
      background-color: #2db2b1;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #005ab5;
      }
    }
  }

  button {
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #2db2b1;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: auto;
    margin-right: 0;
    margin-top: 20px;

    &:hover {
      background-color: #005ab5;
    }
  }
`;
const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const Map: React.FC<MapProps> = (props) => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState<string>('');
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [getCurrentLocation, setGetCurrentLocation] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userPosition = useAppSelector((state) => state.location.position);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [previousMarker, setPreviousMarker] =
    useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (previousMarker) {
      previousMarker.setMap(null);
    }

    const mapContainer = mapContainerRef.current;
    if (!mapContainer) {
      console.error('Map container not found.');
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapContainer, {
        zoom: 12,
      });
      google.maps.event.addListener(mapRef.current, 'click', handleMapClick);
    }

    if (userPosition) {
      const { latitude, longitude } = userPosition.coords;
      const latLng = new google.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(latLng);

      if (!marker) {
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: mapRef.current,
          title: t('yourLocation'),
        });
        setMarker(newMarker);
      } else {
        marker.setPosition(latLng);
        setPreviousMarker(marker);
      }
    } else {
      // Remove the initial marker that loads with the component
      if (marker) {
        marker.setMap(null);
        setMarker(null);
        setPreviousMarker(null);
      }
    }
  }, [userPosition]);

  const clearMarkers = () => {
    if (previousMarker) {
      previousMarker.setMap(null);
    }
  };

  const getPosition = () => {
    setGetCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position: Position) => {
        const { latitude, longitude } = position.coords;
        geoCode(latitude, longitude);
        if (mapRef.current) {
          const currentPosition = { lat: latitude, lng: longitude };
          setPreviousMarker(marker);
          const newMarker = new google.maps.Marker({
            position: currentPosition,
            map: mapRef.current,
          });
          setMarker(newMarker);
          mapRef.current.setCenter(currentPosition);
        }
      },
      (error: GeolocationPositionError) => {
        toast.error(error.message);
      }
    );
  };

  const handleUserInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(event.target.value);
    },
    []
  );

  const handleSubmit = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${googleMapKey}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          await geoCode(lat, lng);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const geoCode = (latitude: any, longitude: any) => {
    if (latitude && longitude) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapKey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: 'SET_LOCATION',
            payload: {
              coords: {
                latitude: latitude,
                longitude: longitude,
                label: data?.results.length
                  ? data.results[1].formatted_address
                  : null,
              },
            },
          });
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (previousMarker) {
      previousMarker.setMap(null);
    }
    // Remove the previous marker

    // Create a new marker
    const latLng = event.latLng;
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: mapRef.current,
      title: 'Selected Location',
    });
    setMarker(newMarker);

    // Geocode the new location
    geoCode(latLng?.lat(), latLng?.lng());
  };

  return (
    <div
      style={{ height: props.height ?? '400px', width: props.width ?? '100%' }}>
      <MapContainer>
        <div className='form'>
          <table>
            <tr>
              <td>
                <label htmlFor='location-input'>
                  {t('searchPlaceholder')}:
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type='text'
                  id='location-input'
                  value={userInput}
                  onChange={handleUserInput}
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td>
                <button type='button' onClick={handleSubmit}>
                  {t('searchButton')}
                </button>
                <button type='button' onClick={getPosition}>
                  {t('getLocationButton')}
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div
          id='map'
          ref={mapContainerRef}
          style={{ height: '100%', width: '100%' }}></div>
      </MapContainer>
    </div>
  );
};

export default Map;
