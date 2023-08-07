import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { adressService } from "../../services/api/adress.api";
import { useTranslation } from "react-i18next";
import "./Location.css";
interface MapProps {
  apiKey: string | undefined;
  width?: number;
  height?: number;
}

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuIcon from "@mui/icons-material/Menu";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { localStorageService } from "../../services/localStorageService";
import { stringify } from "querystring";
import { LocationService } from "../../services/api/Location.api";

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

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AdressComponentProps {
  type: string;
  region: string;
  street: string;
  long: number;
  lat: number;
  children?: React.ReactNode;
}

const AdressComponent: React.FC<AdressComponentProps> = ({
  type,
  street,
  region,
  lat,
  long,
}) => {
  const dispatch = useAppDispatch();

  const changeAdress = () => {
    dispatch({
      type: "SET_LOCATION",
      payload: {
        coords: {
          latitude: lat,
          longitude: long,
          label: street + region,
        },
      },
    });
  };
  return (
    <div onClick={() => changeAdress()} className="adressCompContainer">
      <header>
        <div className="type">
          <HomeRoundedIcon className="home-icon"></HomeRoundedIcon>
          {type}
        </div>
        <MenuIcon></MenuIcon>
      </header>
      <div className="labels">
        <p>
          {street}, <br /> {region}
        </p>
      </div>
    </div>
  );
};

const Map = (props: any) => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState<string>("");
  const [clientAdressTable, setClientAdressTable] = useState([]);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [getCurrentLocation, setGetCurrentLocation] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userPosition = useAppSelector((state) => state.location.position);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [previousMarker, setPreviousMarker] =
    useState<google.maps.Marker | null>(null);
  const [searchType, setSearchType] = useState("");

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  // read client adresses
  useEffect(() => {
    const userItem = localStorageService.getUser();
    const fetchData = async () => {
      let res = await adressService.getAdressByid(JSON.parse(userItem!).id);
      setClientAdressTable(res.data.data);
    };
    userItem != null ? fetchData() : console.log("no user connected");
  }, []);

  // useEffect(() => {
  //   console.log(clientAdressTable);
  // }, [clientAdressTable]);

  useEffect(() => {
    if (previousMarker) {
      previousMarker.setMap(null);
    }

    const mapContainer = mapContainerRef.current;
    if (!mapContainer) {
      console.error("Map container not found.");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapContainer, {
        zoom: 12,
      });
      google.maps.event.addListener(mapRef.current, "click", handleMapClick);
    }

    if (userPosition) {
      const { latitude, longitude } = userPosition.coords;
      const latLng = new google.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(latLng);

      if (!marker) {
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: mapRef.current,
          title: t("yourLocation"),
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
  }, [userPosition, searchType]);

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
        LocationService.geoCode(latitude, longitude).then(data => {
          dispatch({
            type: "SET_LOCATION",
            payload: {
              ... data
            },
          });
        });
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
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          LocationService.geoCode(lat, lng).then(data => {
            dispatch({
              type: "SET_LOCATION",
              payload: {
                ... data
              },
            });
          });

        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
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
      title: "Selected Location",
    });
    setMarker(newMarker);

    // Geocode the new location
    LocationService.geoCode(latLng?.lat(), latLng?.lng()).then(data => {
      dispatch({
        type: "SET_LOCATION",
        payload: {
          ... data
        },
      });
    });
  };
  const userItem = localStorageService.getUser();

  switch (searchType) {
    case "":
      return (
        <div className="container-map">
          <div className="map-container">
            <div className="form">
              <h1>Ajouter un adress de livraison</h1>

              {/*  gps location button */}
              <button type="button" onClick={getPosition}>
                {t("getLocationButton")}{" "}
                <NearMeOutlinedIcon></NearMeOutlinedIcon>
              </button>
              {/*  map location button */}
              <button type="button" onClick={() => setSearchType("card")}>
                {t("adress.cartSelect")}{" "}
                <NearMeOutlinedIcon></NearMeOutlinedIcon>
              </button>

              {/*  search location button */}
              <button
                type="button"
                onClick={() => {
                  setSearchType("search");
                  setOpen(true);
                }}
              >
                {t("adress.searchWithAdress")}{" "}
                <NearMeOutlinedIcon></NearMeOutlinedIcon>
              </button>
            </div>

            <div
              style={{ display: userItem ? "inline" : "none" }}
              className="Text-container"
            >
              <p>{t("adress.message1")}</p>
            </div>

            {clientAdressTable.length > 0 ? (
              <div className="adresses-container">
                {clientAdressTable.map((element) => (
                  <AdressComponent
                    type={element["label"]}
                    street={element["street"]}
                    region={element["region"]}
                    long={element["long"]}
                    lat={element["lat"]}
                  ></AdressComponent>
                ))}
              </div>
            ) : (
              <h6 style={{ display: userItem ? "inline" : "none" }}>
                no saved adress to display
              </h6>
            )}
          </div>
        </div>
      );
    case "card":
      return (
        <div className="container-map container-card">
          <div className="map-containerr">
            <div className="cancel-icon-container">
              <ClearRoundedIcon
                onClick={() => setSearchType("")}
                className="cancel-icon"
              ></ClearRoundedIcon>
            </div>

            <p>Indique votre adress sur la carte</p>
            <div id="map" ref={mapContainerRef}></div>
            {userItem ? (
              <button
                type="button"
                className="submit-cart"
                onClick={handleSubmit}
              >
                Sélectionner
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      );
    case "search":
      return (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                <label htmlFor="location-input" className="dialog-adress-label">
                  {t("searchPlaceholder")}:
                </label>
                <input
                  type="text"
                  id="location-input"
                  value={userInput}
                  onChange={handleUserInput}
                  onKeyDown={handleKeyDown}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleSubmit}>
                Sélectionner
              </Button>
              <Button onClick={() => setSearchType("")} autoFocus>
                Back
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
  }
  return null;
};

export default Map;
