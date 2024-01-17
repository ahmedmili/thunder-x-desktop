import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { adressService } from "../../services/api/adress.api";
import "./Location.scss";


import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import HomeLocation from '../../assets/home-location.svg';

import {
  homeLoadingSelector,
  regionHomeSelector
} from "../../Redux/slices/home";
import { LocationService } from "../../services/api/Location.api";
import { localStorageService } from "../../services/localStorageService";
import AutocompleteInput from "./AutocompleteInput/AutocompleteInput";
import MapCard from "./mapCard/MapCard";

declare global {
  interface Window {
    initMap: () => void;
  }
}

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

interface AdressComponentProps {
  type: string;
  region: string;
  street: string;
  long: number;
  lat: number;
  children?: React.ReactNode;
}

interface MapProps {
  className?: string;
  forced?: boolean

}

const Map: React.FC<MapProps> = ({ className, forced = false }) => {
  const { t } = useTranslation();
  const [clientAdressTable, setClientAdressTable] = useState([]);
  const dispatch = useAppDispatch();
  const [searchType, setSearchType] = useState("");
  const [showMapComponent, setShowMapComponent] = useState<boolean>(false);
  const region = useSelector(regionHomeSelector);
  const location = localStorageService.getCurrentLocation()
  const isLoading = useSelector(homeLoadingSelector);
  const userLocation = useAppSelector((state) => state.location.position);

  const [mapDisabled, setMapState] = useState<boolean>(false);

  useEffect(() => {
    const disableScroll = (e: any) => {
      e.preventDefault();
    };

    window.addEventListener('scroll', disableScroll);
    return () => {
      window.removeEventListener('scroll', disableScroll);
    };
  }, []);

  const handleMapState = (value: any) => {
    setMapState(value)
  }

  // read client adresses
  useEffect(() => {
    const userItem = localStorageService.getUser();
    const fetchData = async () => {
      let res = await adressService.getAdressByid(JSON.parse(userItem!).id);
      setClientAdressTable(res.data.data);
    };
    userItem != null && fetchData();
  }, []);

  const userItem = localStorageService.getUser();
  const handleShowMapComponent = () => {
    setShowMapComponent((current) => !current)
  }
  const cancel = () => {
    if (searchType === "") {
      const location = localStorageService.getCurrentLocation()
      if (location) {
        if (region) {
          dispatch({ type: "SET_SHOW", payload: false })
        }
        else {
          console.log("zone not available");
        }
      }
      else {
        forced ? console.log("you dont have location") : dispatch({ type: "SET_SHOW", payload: false })

      }
    }
    else {
      setSearchType("")
    }
  };

  return (
    <>
      <div className={`location-container ${className ? className : ""}`}>
        <div className="cancel-icon-container">
          <ClearRoundedIcon
            onClick={cancel}
            className="cancel-icon"
          ></ClearRoundedIcon>
        </div>
        <Options />
      </div>
    </>
  )

  function Options() {
    const [selectedOption, setSelectedOption] = useState<number>(1);

    const handleOptionChange = (event: any) => {
      setSelectedOption(parseInt(event.target.value));
    };

    const filtredPositions = clientAdressTable.filter((pos: any) => {
      return pos.type == selectedOption;
    })

    const getCurrentPosition = () => {

      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          handleMapState(false);
          let pos = position.coords
          const { latitude, longitude } = pos;
          LocationService.geoCode(latitude, longitude).then(data => {
            dispatch({
              type: "SET_LOCATION",
              payload: {
                ...data
              },
            });
          });
        },
        (error: GeolocationPositionError) => {
          handleMapState(true);
          setTimeout(() => {
            handleMapState(false);
          }, 2000);
        }
      );
    };
    return (
      <Container className="modal-container modal-location">
        <h1 className="modal-title text-center">{t('adress.add')}</h1>
        <div className="modal-location_wrap">
          <div className='modal-location_wrap-blc'>
            <div className="form">

              {/*
                <label>{t('adress.delivAddress')}</label>
              */}
              <div className="adresses_container">
                <AutocompleteInput initLocation={true} />
              </div>
              <div className="address-notfound-area d-none">
                <div className="address-notfound-msg-err">
                  {t('adress.adressIntrouvable')}
                </div>
                <div className="address-notfound-content">
                  <p>{t('AvailabelAt')} :</p>
                  <div className="btns-group">
                    <button className="btn btn-adress">Sousse</button>
                    <button className="btn btn-adress">Monastir</button>
                    <button className="btn btn-adress">Mahdia</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="current-position">
              <div className="current-position_input-blc" onClick={getCurrentPosition}>
                <input readOnly className="form-control" type="text" placeholder={`${userLocation ? userLocation.coords.label : t('adress.currentPos')} `} />
              </div>
            </div>
            {mapDisabled && (
              <div className='error'>{t('adress.browserLocationAcessRequest')}</div>
            )}
            {clientAdressTable.length > 0 &&
              <div className="saved-adresses-area">
                <p className="saved-adresses-title">{t('adress.savedAdress')}</p>
                <div className="location-filtre">
                  <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                    <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                    <label htmlFor="domicile">{t("domicile")}</label>
                  </div>
                  <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                    <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                    <label htmlFor="travail"> {t("tavail")}</label>
                  </div>
                  <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                    <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
                    <label htmlFor="autre">{t("autre")}</label>
                  </div>
                </div>
              </div>
            }
            {filtredPositions.length > 0 ? (
              <>
                <div className="adresses-container">
                  {filtredPositions.map((element) => (
                    <>
                      <AdressComponent
                        type={element["label"]}
                        street={element["street"]}
                        region={element["region"]}
                        long={element["long"]}
                        lat={element["lat"]}
                      ></AdressComponent>
                    </>
                  ))}
                </div>
              </>

            ) : (
              <></>
            )
            }
          </div>


          <div className="select-map-area">
            <button onClick={handleShowMapComponent} className="btn btn-select-map">{t('adress.cartSelect')}</button>
          </div>
          {
            showMapComponent &&
            <div className='modal-location_wrap-blc'>
              <MapCard cancel={cancel} />
            </div>
          }
        </div>
      </Container>
    )
  }

  function AdressComponent({
    type,
    street,
    region,
    lat,
    long,
  }: AdressComponentProps) {

    const changeAdress = () => {
      dispatch({
        type: "SET_LOCATION",
        payload: {
          coords: {
            latitude: lat,
            longitude: long,
            label: type,
          },
        },
      });
    };
    return (
      <div onClick={changeAdress} className="adressCompContainer">
        <header>
          <div className="type">
            <div className="label">
              <div className="position-icon" style={{ backgroundImage: `url(${HomeLocation})` }} ></div>
              <span>{type}</span>
            </div>
          </div>
          <p className="position-name">
            {street}, <br /> {region}
          </p>
        </header>

      </div>
    );
  }
};
export default Map;
